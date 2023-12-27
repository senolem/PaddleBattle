import { _decorator, assetManager, Component, find, ImageAsset, instantiate, Node, Prefab, resources, SpriteFrame, Texture2D } from 'cc';
import { UIManager } from 'db://assets/Scripts/Managers/UIManager';
import { PlayerItem } from 'db://assets/Scripts/UI/RoomMenu/PlayerItem';
import { GameManager } from 'db://assets/Scripts/Managers/GameManager';
import { NetworkManager } from 'db://assets/Scripts/Managers/NetworkManager';
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

	async addPlayer(id: number, username: string, avatarUrl: string, isReady: boolean): Promise<void> {
		const existingNode = this.players.get(id)
		if (existingNode) {
			console.error(`${username} already exists`)
		}

		this.players.set(id, null)
		const playerItemNode = await instantiate(this.playerItemPrefab)
		const playerItem = playerItemNode.getComponent(PlayerItem)
		this.players.set(id, playerItemNode)
		playerItemNode.parent = this.contentNode
		assetManager.loadRemote<ImageAsset>(avatarUrl + '?authorization=' + NetworkManager.inst.getAuthorization, (err, imageAsset) => {
			if (err) {
				console.error(`Failed to download avatar: ${avatarUrl} ${err}`)
			}
			else if (imageAsset) {
				console.debug(`Downloaded avatar: ${avatarUrl}`)
				const avatarTexture = new Texture2D();
				avatarTexture.image = imageAsset;
				const avatarSpriteFrame = new SpriteFrame();
				avatarSpriteFrame.texture = avatarTexture
				GameManager.inst.avatarCache.set(avatarUrl, avatarSpriteFrame)

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
		if (playerItemNode) {
			playerItemNode.destroy()
			this.players.delete(id)
		}
	}

	setPlayerReady(id: number, ready: boolean): void {
		const playerItemNode = this.players.get(id)
		const playerItem = playerItemNode.getComponent(PlayerItem)
		playerItem.setReady(ready)
	}

	clearPlayers() {
		this.contentNode.destroyAllChildren()
		this.players.clear()
	}
}
