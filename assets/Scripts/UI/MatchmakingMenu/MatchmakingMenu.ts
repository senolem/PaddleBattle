import { _decorator, Component, Node, Button, Sprite, Label, find } from 'cc'
import { NetworkManager } from 'db://assets/Scripts/Managers/NetworkManager'
const { ccclass, property } = _decorator

@ccclass('MatchmakingMenu')
export class MatchmakingMenu extends Component {
	private spinnerNode: Node
	private messageNode: Node
	private message: Label
	private onlineUsers: number

	protected onLoad(): void {
		this.spinnerNode = find('MatchmakingLayout/TitleLayout/SearchingLayout/SpinnerLayout/Spinner', this.node)
    	this.messageNode = find('MatchmakingLayout/TitleLayout/Message', this.node)
    	this.message = this.messageNode.getComponent(Label)
	}

	protected start(): void {
		this.onlineUsers = NetworkManager.inst.getOnlineUsers
		this.message.string = `${String(this.onlineUsers)} players online`
	}

	protected update(dt: number): void {
		this.spinnerNode.angle += 5
		if (NetworkManager.inst.getOnlineUsers != this.onlineUsers) {
			this.onlineUsers = NetworkManager.inst.getOnlineUsers
			this.message.string = `${String(this.onlineUsers)} players online`
		}
	}
}
