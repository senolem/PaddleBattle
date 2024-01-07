import { _decorator, Button, Component, find, Node, Label, Sprite, SpriteFrame } from 'cc'
import { UIManager } from 'db://assets/Scripts/Managers/UIManager'
import { AudioManager } from 'db://assets/Scripts/Managers/AudioManager'
import { calculateLevel } from '../../Utils/CalculateLevel'
const { ccclass, property } = _decorator

@ccclass('PlayerItem')
export class PlayerItem extends Component {
    private playerAvatarNode: Node
	private playerAvatar: Sprite
	private playerUsernameNode: Node
	private playerUsername: Label
	private playerLevelNode: Node
	private playerLevel: Label
	private playerReadyNode: Node
	private playerReady: Sprite

	protected onLoad(): void {
		this.playerAvatarNode = find('PlayerAvatar', this.node)
		this.playerAvatar = this.playerAvatarNode.getComponent(Sprite)
		this.playerUsernameNode = find('PlayerInfoLayout/PlayerUsername', this.node)
		this.playerUsername = this.playerUsernameNode.getComponent(Label)
		this.playerLevelNode = find('PlayerInfoLayout/PlayerLevel', this.node)
		this.playerLevel = this.playerLevelNode.getComponent(Label)
		this.playerReadyNode = find('PlayerReady', this.node)
		this.playerReady = this.playerReadyNode.getComponent(Sprite)
	}

	updatePlayer(username?: string, avatar?: SpriteFrame, xp?: number, ready?: boolean) {
		if (avatar) {
			this.playerAvatar.spriteFrame = avatar
		}
		if (username) {
			this.playerUsername.string = username
		}
		if (xp) {
			this.playerLevel.string = String('Level ' + calculateLevel(xp))
		}
		if (ready != null) {
			this.setReady(ready)
		}
	}

	init(username: string, avatar: SpriteFrame, xp: number, ready: boolean): void {
		this.playerAvatar.spriteFrame = avatar
		this.playerUsername.string = username
		this.playerLevel.string = String('Level ' + calculateLevel(xp))
		this.setReady(ready)
	}

	setReady(ready: boolean) {
		if (ready) {
			this.playerReady.spriteFrame = UIManager.inst.readyIcon
			AudioManager.inst.playOneShotUI('status_ready')
		} else {
			this.playerReady.spriteFrame = UIManager.inst.notReadyIcon
		}
	}
}


