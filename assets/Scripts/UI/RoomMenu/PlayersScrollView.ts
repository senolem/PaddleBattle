import { _decorator, assetManager, Component, find, ImageAsset, instantiate, Node, Prefab, resources, SpriteFrame, Texture2D } from 'cc';
import { UIManager } from 'db://assets/Scripts/Managers/UIManager';
import { PlayerItem } from 'db://assets/Scripts/UI/RoomMenu/PlayerItem';
import { GameManager } from 'db://assets/Scripts/Managers/GameManager';
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
			if (err) {
				console.log(`Failed to download avatar: ${avatarUrl} ${err}`)
			}
			else if (imageAsset) {
				console.log(`Downloaded avatar: ${avatarUrl}`)
				const avatarTexture = new Texture2D();
				avatarTexture.image = imageAsset;
				const avatarSpriteFrame = new SpriteFrame();
				avatarSpriteFrame.texture = avatarTexture

				playerItem.init(username, avatarSpriteFrame, isReady)
			}
		});
	}

	updatePlayer(id: number, isReady: boolean): void {
		const existingNode = this.players.get(id)
		if (existingNode) {
			const playerItem = existingNode.getComponent(PlayerItem)
			playerItem.setReady(isReady)
		} else {
			console.error(`No player found for id ${id}`)
		}
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
