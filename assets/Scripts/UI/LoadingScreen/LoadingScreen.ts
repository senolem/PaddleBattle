import { _decorator, Component, find, Node, Label, Sprite, Texture2D } from 'cc'
import { NetworkManager } from 'db://assets/Scripts/Managers/NetworkManager'
import { GameManager } from 'db://assets/Scripts/Managers/GameManager'
const { ccclass, property } = _decorator

@ccclass('LoadingScreen')
export class LoadingScreen extends Component {
    private background: Sprite
	private thumbnailNode: Node
	private thumbnail: Sprite
	private displayNameNode: Node
	private displayName: Label
	private loadingInfoNode: Node
	private loadingInfo: Label
	private spinner: Node

	protected onLoad(): void {
		this.background = this.node.getComponent(Sprite)
		this.thumbnailNode = find('LoadingLayout/MapLayout/Thumbnail', this.node)
		this.thumbnail = this.thumbnailNode.getComponent(Sprite)
		this.displayNameNode = find('LoadingLayout/MapLayout/DisplayName', this.node)
		this.displayName = this.displayNameNode.getComponent(Label)
		this.loadingInfoNode = find('LoadingLayout/LoadingLayout/TextLayout/LoadingInfo', this.node)
		this.loadingInfo = this.loadingInfoNode.getComponent(Label)
		this.spinner = find('LoadingLayout/LoadingLayout/SpinnerLayout/Spinner', this.node)
	}

	protected update(dt: number): void {
		this.spinner.angle += 5
	}

	show(): void {
		this.enabled = true
		this.node.active = true
		console.log('showing loading screen')
		const selectedMap = NetworkManager.inst.getSelectedMap()
		if (selectedMap > -1) {
			const map = GameManager.inst.maps.get(selectedMap)
			if (map) {
				console.log('map')
				this.displayName.string = map.displayName
				if (map.background) {
					console.log('settings bg spriteframe')
					this.background.spriteFrame = map.background
				}
				if (map.thumbnail) {
					console.log('settings thumbnail spriteframe')
					this.thumbnail.spriteFrame = map.thumbnail
				}
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
