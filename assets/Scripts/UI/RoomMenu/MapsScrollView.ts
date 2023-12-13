import { _decorator, Component, find, instantiate, Node, Prefab, resources, Texture2D } from 'cc';
import { UIManager } from 'db://assets/Scripts/Managers/UIManager';
import { MapItem } from 'db://assets/Scripts/UI/RoomMenu/MapItem';
const { ccclass, property } = _decorator;

@ccclass('MapsScrollView')
export class MapsScrollView extends Component {
	private contentNode: Node
	private mapItemPrefab: Prefab

    protected onLoad(): void {
		this.contentNode = find('view/content', this.node)
		this.mapItemPrefab = UIManager.inst.prefabs.get('MapItem')
	}

	addMap(name: string, thumbnail: Texture2D): void {
		const mapItemNode = instantiate(this.mapItemPrefab)
		mapItemNode.parent = this.contentNode

		const notification = mapItemNode.getComponent(MapItem)
		notification.init(name, thumbnail)
	}
}
