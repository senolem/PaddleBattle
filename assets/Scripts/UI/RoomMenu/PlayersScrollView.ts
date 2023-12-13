import { _decorator, Component, find, instantiate, Node, Prefab, resources, Texture2D } from 'cc';
import { UIManager } from 'db://assets/Scripts/Managers/UIManager';
import { MapItem } from 'db://assets/Scripts/UI/RoomMenu/MapItem';
import { PlayerItem } from './PlayerItem';
const { ccclass, property } = _decorator;

@ccclass('PlayersScrollView')
export class PlayersScrollView extends Component {
	private contentNode: Node
	private playerItemPrefab: Prefab
	public players: Map<number, Node> = new Map<number, Node>()

    protected onLoad(): void {
		this.contentNode = find('view/content', this.node)
		this.playerItemPrefab = UIManager.inst.prefabs.get('PlayerItem')
	}

	updatePlayer(id: number, name: string, thumbnail: Texture2D): void {
		const existingNode = this.players.get(id)
		let playerItemNode
		if (!existingNode) {
			playerItemNode = instantiate(this.playerItemPrefab)
			playerItemNode.parent = this.contentNode
		} else {
			playerItemNode = existingNode
		}

		this.players.set(id, playerItemNode)

		const playerItem = playerItemNode.getComponent(PlayerItem)
		playerItem.init(name, thumbnail)
	}

	removePlayer(id: number): void {
		const playerItemNode = this.players.get(id)
		playerItemNode.destroy()
	}

	setPlayerReady(id: number, ready: boolean): void {
		const playerItemNode = this.players.get(id)
		const playerItem = playerItemNode.getComponent(PlayerItem)
		playerItem.setReady(ready)
	}
}
