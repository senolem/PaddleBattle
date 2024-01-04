import { _decorator, Canvas, Component, EventKeyboard, find, game, Input, input, KeyCode, Label, lerp, Node, resources, Sprite, SpriteFrame, UITransform, Vec3 } from 'cc';
import { NetworkManager } from 'db://assets/Scripts/Managers/NetworkManager';
import { PaddleState } from 'db://assets/Scripts/Enums/PaddleState';
import { ObjectType } from 'db://assets/Scripts/Enums/ObjectType';
import { WorldObject } from 'db://assets/Scripts/Components/WorldObject';
import { Bind } from 'db://assets/Scripts/Components/Keybinds';
import { GameState } from './Enums/GameState';
import { GameManager } from './Managers/GameManager';
const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {
	// Game canvas, background, HUD and keybinds
	private canvas: Canvas
	private backgroundNode: Node
	private background: Sprite
	private hud: Node
	private keybinds: Map<Bind, KeyCode> = new Map<Bind, KeyCode>()
	private paddleId: string

	// Left Player UI
	private leftPlayerAvatarNode: Node
	private leftPlayerAvatar: Sprite
	private leftPlayerUsernameNode: Node
	private leftPlayerUsername: Label
	private leftPlayerScoreNode: Node
	private leftPlayerScore: Label

	// Right Player UI
	private rightPlayerAvatarNode: Node
	private rightPlayerAvatar: Sprite
	private rightPlayerUsernameNode: Node
	private rightPlayerUsername: Label
	private rightPlayerScoreNode: Node
	private rightPlayerScore: Label

	// Objects
	public topWall: WorldObject
	public bottomWall: WorldObject
	public leftWall: WorldObject
	public rightWall: WorldObject
	public leftPaddle: WorldObject
	public rightPaddle: WorldObject
	public ball: WorldObject
	public objects: Map<string, WorldObject>

	protected onLoad(): void {
		this.canvas = this.node.getComponent(Canvas)
		this.backgroundNode = this.node.getChildByName('GameBackground')
		this.background = this.backgroundNode.getComponent(Sprite)
		this.hud = this.node.getChildByName('GameHUD')
		this.hideHUD()

		this.leftPlayerAvatarNode = find('GameHUD/ScoreLayout/ScoreFrameLayout/LeftPlayerLayout/Avatar', this.node)
		this.leftPlayerAvatar = this.leftPlayerAvatarNode.getComponent(Sprite)
		this.leftPlayerUsernameNode = find('GameHUD/ScoreLayout/ScoreFrameLayout/LeftPlayerLayout/UsernameLayout/Username', this.node)
		this.leftPlayerUsername = this.leftPlayerUsernameNode.getComponent(Label)
		this.leftPlayerScoreNode = find('GameHUD/ScoreLayout/ScoreFrameLayout/ScoreValueLayout/ScoreLeft', this.node)
		this.leftPlayerScore = this.leftPlayerScoreNode.getComponent(Label)

		this.rightPlayerAvatarNode = find('GameHUD/ScoreLayout/ScoreFrameLayout/RightPlayerLayout/Avatar', this.node)
		this.rightPlayerAvatar = this.rightPlayerAvatarNode.getComponent(Sprite)
		this.rightPlayerUsernameNode = find('GameHUD/ScoreLayout/ScoreFrameLayout/RightPlayerLayout/UsernameLayout/Username', this.node)
		this.rightPlayerUsername = this.rightPlayerUsernameNode.getComponent(Label)
		this.rightPlayerScoreNode = find('GameHUD/ScoreLayout/ScoreFrameLayout/ScoreValueLayout/ScoreRight', this.node)
		this.rightPlayerScore = this.rightPlayerScoreNode.getComponent(Label)
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
		if (NetworkManager.inst.getGameRoom.state.gameState === GameState.Playing) {
			this.objects.forEach((object) => {
				if (object.id !== this.paddleId) {
					const position = object.node.position.clone()
					position.x = lerp(position.x, object.state.position.x, 0.95)
					position.y = lerp(position.y, object.state.position.y, 0.95)
					object.node.position = position
				} else {
					object.node.position = object.state.position
				}
			})
		}
	}

	instantiateObject(object): WorldObject{
		if (!this.objects) {
			this.objects = new Map<string, WorldObject>()
		}

		const worldObject: WorldObject = new WorldObject(object, object.id, this.node)

		switch (object.objectType) {
			case ObjectType.TopWall:
				this.topWall = worldObject
				break
			
			case ObjectType.BottomWall:
				this.bottomWall = worldObject
				break

			case ObjectType.LeftWall:
				this.leftWall = worldObject
				break

			case ObjectType.RightWall:
				this.rightWall = worldObject
				break

			case ObjectType.LeftPaddle:
				this.leftPaddle = worldObject
				if (NetworkManager.inst.getGameRoom.sessionId === NetworkManager.inst.getGameRoom.state.leftPlayer) {
					this.paddleId = worldObject.id
				}
				break

			case ObjectType.RightPaddle:
				this.rightPaddle = worldObject
				if (NetworkManager.inst.getGameRoom.sessionId === NetworkManager.inst.getGameRoom.state.rightPlayer) {
					this.paddleId = worldObject.id
				}
				break
				
			case ObjectType.Ball:
				this.ball = worldObject
				break
		}

		this.objects.set(object.id, worldObject)
		return worldObject
	}

	destroyObject(key: string) {
		if (this.objects) {
			const gameObject = this.objects.get(key)
			if (gameObject) {
				gameObject.destroy()
			}
			this.objects.delete(key)
		}
		const existingNode = this.node.getChildByName(key)
		if (existingNode) {
			existingNode.destroy()
		}
	}

	updateKeybinds(keybinds: Map<Bind, KeyCode>) {
		this.keybinds = keybinds
	}

	onKeyDown(event: EventKeyboard) {
		switch(event.keyCode) {
			case this.keybinds.get(Bind.Upward):
				NetworkManager.inst.registerKeyDown(Bind.Upward)
				break

			case this.keybinds.get(Bind.Downward):
				NetworkManager.inst.registerKeyDown(Bind.Downward)
				break

			case this.keybinds.get(Bind.Powerup):
				NetworkManager.inst.registerKeyDown(Bind.Powerup)
				break
		}
	}

	onKeyUp(event: EventKeyboard) {
		switch(event.keyCode) {
			case this.keybinds.get(Bind.Upward):
				NetworkManager.inst.registerKeyUp(Bind.Upward)
				break

			case this.keybinds.get(Bind.Downward):
				NetworkManager.inst.registerKeyUp(Bind.Downward)
				break

			case this.keybinds.get(Bind.Powerup):
				NetworkManager.inst.registerKeyUp(Bind.Powerup)
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

	setLeftPlayerScore(leftPlayerScore: number) {
		if (this.leftPlayerAvatar && leftPlayerScore) {
			this.leftPlayerScore.string = String(leftPlayerScore)
		}
	}

	setRightPlayerScore(rightPlayerScore: number) {
		if (this.rightPlayerScore && rightPlayerScore) {
			this.rightPlayerScore.string = String(rightPlayerScore)
		}
	}

	setScores(leftPlayerScore: number, rightPlayerScore: number) {
		if (this.leftPlayerAvatar && leftPlayerScore) {
			this.leftPlayerScore.string = String(leftPlayerScore)
		}

		if (this.rightPlayerScore && rightPlayerScore) {
			this.rightPlayerScore.string = String(rightPlayerScore)
		}
	}

	showHUD() {
		this.hud.active = true
	}

	hideHUD() {
		this.hud.active = false
	}
}


