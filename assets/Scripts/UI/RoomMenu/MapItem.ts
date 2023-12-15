import { _decorator, Button, Component, find, Node, Label, Sprite, SpriteFrame, Texture2D } from 'cc'
import { AudioManager } from 'db://assets/Scripts/Managers/AudioManager'
import { NetworkManager } from 'db://assets/Scripts/Managers/NetworkManager'
const { ccclass, property } = _decorator

@ccclass('MapItem')
export class MapItem extends Component {
	private id: number
    private mapThumbnailNode: Node
	private mapThumbnail: Sprite
	private mapNameNode: Node
	private mapName: Label
	private button: Button
	private clickCallback: any
	private hoverCallback: any

	protected onLoad(): void {
		this.mapThumbnailNode = find('MapThumbnail', this.node)
		this.mapThumbnail = this.mapThumbnailNode.getComponent(Sprite)
		this.mapNameNode = find('MapNameLayout/MapName', this.node)
		this.mapName = this.mapNameNode.getComponent(Label)

		// Click event
		this.clickCallback = (event) => {
			AudioManager.inst.playOneShotUI('button_click')
			NetworkManager.inst.setSelectedMap(this.id)
		}

		// Hover event
		this.hoverCallback = (event) => {
			AudioManager.inst.playOneShotUI('button_hover')
		}
	}

	protected onEnable(): void {
		this.node.on(Button.EventType.CLICK, this.clickCallback)
		this.node.on(Node.EventType.MOUSE_ENTER, this.hoverCallback)
	}

	protected onDisable(): void {
		this.node.off(Button.EventType.CLICK, this.clickCallback)
		this.node.off(Node.EventType.MOUSE_ENTER, this.hoverCallback)
	}

	setId(id: number) {
		this.id = id
	}

	setThumbnail(thumbnail: SpriteFrame): void {
		this.mapThumbnail.spriteFrame = thumbnail
	}

	setName(name: string) {
		this.mapName.string = name
	}
}


