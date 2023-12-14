import { _decorator, Button, Component, find, Node, RichText, Sprite, SpriteFrame, Texture2D } from 'cc'
const { ccclass, property } = _decorator

@ccclass('MapItem')
export class MapItem extends Component {
    private mapThumbnailNode: Node
	private mapThumbnail: Sprite
	private mapNameNode: Node
	private mapName: RichText

	protected onLoad(): void {
		this.mapThumbnailNode = find('MapThumbnail', this.node)
		this.mapThumbnail = this.mapThumbnailNode.getComponent(Sprite)
		this.mapNameNode = find('MapName', this.node)
		this.mapName = this.mapNameNode.getComponent(RichText)

		this.node.on(Button.EventType.CLICK, (event) => {
			console.log(`clicked on ${this.mapName} map`)
		})
	}

	setThumbnail(thumbnail: SpriteFrame): void {
		this.mapThumbnail.spriteFrame = thumbnail
	}

	setName(name: string) {
		this.mapName.string = name
	}
}


