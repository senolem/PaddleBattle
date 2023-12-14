import { _decorator, Button, Component, find, Node, RichText, Sprite, SpriteFrame } from 'cc'
import { UIManager } from 'db://assets/Scripts/Managers/UIManager'
const { ccclass, property } = _decorator

@ccclass('PlayerItem')
export class PlayerItem extends Component {
    private playerAvatarNode: Node
	private playerAvatar: Sprite
	private playerUsernameNode: Node
	private playerUsername: RichText
	private playerReadyNode: Node
	private playerReady: Sprite

	protected onLoad(): void {
		this.playerAvatarNode = find('PlayerAvatar', this.node)
		this.playerAvatar = this.playerAvatarNode.getComponent(Sprite)
		this.playerUsernameNode = find('PlayerUsername', this.node)
		this.playerUsername = this.playerUsernameNode.getComponent(RichText)
		this.playerReadyNode = find('PlayerReady', this.node)
		this.playerReady = this.playerReadyNode.getComponent(Sprite)
	}

	init(username: string, avatar: SpriteFrame, ready: boolean): void {
		this.playerAvatar.spriteFrame = avatar
		this.playerUsername.string = username
		this.setReady(ready)
	}

	setReady(ready: boolean) {
		if (ready) {
			this.playerReady.spriteFrame = UIManager.inst.readyIcon
		} else {
			this.playerReady.spriteFrame = UIManager.inst.notReadyIcon
		}
	}
}


