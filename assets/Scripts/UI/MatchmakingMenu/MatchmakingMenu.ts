import { _decorator, Component, Node, Button, Sprite, RichText, find } from 'cc'
import { NetworkManager } from 'db://assets/Scripts/Managers/NetworkManager'
const { ccclass, property } = _decorator

@ccclass('MatchmakingMenu')
export class MatchmakingMenu extends Component {
	private avatarNode: Node
	private avatar: Sprite
	private messageNode: Node
	private message: RichText

	protected onLoad(): void {
		this.avatarNode = find('MatchmakingLayout/Avatar/AvatarSprite', this.node)
		this.avatar = this.avatarNode.getComponent(Sprite)
    	this.messageNode = find('MatchmakingLayout/TitleLayout/Message', this.node)
    	this.message = this.messageNode.getComponent(RichText)
	}

	protected start(): void {
		this.message.string = `${String(NetworkManager.inst.getOnlineUsers())} + players online`
	}
}
