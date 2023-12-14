import { _decorator, assetManager, AudioClip, Component, find, ImageAsset, instantiate, Node, Prefab, resources, SpriteFrame, Texture2D } from 'cc'
import { UIManager } from 'db://assets/Scripts/Managers/UIManager'
import { MapItem } from 'db://assets/Scripts/UI/RoomMenu/MapItem'
import { MapData } from 'db://assets/Scripts/Components/MapData'
import { GameManager } from 'db://assets/Scripts/Managers/GameManager'
import { GameMap } from 'db://assets/Scripts/Components/GameMap'
const { ccclass, property } = _decorator

@ccclass('MapsScrollView')
export class MapsScrollView extends Component {
	private contentNode: Node
	private mapItemPrefab: Prefab

    protected onLoad(): void {
		this.contentNode = find('view/content', this.node)
		this.mapItemPrefab = UIManager.inst.prefabs.get('MapItem')
	}

	addMap(map: MapData) {
		const newMap: GameMap = { id: map.id, displayName: map.displayName }
		GameManager.inst.maps.set(map.id, newMap)
		
		const mapItemNode = instantiate(this.mapItemPrefab)
		mapItemNode.parent = this.contentNode

		const mapItem = mapItemNode.getComponent(MapItem)
		mapItem.setName(newMap.displayName)

		assetManager.loadRemote<ImageAsset>(map.thumbnailUrl + '?authorization=' + GameManager.inst.store.getAuthorization, (err, imageAsset) => {
			if (err) {
				console.log(`Failed to download thumbnail: ${map.backgroundUrl} ${err}`)
			}
			else if (imageAsset) {
				console.log(`Downloaded thumbnail: ${map.backgroundUrl}`)
				const thumbnailTexture = new Texture2D()
				thumbnailTexture.image = imageAsset
				const thumbnailSpriteFrame = new SpriteFrame()
				thumbnailSpriteFrame.texture = thumbnailTexture

				newMap.thumbnail = thumbnailSpriteFrame
				mapItem.setThumbnail(newMap.thumbnail)
			}
		})
		assetManager.loadRemote<ImageAsset>(map.backgroundUrl + '?authorization=' + GameManager.inst.store.getAuthorization, (err, imageAsset) => {
			if (err) {
				console.log(`Failed to download background: ${map.backgroundUrl} ${err}`)
			}
			else if (imageAsset) {
				console.log(`Downloaded background: ${map.backgroundUrl}`)
				const backgroundTexture = new Texture2D()
				backgroundTexture.image = imageAsset
				const backgroundSpriteFrame = new SpriteFrame()
				backgroundSpriteFrame.texture = backgroundTexture

				newMap.background = backgroundSpriteFrame
			}
		})
		assetManager.loadRemote<AudioClip>(map.musicUrl + '?authorization=' + GameManager.inst.store.getAuthorization, (err, audioClip) => {
			if (err) {
				console.log(`Failed to download music: ${map.backgroundUrl} ${err}`)
			}
			else if (audioClip) {
				console.log(`Downloaded music: ${map.backgroundUrl}`)
				newMap.music = audioClip
			}
		})
	}

	clearMaps(): void {
		if (this.contentNode) {
			this.contentNode.children.forEach((node) => {
				node.destroy()
			})
		}
	}
}
