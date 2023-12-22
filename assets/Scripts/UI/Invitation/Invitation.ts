import { _decorator, assetManager, Button, Component, find, ImageAsset, Node, Label, Sprite, SpriteFrame, Texture2D } from 'cc'
import { AudioManager } from 'db://assets/Scripts/Managers/AudioManager'
import { UIManager } from 'db://assets/Scripts/Managers/UIManager'
import { UIState } from 'db://assets/Scripts/Enums/UIState'
import { NetworkManager } from 'db://assets/Scripts/Managers/NetworkManager'
import { GameManager } from 'db://assets/Scripts/Managers/GameManager'
const { ccclass, property } = _decorator

@ccclass('Invitation')
export class Invitation extends Component {
    private id: string
    private avatarNode: Node
	private avatar: Sprite
	private usernameNode: Node
    private username: Label
    private acceptNode: Node
    private acceptButton: Button
    private denyNode: Node
    private denyButton: Button
	private playersOnlineNode: Node
    private playersOnline: Label
	private acceptClickCallback: any
	private denyClickCallback: any
	private acceptHoverCallback: any
	private denyHoverCallback: any

    protected onLoad(): void {
        this.avatarNode = find('InvitationLayout/Avatar/AvatarSprite', this.node)
		this.avatar = this.avatarNode.getComponent(Sprite)
        this.usernameNode = find('InvitationLayout/TitleLayout/Username', this.node)
        this.username = this.usernameNode.getComponent(Label)
        this.acceptNode = find('InvitationLayout/ButtonsLayout/AcceptButton', this.node)
        this.acceptButton = this.acceptNode.getComponent(Button)
        this.denyNode = find('InvitationLayout/ButtonsLayout/DenyButton', this.node)
        this.denyButton = this.denyNode.getComponent(Button)

        // Click event
		this.acceptClickCallback = (event) => {
			AudioManager.inst.playOneShotUI('button_click')
            NetworkManager.inst.acceptInvitation(this.id)
			this.node.destroy()
		}

		this.denyClickCallback = (event) => {
			AudioManager.inst.playOneShotUI('button_click')
            NetworkManager.inst.declineInvitation(this.id)
			this.node.destroy()
		}

		// Hover event
		this.acceptHoverCallback = (event) => {
			AudioManager.inst.playOneShotUI('button_hover')
		}
		
        this.denyHoverCallback = (event) => {
			AudioManager.inst.playOneShotUI('button_hover')
		}
    }

	protected onEnable(): void {
		this.acceptNode.on(Button.EventType.CLICK, this.acceptClickCallback)
		this.denyNode.on(Button.EventType.CLICK, this.denyClickCallback)
		this.acceptNode.on(Node.EventType.MOUSE_ENTER, this.acceptHoverCallback)
		this.denyNode.on(Node.EventType.MOUSE_ENTER, this.denyHoverCallback)
	}

	protected onDisable(): void {
		this.acceptNode.off(Button.EventType.CLICK, this.acceptClickCallback)
		this.denyNode.off(Button.EventType.CLICK, this.denyClickCallback)
		this.acceptNode.off(Node.EventType.MOUSE_ENTER, this.acceptHoverCallback)
		this.denyNode.off(Node.EventType.MOUSE_ENTER, this.denyHoverCallback)
	}

    init(id: string, username: string, avatarUrl: string): void {
        this.id = id
        this.username.string = username
		assetManager.loadRemote<ImageAsset>(avatarUrl + '?authorization=' + NetworkManager.inst.getAuthorization, (err, imageAsset) => {
			if (err) {
				console.error(`Failed to download avatar: ${avatarUrl} ${err}`)
			} else if (imageAsset) {
				console.debug(`Downloaded avatar: ${avatarUrl}`)
				const avatarTexture = new Texture2D()
				avatarTexture.image = imageAsset
				const avatarSpriteFrame = new SpriteFrame()
				avatarSpriteFrame.texture = avatarTexture

				this.avatar.spriteFrame = avatarSpriteFrame
			}
        })

        this.node.active = true
		AudioManager.inst.playOneShotUI('invitation')
    }
}


