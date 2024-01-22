import { _decorator, Canvas, Component, EventKeyboard, find, Input, input, KeyCode, Label, lerp, Node, Sprite, SpriteFrame, AnimationComponent, Vec2, Vec3, Camera, director } from 'cc'
import { NetworkManager } from 'db://assets/Scripts/Managers/NetworkManager'
import { EntityType } from 'db://assets/Scripts/Enums/EntityType'
import { WorldEntity } from 'db://assets/Scripts/Components/WorldEntity'
import { Bind } from 'db://assets/Scripts/Components/Keybinds'
import { GameState } from 'db://assets/Scripts/Enums/GameState'
import { AudioManager } from 'db://assets/Scripts/Managers/AudioManager'
import { InputState, Inputs } from 'db://assets/Scripts/Components/Inputs'
import { SnapshotInterpolation } from 'db://assets/Scripts/Components/SnapshotInterpolation'
import { Vault } from 'db://assets/Scripts/Components/Vault'
import { EntityState } from './Components/EntityState'
const { ccclass, property } = _decorator

@ccclass('Game')
export class Game extends Component {
	// Game camera, canvas, background, HUD
	private cameraNode: Node
	private camera: Camera
	private canvas: Canvas
	private backgroundNode: Node
	private background: Sprite
	private hud: Node
	private paddleId: string

	// Networking stuff
	private lastServerTick: number

	private snapshotInterpolation: SnapshotInterpolation
	private playerVault: Vault
	// Keybinds and inputs
	private keybinds: Map<Bind, KeyCode> = new Map<Bind, KeyCode>()
	private inputs: Inputs = new Inputs()
	private previousInputs: InputState

	// Score frame
	private scoreFrameNode: Node
	private scoreFrameAnimation: AnimationComponent
	private scoreVisible: boolean = false
	private scoreSlideOutTimeout

	// Left Player UI
	private leftPlayerAvatarNode: Node
	private leftPlayerAvatar: Sprite
	private leftPlayerUsernameNode: Node
	private leftPlayerUsername: Label
	private leftPlayerScoreNode: Node
	private leftPlayerScore: Label
	private leftPlayerScoreAnimation: AnimationComponent

	// Right Player UI
	private rightPlayerAvatarNode: Node
	private rightPlayerAvatar: Sprite
	private rightPlayerUsernameNode: Node
	private rightPlayerUsername: Label
	private rightPlayerScoreNode: Node
	private rightPlayerScore: Label
	private rightPlayerScoreAnimation: AnimationComponent

	// Objects
	public topWall: WorldEntity
	public bottomWall: WorldEntity
	public leftWall: WorldEntity
	public rightWall: WorldEntity
	public leftPaddle: WorldEntity
	public rightPaddle: WorldEntity
	public ball: WorldEntity
	public entities: Map<string, WorldEntity>

	// Previous score
	private leftScore: number
	private rightScore: number

	protected onLoad(): void {
		this.cameraNode = director.getScene().getChildByName('GameCamera')
		this.camera = this.cameraNode.getComponent(Camera)
		this.canvas = this.node.getComponent(Canvas)
		this.backgroundNode = this.node.getChildByName('GameBackground')
		this.background = this.backgroundNode.getComponent(Sprite)
		this.hud = this.node.getChildByName('GameHUD')
		this.hideHUD()

		this.scoreFrameNode = find('GameHUD/ScoreLayout/ScoreFrameLayout', this.node)
		this.scoreFrameAnimation = this.scoreFrameNode.getComponent(AnimationComponent)
		this.leftPlayerAvatarNode = find('LeftPlayerLayout/Avatar', this.scoreFrameNode)
		this.leftPlayerAvatarNode = find('LeftPlayerLayout/Avatar', this.scoreFrameNode)
		this.leftPlayerAvatar = this.leftPlayerAvatarNode.getComponent(Sprite)
		this.leftPlayerUsernameNode = find('LeftPlayerLayout/UsernameLayout/Username', this.scoreFrameNode)
		this.leftPlayerUsername = this.leftPlayerUsernameNode.getComponent(Label)
		this.leftPlayerScoreNode = find('ScoreValueLayout/ScoreLeft', this.scoreFrameNode)
		this.leftPlayerScore = this.leftPlayerScoreNode.getComponent(Label)
		this.leftPlayerScoreAnimation = this.leftPlayerScoreNode.getComponent(AnimationComponent)

		this.rightPlayerAvatarNode = find('RightPlayerLayout/Avatar', this.scoreFrameNode)
		this.rightPlayerAvatar = this.rightPlayerAvatarNode.getComponent(Sprite)
		this.rightPlayerUsernameNode = find('RightPlayerLayout/UsernameLayout/Username', this.scoreFrameNode)
		this.rightPlayerUsername = this.rightPlayerUsernameNode.getComponent(Label)
		this.rightPlayerScoreNode = find('ScoreValueLayout/ScoreRight', this.scoreFrameNode)
		this.rightPlayerScore = this.rightPlayerScoreNode.getComponent(Label)
		this.rightPlayerScoreAnimation = this.rightPlayerScoreNode.getComponent(AnimationComponent)

		this.leftScore = 0
		this.rightScore = 0
		this.entities = new Map<string, WorldEntity>()
		this.snapshotInterpolation = new SnapshotInterpolation(20) // Server's target update rate is 20
		this.playerVault = new Vault()
		this.previousInputs = { upward: false, downward: false, powerup: false }
	}

