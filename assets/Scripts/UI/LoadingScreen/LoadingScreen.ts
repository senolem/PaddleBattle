import { _decorator, Component, find, Node, RichText, Sprite, Texture2D } from 'cc'
import { NetworkManager } from 'db://assets/Scripts/Managers/NetworkManager'
import { GameManager } from 'db://assets/Scripts/Managers/GameManager'
const { ccclass, property } = _decorator

@ccclass('LoadingScreen')
export class LoadingScreen extends Component {
    private background: Sprite
	private thumbnailNode: Node
	private thumbnail: Sprite
	private displayNameNode: Node
	private displayName: RichText
	private loadingInfoNode: Node
	private loadingInfo: RichText
	private spinner: Node

	protected onLoad(): void {
		this.background = this.node.getComponent(Sprite)
		this.thumbnailNode = find('LoadingLayout/MapLayout/Thumbnail', this.node)
		this.thumbnail = this.thumbnailNode.getComponent(Sprite)
		this.displayNameNode = find('LoadingLayout/MapLayout/DisplayName', this.node)
		this.displayName = this.displayNameNode.getComponent(RichText)
		this.loadingInfoNode = find('LoadingLayout/LoadingLayout/TextLayout/LoadingInfo', this.node)
		this.loadingInfo = this.loadingInfoNode.getComponent(RichText)
		this.spinner = find('LoadingLayout/LoadingLayout/SpinnerLayout/Spinner', this.node)
	}

	protected update(dt: number): void {
		this.spinner.angle += 5
	}

	show(): void {
		const currentMap = NetworkManager.inst.getCurrentMap()
		if (currentMap > -1) {
			const map = GameManager.inst.maps.get(currentMap)
			if (map) {
				this.displayName.string = map.displayName
				if (map.background) {
					this.background.spriteFrame = map.background
				}
				if (map.thumbnail) {
					this.thumbnail.spriteFrame = map.thumbnail
				}
				this.enabled = true
				this.node.active = true
			}
		}
	}

	hide() {
		this.enabled = false
		this.node.active = false
	}

	setLoadingInfo(info: string) {
		this.loadingInfo.string = info
	}
}
