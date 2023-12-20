import { _decorator, Canvas, Component, EventKeyboard, find, Input, input, KeyCode, Label, Node, Sprite, SpriteFrame, Vec3 } from 'cc';
import { NetworkManager } from './Managers/NetworkManager';
import { PaddleState } from './Enums/PaddleState';
const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {
	private canvas: Canvas
	private backgroundNode: Node
	private background: Sprite
	private hud: Node

	private leftPlayerAvatarNode: Node
	private leftPlayerAvatar: Sprite
	private leftPlayerUsernameNode: Node
	private leftPlayerUsername: Label
	private leftPlayerScoreNode: Node
	private leftPlayerPaddleNode: Node

	private leftPlayerScore: Label
	private rightPlayerAvatarNode: Node
	private rightPlayerAvatar: Sprite
	private rightPlayerUsernameNode: Node
	private rightPlayerUsername: Label
	private rightPlayerScoreNode: Node
	private rightPlayerScore: Label
	private rightPlayerPaddleNode: Node

	private ballNode: Node
	private topWallNode: Node
	private topWallSprite: Sprite
	private bottomWallNode: Node
	private bottomWallSprite: Sprite
	private leftWallNode: Node
	private leftWallSprite: Sprite
	private rightWallNode: Node
	private rightWallSprite: Sprite

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
		this.leftPlayerPaddleNode = find('LeftPaddle', this.node)
		this.rightPlayerPaddleNode = find('RightPaddle', this.node)

		this.rightPlayerAvatarNode = find('GameHUD/ScoreLayout/ScoreFrameLayout/RightPlayerLayout/Avatar', this.node)
		this.rightPlayerAvatar = this.rightPlayerAvatarNode.getComponent(Sprite)
		this.rightPlayerUsernameNode = find('GameHUD/ScoreLayout/ScoreFrameLayout/RightPlayerLayout/UsernameLayout/Username', this.node)
		this.rightPlayerUsername = this.rightPlayerUsernameNode.getComponent(Label)
		this.rightPlayerScoreNode = find('GameHUD/ScoreLayout/ScoreFrameLayout/ScoreValueLayout/ScoreRight', this.node)
		this.rightPlayerScore = this.rightPlayerScoreNode.getComponent(Label)

		this.ballNode = find('Ball', this.node)
		this.topWallNode = find('TopWall', this.node)
		this.topWallSprite = this.topWallNode.getComponent(Sprite)
		this.bottomWallNode = find('BottomWall', this.node)
		this.topWallSprite = this.bottomWallNode.getComponent(Sprite)
		this.leftWallNode = find('LeftWall', this.node)
		this.topWallSprite = this.leftWallNode.getComponent(Sprite)
		this.rightWallNode = find('RightWall', this.node)
		this.topWallSprite = this.rightWallNode.getComponent(Sprite)
	}

	protected onEnable(): void {
		input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this)
		input.on(Input.EventType.KEY_UP, this.onKeyUp, this)
	}

	protected onDisable(): void {
		input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this)
		input.off(Input.EventType.KEY_UP, this.onKeyUp, this)
	}

	onKeyDown(event: EventKeyboard) {
		switch(event.keyCode) {
			case KeyCode.KEY_W:
				NetworkManager.inst.movePaddle(PaddleState.Up)
				break

			case KeyCode.KEY_S:
				NetworkManager.inst.movePaddle(PaddleState.Down)
				break
		}
	}

	onKeyUp(event: EventKeyboard) {
		switch(event.keyCode) {
			case KeyCode.KEY_W:
				NetworkManager.inst.movePaddle(PaddleState.Stop)
				break

			case KeyCode.KEY_S:
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

	moveLeftPlayer(position: number) {
		this.leftPlayerPaddleNode.setPosition(this.leftPlayerPaddleNode.position.x, position, 0)
	}

	moveRightPlayer(position: number) {
		this.rightPlayerPaddleNode.setPosition(this.rightPlayerPaddleNode.position.x, position, 0)
	}

	moveBall(position: Vec3) {
		this.ballNode.position = position
	}
}


