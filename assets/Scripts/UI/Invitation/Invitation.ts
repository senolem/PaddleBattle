import { _decorator, assetManager, Button, Component, find, ImageAsset, Node, RichText, Sprite, SpriteFrame, Texture2D } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Managers/AudioManager';
import { UIManager } from 'db://assets/Scripts/Managers/UIManager';
import { UIState } from 'db://assets/Scripts/Enums/UIState';
import { NetworkManager } from 'db://assets/Scripts/Managers/NetworkManager';
import { GameManager } from 'db://assets/Scripts/Managers/GameManager';
const { ccclass, property } = _decorator;

@ccclass('Invitation')
export class Invitation extends Component {
    private id: string
    private avatarNode: Node
	private avatar: Sprite
	private usernameNode: Node
    private username: RichText
    private acceptNode: Node
    private acceptButton: Button
    private denyNode: Node
    private denyButton: Button
	private playersOnlineNode: Node
    private playersOnline: RichText

    protected onLoad(): void {
        this.avatarNode = find('InvitationLayout/Avatar/AvatarSprite', this.node)
		this.avatar = this.avatarNode.getComponent(Sprite)
        this.usernameNode = find('InvitationLayout/TitleLayout/Username', this.node)
        this.username = this.usernameNode.getComponent(RichText)
        this.acceptNode = find('InvitationLayout/ButtonsLayout/AcceptButton', this.node)
        this.acceptButton = this.acceptNode.getComponent(Button)
        this.denyNode = find('InvitationLayout/ButtonsLayout/DenyButton', this.node)
        this.denyButton = this.denyNode.getComponent(Button)

        // Click event
		this.acceptNode.on(Button.EventType.CLICK, (event) => {
			AudioManager.inst.playOneShotUI('button_click')
            NetworkManager.inst.acceptInvitation(this.id)
			this.node.destroy()
		})
        this.denyNode.on(Button.EventType.CLICK, (event) => {
			AudioManager.inst.playOneShotUI('button_click')
            NetworkManager.inst.declineInvitation(this.id)
			this.node.destroy()
		})

		// Hover event
		this.acceptNode.on(Node.EventType.MOUSE_ENTER, (event) => {
			AudioManager.inst.playOneShotUI('button_hover')
		})
        this.denyNode.on(Node.EventType.MOUSE_ENTER, (event) => {
			AudioManager.inst.playOneShotUI('button_hover')
		})
    }

    init(id: string, username: string, avatarUrl: string): void {
        this.id = id
        this.username.string = username
		assetManager.loadRemote<ImageAsset>(avatarUrl + '?authorization=' + GameManager.inst.store.getAuthorization, (err, imageAsset) => {
            const texture = new Texture2D();
            texture.image = imageAsset;
            this.avatar.spriteFrame.texture = texture;
        });

        this.node.active = true
    }
}


