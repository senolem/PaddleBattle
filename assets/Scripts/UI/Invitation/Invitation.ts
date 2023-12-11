import { _decorator, assetManager, Button, Component, ImageAsset, Node, RichText, SpriteFrame, Texture2D } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Managers/AudioManager';
import { UIManager } from 'db://assets/Scripts/Managers/UIManager';
import { UIState } from 'db://assets/Scripts/Enums/UIState';
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
        this.avatar = this.node.getChildByName('AvatarSprite')
        const usernameNode = this.node.getChildByName('Username')
        this.username = usernameNode.getComponent(RichText)
        this.acceptNode = this.node.getChildByName('AcceptButton')
        this.acceptButton = this.acceptNode.getComponent(Button)
        this.denyNode = this.node.getChildByName('DenyButton')
        this.denyButton = this.denyNode.getComponent(Button)
        const playersOnlineNode = this.node.getChildByName('Message')
        this.playersOnline = playersOnlineNode.getComponent(RichText)

        // Click event
		this.acceptNode.on(Button.EventType.CLICK, (event) => {
			AudioManager.inst.playOneShotUI('button_click')
			// accept invitation
		})
        this.denyNode.on(Button.EventType.CLICK, (event) => {
			AudioManager.inst.playOneShotUI('button_click')
			// deny invitation
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

        // set this.playersOnline.string
        this.node.active = true
    }
}


