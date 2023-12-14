import { _decorator, assetManager, Component, find, ImageAsset, instantiate, Node, Prefab, resources, Texture2D } from 'cc';
import { UIManager } from 'db://assets/Scripts/Managers/UIManager';
import { MapItem } from 'db://assets/Scripts/UI/RoomMenu/MapItem';
import { PlayerItem } from './PlayerItem';
import { GameManager } from '../../Managers/GameManager';
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

	addPlayer(id: number, username: string, avatarUrl: string, isReady: boolean): void {
		const existingNode = this.players.get(id)
		if (existingNode) {
			console.error(`${username} already exists`)
		}

		const playerItemNode = instantiate(this.playerItemPrefab)
		const playerItem = playerItemNode.getComponent(PlayerItem)
		this.players.set(id, playerItemNode)
		playerItemNode.parent = this.contentNode
		assetManager.loadRemote<ImageAsset>(avatarUrl + '?authorization=' + GameManager.inst.store.getAuthorization, (err, imageAsset) => {
			console.log('downloaded', avatarUrl)
			const avatar = new Texture2D();
			avatar.image = imageAsset;
			playerItem.init(username, avatar, isReady)
		});
	}

	updatePlayer(id: number, isReady: boolean): void {
		const existingNode = this.players.get(id)
		const playerItem = existingNode.getComponent(PlayerItem)
		playerItem.setReady(isReady)
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
