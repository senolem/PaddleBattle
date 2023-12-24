import { _decorator, assetManager, AudioClip, Component, find, Game, ImageAsset, instantiate, Node, Prefab, resources, SpriteFrame, Texture2D } from 'cc'
import { UIManager } from 'db://assets/Scripts/Managers/UIManager'
import { MapItem } from 'db://assets/Scripts/UI/RoomMenu/MapItem'
import { MapData } from 'db://assets/Scripts/Components/MapData'
import { GameManager } from 'db://assets/Scripts/Managers/GameManager'
import { GameMap } from 'db://assets/Scripts/Components/GameMap'
import { NetworkManager } from 'db://assets/Scripts/Managers/NetworkManager'
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
		mapItem.setId(newMap.id)
		mapItem.setName(newMap.displayName)

		const cachedThumbnail = GameManager.inst.thumbnailCache.get(map.thumbnailUrl)
		if (cachedThumbnail) {
			console.debug(`Using cached thumbnail: ${map.thumbnailUrl}`)
			newMap.thumbnail = cachedThumbnail
			mapItem.setThumbnail(newMap.thumbnail)
		} else {
			assetManager.loadRemote<ImageAsset>(map.thumbnailUrl + '?authorization=' + NetworkManager.inst.getAuthorization, (err, imageAsset) => {
				if (err) {
					console.error(`Failed to download thumbnail: ${map.thumbnailUrl} ${err}`)
				}
				else if (imageAsset) {
					console.debug(`Downloaded thumbnail: ${map.thumbnailUrl}`)
					const thumbnailTexture = new Texture2D()
					thumbnailTexture.image = imageAsset
					const thumbnailSpriteFrame = new SpriteFrame()
					thumbnailSpriteFrame.texture = thumbnailTexture

					newMap.thumbnail = thumbnailSpriteFrame
					mapItem.setThumbnail(newMap.thumbnail)
					GameManager.inst.thumbnailCache.set(map.thumbnailUrl, thumbnailSpriteFrame)
				}
			})
		}

		const cachedBackground = GameManager.inst.backgroundCache.get(map.backgroundUrl)
		if (cachedBackground) {
			console.debug(`Using cached background: ${map.thumbnailUrl}`)
			newMap.background = cachedBackground
		} else {
			assetManager.loadRemote<ImageAsset>(map.backgroundUrl + '?authorization=' + NetworkManager.inst.getAuthorization, (err, imageAsset) => {
				if (err) {
					console.error(`Failed to download background: ${map.backgroundUrl} ${err}`)
				}
				else if (imageAsset) {
					console.debug(`Downloaded background: ${map.backgroundUrl}`)
					const backgroundTexture = new Texture2D()
					backgroundTexture.image = imageAsset
					const backgroundSpriteFrame = new SpriteFrame()
					backgroundSpriteFrame.texture = backgroundTexture

					newMap.background = backgroundSpriteFrame
					GameManager.inst.backgroundCache.set(map.backgroundUrl, backgroundSpriteFrame)
				}
			})
		}

		const cachedMusic = GameManager.inst.musicCache.get(map.musicUrl)
		if (cachedMusic) {
			console.debug(`Using cached music: ${map.thumbnailUrl}`)
			newMap.music = cachedMusic
		} else {
			assetManager.loadRemote<AudioClip>(map.musicUrl + '?authorization=' + NetworkManager.inst.getAuthorization, (err, audioClip) => {
				if (err) {
					console.error(`Failed to download music: ${map.musicUrl} ${err}`)
				}
				else if (audioClip) {
					console.debug(`Downloaded music: ${map.musicUrl}`)
					newMap.music = audioClip
					GameManager.inst.musicCache.set(map.musicUrl, audioClip)
				}
			})
		}
	}

	clearMaps(): void {
		if (this.contentNode) {
			this.contentNode.destroyAllChildren()
		}
	}

	setSelectedMap(id: number): void {
		this.contentNode.children.forEach((node) => {
			const mapItem: MapItem = node.getComponent(MapItem)
			if (mapItem.getId() === id) {
				mapItem.setSelected(true)
			} else {
				mapItem.setSelected(false)
			}
		})
	}
}