	protected onEnable(): void {
		input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this)
		input.on(Input.EventType.KEY_UP, this.onKeyUp, this)
	}

	protected onDisable(): void {
		input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this)
		input.off(Input.EventType.KEY_UP, this.onKeyUp, this)
	}

	protected update(dt: number): void {
		if (NetworkManager.inst && NetworkManager.inst.getGameRoom && NetworkManager.inst.getGameRoom.state.gameState === GameState.Playing) {

			const serverTick = NetworkManager.inst.getGameRoom.state.tick
			if (serverTick != this.lastServerTick) {
				this.lastServerTick = serverTick
				const entitiesStates: EntityState[] = []
				this.entities.forEach((entity) => {
					entitiesStates.push(entity.state)
				})
				const snapshot = this.snapshotInterpolation.snapshot.create(entitiesStates)
				this.snapshotInterpolation.snapshot.add(snapshot)
			}

			if (this.entities) {
				this.clientPrediction()
				this.serverReconciliation()
				const snapshot = this.snapshotInterpolation.calcInterpolation('x y z')
				if (snapshot) {
					snapshot.state.forEach((entityState) => {
						const entity = this.entities.get(entityState.id)
						if (entity) {
							if (entity.id === this.paddleId) {
								return
							} else {
								entity.moveToVector(entityState.position)
							}
						}
					})
				}
			}
		}
	}

	clientPrediction() {
		// Send inputs
		if (!this.inputs.compare(this.previousInputs)) {
			const inputs = this.inputs.getInputs
			console.log(`sending ${inputs.upward} ${inputs.downward}`)
			NetworkManager.inst.sendInputs(inputs)
			this.previousInputs = inputs

			// Apply move locally
			const localPlayerEntity = this.entities.get(this.paddleId)
			if (localPlayerEntity) {
				localPlayerEntity.moveInputs(inputs)
				const position = localPlayerEntity.node.getPosition()
				const quaternion = localPlayerEntity.node.getRotation()
				const size = localPlayerEntity.node.getScale()
				const velocity: Vec3 = new Vec3()
				const angularVelocity: Vec3 = new Vec3()

				localPlayerEntity.body.getLinearVelocity(velocity)
				localPlayerEntity.body.getAngularVelocity(angularVelocity)

				this.playerVault.add(this.snapshotInterpolation.snapshot.create([{
					id: localPlayerEntity.id,
					position,
					quaternion,
					size,
					velocity,
					angularVelocity
				}]))
			}
		}

	}
	serverReconciliation() {
		const inputs = this.inputs.getInputs
		const localPlayerEntity = this.entities.get(this.paddleId)
	
		if (localPlayerEntity) {
			const serverSnapshot = this.snapshotInterpolation.vault.get()
			if (serverSnapshot) {
				const playerSnapshot = this.playerVault.get(serverSnapshot.time, true)
	
				if (playerSnapshot) {
					const serverPos = serverSnapshot.state.find(s => s.id === this.paddleId)
					const offsetX = playerSnapshot.state[0].position.x - serverPos.position.x
					const offsetY = playerSnapshot.state[0].position.y - serverPos.position.y
					const offsetZ = playerSnapshot.state[0].position.z - serverPos.position.z
	
					const offsetMagnitude = Math.sqrt(offsetX * offsetX + offsetY * offsetY + offsetZ * offsetZ)
					
					const isMoving = inputs.upward || inputs.downward
					const correction = isMoving ? 60 : 180
					const newPosition = localPlayerEntity.node.getPosition()
	
					if (offsetMagnitude > 10) {
						newPosition.x = playerSnapshot.state[0].position.x
						newPosition.y = playerSnapshot.state[0].position.y
						newPosition.z = playerSnapshot.state[0].position.z
					} else {
						newPosition.x -= offsetX / correction
						newPosition.y -= offsetY / correction
						newPosition.z -= offsetZ / correction
					}
	
					localPlayerEntity.node.setPosition(newPosition)
				}
			}
		}
	}

	instantiateEntity(entity: any): WorldEntity{
		const worldEntity: WorldEntity = new WorldEntity(entity, entity.id, this.node)

		switch (entity.entityType) {
			case EntityType.TopWall:
				this.topWall = worldEntity
				break
			
			case EntityType.BottomWall:
				this.bottomWall = worldEntity
				break

			case EntityType.LeftWall:
				this.leftWall = worldEntity
				break

			case EntityType.RightWall:
				this.rightWall = worldEntity
				break

			case EntityType.LeftPaddle:
				this.leftPaddle = worldEntity
				if (NetworkManager.inst.getGameRoom.sessionId === NetworkManager.inst.getGameRoom.state.leftPlayer) {
					this.paddleId = worldEntity.id
				}
				break

			case EntityType.RightPaddle:
				this.rightPaddle = worldEntity
				if (NetworkManager.inst.getGameRoom.sessionId === NetworkManager.inst.getGameRoom.state.rightPlayer) {
					this.paddleId = worldEntity.id
				}
				break
				
			case EntityType.Ball:
				this.ball = worldEntity
				break
		}

		this.entities.set(entity.id, worldEntity)
		return worldEntity
	}

	destroyEntity(key: string) {
		if (this.entities) {
			const entity = this.entities.get(key)
			if (entity) {
				entity.destroy()
			}
			this.entities.delete(key)
		} else {
			const existingNode = this.node.getChildByName(key)
			if (existingNode) {
				existingNode.destroy()
			}
		}
	}

	updateKeybinds(keybinds: Map<Bind, KeyCode>) {
		this.keybinds = keybinds
	}

	onKeyDown(event: EventKeyboard) {
		switch(event.keyCode) {
			case this.keybinds.get(Bind.Upward):
				this.inputs.setKeyDown(Bind.Upward)
				break

			case this.keybinds.get(Bind.Downward):
				this.inputs.setKeyDown(Bind.Downward)
				break

			case this.keybinds.get(Bind.Powerup):
				this.inputs.setKeyDown(Bind.Powerup)
				break
		}
	}

	onKeyUp(event: EventKeyboard) {
		switch(event.keyCode) {
			case this.keybinds.get(Bind.Upward):
				this.inputs.setKeyUp(Bind.Upward)
				break

			case this.keybinds.get(Bind.Downward):
				this.inputs.setKeyUp(Bind.Downward)
				break

			case this.keybinds.get(Bind.Powerup):
				this.inputs.setKeyUp(Bind.Powerup)
				break
		}
	}

	setBackground(background: SpriteFrame) {
		if (background != undefined) {
			this.background.spriteFrame = background
		}
	}

	setLeftPlayer(avatar: SpriteFrame, username: string) {
		if (avatar != undefined) {
			this.leftPlayerAvatar.spriteFrame = avatar
		}

		if (username != undefined) {
			this.leftPlayerUsername.string = username
		}
	}

	setRightPlayer(avatar: SpriteFrame, username: string) {
		if (avatar != undefined) {
			this.rightPlayerAvatar.spriteFrame = avatar
		}

		if(username != undefined) {
			this.rightPlayerUsername.string = username
		}
	}

	updateLeftScore() {
		if (this.leftPlayerScore) {
			this.leftPlayerScore.string = String(this.leftScore)
		}
	}

	updateRightScore() {
		if (this.rightPlayerScore) {
			this.rightPlayerScore.string = String(this.rightScore)
		}
	}

	setScores(leftPlayerScore: number, rightPlayerScore: number) {
		this.leftScore = leftPlayerScore
		this.rightScore = rightPlayerScore

		if (this.leftPlayerAvatar && leftPlayerScore) {
			this.leftPlayerScore.string = String(leftPlayerScore)
		}

		if (this.rightPlayerScore && rightPlayerScore) {
			this.rightPlayerScore.string = String(rightPlayerScore)
		}
	}

	showScores(leftScore: number, rightScore: number) {
		if (this.scoreFrameAnimation && !this.scoreVisible && !this.scoreFrameAnimation.getState('scoresSlideIn').isPlaying) {
			this.scoreFrameAnimation.play('scoresSlideIn')
			this.scoreVisible = true
		}

		if (leftScore != this.leftScore) {
			this.leftScore = leftScore
			setTimeout(() => {
				if (this.leftPlayerScoreAnimation) {
					AudioManager.inst.playOneShotUI('score')
					this.leftPlayerScoreAnimation.play('scoresLeftBlink')
				}
			}, 150)
		}

		if (rightScore != this.rightScore) {
			this.rightScore = rightScore
			setTimeout(() => {
				if (this.rightPlayerScoreAnimation) {
					AudioManager.inst.playOneShotUI('score')
					this.rightPlayerScoreAnimation.play('scoresRightBlink')
				}
			}, 150)
		}

		if (this.scoreSlideOutTimeout) {
			clearTimeout(this.scoreSlideOutTimeout)
		}

		this.scoreSlideOutTimeout = setTimeout(() => {
			if (this.scoreFrameAnimation) {
				this.scoreFrameAnimation.play('scoresSlideOut')
				this.scoreVisible = false
			}
		}, 1500)
	}

	showHUD() {
		this.hud.active = true
	}

	hideHUD() {
		this.hud.active = false
	}

	enableCamera() {
		this.camera.enabled = true
	}

	disableCamera() {
		this.camera.enabled = false
	}
}


