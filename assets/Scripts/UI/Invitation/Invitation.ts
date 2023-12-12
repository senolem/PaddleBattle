import { _decorator, assetManager, Button, Component, find, ImageAsset, Node, RichText, SpriteFrame, Texture2D } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Managers/AudioManager';
import { UIManager } from 'db://assets/Scripts/Managers/UIManager';
import { UIState } from 'db://assets/Scripts/Enums/UIState';
import { NetworkManager } from 'db://assets/Scripts/Managers/NetworkManager';
const { ccclass, property } = _decorator;

@ccclass('Invitation')
export class Invitation extends Component {
    private id: string
    private avatar: Node
    private username: RichText
    private acceptNode: Node
    private acceptButton: Button
    private denyNode: Node
    private denyButton: Button
    private playersOnline: RichText

    protected onLoad(): void {
        this.avatar = find('InvitationLayout/Avatar/AvatarSprite', this.node)
        const usernameNode = find('InvitationLayout/TitleLayout/Username', this.node)
        this.username = usernameNode.getComponent(RichText)
        this.acceptNode = find('InvitationLayout/ButtonsLayout/AcceptButton', this.node)
        this.acceptButton = this.acceptNode.getComponent(Button)
        this.denyNode = find('InvitationLayout/ButtonsLayout/DenyButton', this.node)
        this.denyButton = this.denyNode.getComponent(Button)
        const playersOnlineNode = find('InvitationLayout/TitleLayout/Message', this.node)
        this.playersOnline = playersOnlineNode.getComponent(RichText)

        // Click event
		this.acceptNode.on(Button.EventType.CLICK, (event) => {
			AudioManager.inst.playOneShotUI('button_click')
            NetworkManager.inst.acceptInvitation(this.id)
		})
        this.denyNode.on(Button.EventType.CLICK, (event) => {
			AudioManager.inst.playOneShotUI('button_click')
            NetworkManager.inst.declineInvitation(this.id)
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

        assetManager.loadRemote<ImageAsset>(avatarUrl, function (err, imageAsset) {
            const texture = new Texture2D();
            texture.image = imageAsset;
            this.avatar.texture = texture;
        });

        this.playersOnline.string = `${String(NetworkManager.inst.getOnlineUsers())} + players online`
        this.node.active = true
    }
}


