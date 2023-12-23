import { _decorator, Component, find, Node, Label, Sprite, Texture2D, AnimationComponent } from 'cc'
import { NetworkManager } from 'db://assets/Scripts/Managers/NetworkManager'
import { GameManager } from 'db://assets/Scripts/Managers/GameManager'
const { ccclass, property } = _decorator

@ccclass('LoadingScreen')
export class LoadingScreen extends Component {
    private background: Sprite
	private thumbnailNode: Node
	private thumbnailSprite: Sprite
	private displayNameNode: Node
	private displayNameLabel: Label
	private loadingInfoNode: Node
	private loadingInfoLabel: Label
	private animation: AnimationComponent
	private spinnerNode: Node

	protected onLoad(): void {
		this.background = this.node.getComponent(Sprite)
		this.thumbnailNode = find('LoadingLayout/MapLayout/Thumbnail', this.node)
		this.thumbnailSprite = this.thumbnailNode.getComponent(Sprite)
		this.displayNameNode = find('LoadingLayout/MapLayout/DisplayName', this.node)
		this.displayNameLabel = this.displayNameNode.getComponent(Label)
		this.loadingInfoNode = find('LoadingLayout/LoadingLayout/TextLayout/LoadingInfo', this.node)
		this.loadingInfoLabel = this.loadingInfoNode.getComponent(Label)
		this.spinnerNode = find('LoadingLayout/LoadingLayout/SpinnerLayout/Spinner', this.node)
		this.animation = this.node.getComponent(AnimationComponent)
	}

	protected onEnable(): void {
		this.animation.play()
	}

	protected update(dt: number): void {
		this.spinnerNode.angle += 5
	}

	show(): void {
		this.enabled = true
		this.node.active = true
		const selectedMap = NetworkManager.inst.getSelectedMap
		if (selectedMap > -1) {
			const map = GameManager.inst.maps.get(selectedMap)
			if (map) {
				this.displayNameLabel.string = map.displayName
				if (map.background) {
					this.background.spriteFrame = map.background
				}
				if (map.thumbnail) {
					this.thumbnailSprite.spriteFrame = map.thumbnail
				}
			}
		}
	}

	hide(): void {
		this.enabled = false
		this.node.active = false
	}

	setLoadingInfo(info: string) {
		this.loadingInfoLabel.string = info
	}
}
