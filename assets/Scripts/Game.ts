import { _decorator, Canvas, Component, EventKeyboard, find, game, Input, input, KeyCode, Label, Node, resources, Sprite, SpriteFrame, UITransform, Vec3 } from 'cc';
import Colyseus from 'db://colyseus-sdk/colyseus.js'
import { NetworkManager } from './Managers/NetworkManager';
import { PaddleState } from './Enums/PaddleState';
import { GameManager } from './Managers/GameManager';
import { ShapeType } from './Enums/ShapeType';
import { BodyType } from './Enums/BodyType';
import { ObjectType } from './Enums/ObjectType';
import { WorldObject } from './Components/WorldObject';
import { Bind } from './Components/Keybinds';
const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {
	// Game canvas, background, HUD and keybinds
	private canvas: Canvas
	private backgroundNode: Node
	private background: Sprite
	private hud: Node
	private keybinds: Map<Bind, KeyCode> = new Map<Bind, KeyCode>()

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
	public objects: Map<string, WorldObject> = new Map<string, WorldObject>()

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

	instantiateObject(object, key: string): WorldObject{
		const worldObject: WorldObject = new WorldObject(object.id, this.node, object.position, object.size, object.shapeType, object.bodyType, object.texture)

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
				break

			case ObjectType.RightPaddle:
				this.rightPaddle = worldObject
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
	}

	updateKeybinds(keybinds: Map<Bind, KeyCode>) {
		this.keybinds = keybinds
	}

	onKeyDown(event: EventKeyboard) {
		switch(event.keyCode) {
			case this.keybinds.get(Bind.Upward):
				NetworkManager.inst.movePaddle(PaddleState.Up)
				break

			case this.keybinds.get(Bind.Downward):
				NetworkManager.inst.movePaddle(PaddleState.Down)
				break
		}
	}

	onKeyUp(event: EventKeyboard) {
		switch(event.keyCode) {
			case this.keybinds.get(Bind.Upward):
				NetworkManager.inst.movePaddle(PaddleState.Stop)
				break

			case this.keybinds.get(Bind.Downward):
				NetworkManager.inst.movePaddle(PaddleState.Stop)
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
		if (leftPlayerScore != undefined) {
			this.leftPlayerScore.string = String(leftPlayerScore)
		}
	}

	setRightPlayerScore(rightPlayerScore: number) {
		if (rightPlayerScore) {
			this.rightPlayerScore.string = String(rightPlayerScore)
		}
	}

	setScores(leftPlayerScore: number, rightPlayerScore: number) {
		if (leftPlayerScore != undefined) {
			this.leftPlayerScore.string = String(leftPlayerScore)
		}

		if (rightPlayerScore != undefined) {
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


