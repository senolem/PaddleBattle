import { _decorator, Component, Node, Button, Sprite, Label, find } from 'cc'
import { NetworkManager } from 'db://assets/Scripts/Managers/NetworkManager'
const { ccclass, property } = _decorator

@ccclass('MatchmakingMenu')
export class MatchmakingMenu extends Component {
	private avatarNode: Node
	private avatarSprite: Sprite
	private messageNode: Node
	private message: Label
	private onlineUsers: number

	protected onLoad(): void {
		this.avatarNode = find('MatchmakingLayout/Avatar/AvatarSprite', this.node)
		this.avatarSprite = this.avatarNode.getComponent(Sprite)
    	this.messageNode = find('MatchmakingLayout/TitleLayout/Message', this.node)
    	this.message = this.messageNode.getComponent(Label)
	}

	protected start(): void {
		this.onlineUsers = NetworkManager.inst.getOnlineUsers
		this.message.string = `${String(this.onlineUsers)} players online`
	}

	protected update(dt: number): void {
		if (NetworkManager.inst.getOnlineUsers != this.onlineUsers) {
			this.onlineUsers = NetworkManager.inst.getOnlineUsers
			this.message.string = `${String(this.onlineUsers)} players online`
		}
	}
}
