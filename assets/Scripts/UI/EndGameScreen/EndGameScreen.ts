import { _decorator, Button, Component, find, Label, Node, Sprite } from 'cc'
import { AudioManager } from 'db://assets/Scripts/Managers/AudioManager'
import { NetworkManager } from 'db://assets/Scripts/Managers/NetworkManager'
import { EndGameScreenData } from 'db://assets/Scripts/Components/EndGameScreenData'
import { GameManager } from '../../Managers/GameManager'
const { ccclass, property } = _decorator

@ccclass('EndGameScreen')
export class EndGameScreen extends Component {
	private titleNode: Node
    private title: Label
    private avatarNode: Node
	private avatar: Sprite
	private usernameNode: Node
    private username: Label
	private scoresNode: Node
    private scores: Label
    private closeNode: Node
    private closeButton: Button
	private closeClickCallback: any
	private closeHoverCallback: any

    protected onLoad(): void {
		this.titleNode = find('EndGameScreenLayout/EndGameScreenLabel', this.node)
        this.title = this.titleNode.getComponent(Label)
        this.avatarNode = find('EndGameScreenLayout/Avatar/AvatarSprite', this.node)
		this.avatar = this.avatarNode.getComponent(Sprite)
        this.usernameNode = find('EndGameScreenLayout/UsernameLayout/Username', this.node)
        this.username = this.usernameNode.getComponent(Label)
		this.scoresNode = find('EndGameScreenLayout/ScoresLayout/Scores', this.node)
        this.scores = this.scoresNode.getComponent(Label)
        this.closeNode = find('EndGameScreenLayout/ButtonsLayout/CloseButton', this.node)
        this.closeButton = this.closeNode.getComponent(Button)

        // Click event
		this.closeClickCallback = (event) => {
			AudioManager.inst.playOneShotUI('button_click')
			this.node.destroy()
		}

		// Hover event
        this.closeHoverCallback = (event) => {
			AudioManager.inst.playOneShotUI('button_hover')
		}
    }

	protected onEnable(): void {
		this.closeNode.on(Button.EventType.CLICK, this.closeClickCallback)
		this.closeNode.on(Node.EventType.MOUSE_ENTER, this.closeHoverCallback)
	}

	protected onDisable(): void {
		this.closeNode.off(Button.EventType.CLICK, this.closeClickCallback)
		this.closeNode.off(Node.EventType.MOUSE_ENTER, this.closeHoverCallback)
	}

    init(data: EndGameScreenData): void {
		let title: string
		const myself: string = NetworkManager.inst.getGameRoom.sessionId
		const myselfId: number = NetworkManager.inst.getGameRoom.state.players.get(myself).id

		if (!data.winner) {
			title = 'DRAW'
			AudioManager.inst.playOneShotUI('draw')
		} else {
			if (myselfId != data.winner && myselfId != data.loser) {
				title = 'GAME ENDED'
				AudioManager.inst.playOneShotUI('win')
			} else if (data.winner === myselfId) {
				title = 'YOU WON !'
				AudioManager.inst.playOneShotUI('win')
			} else {
				title = 'YOU LOSE !'
				AudioManager.inst.playOneShotUI('lose')
			}
		}

		this.title.string = title
		this.username.string = data.username
		this.avatar.spriteFrame = GameManager.inst.avatarCache.get(data.avatarUrl)
		this.scores.string = `${data.leftPlayerScore} - ${data.rightPlayerScore}`
    }
}
