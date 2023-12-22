import { _decorator, Node, director, Texture2D, SpriteFrame, AudioClip, Camera, resources } from 'cc'
import { GameMap } from 'db://assets/Scripts/Components/GameMap'
import { Game } from 'db://assets/Scripts/Game'
import { GameSettings } from '../Components/GameSettings'
const { ccclass, property } = _decorator

@ccclass('GameManager')
export class GameManager {
	private static _inst: GameManager
    public static get inst(): GameManager {
        if (this._inst == null) {
            this._inst = new GameManager()
        }
        return this._inst
    }

	private node!: Node
	public maps: Map<number, GameMap> = new Map<number, GameMap>()
	public thumbnailCache: Map<string, SpriteFrame> = new Map<string, SpriteFrame>()
	public backgroundCache: Map<string, SpriteFrame> = new Map<string, SpriteFrame>()
	public musicCache: Map<string, AudioClip> = new Map<string, AudioClip>()
	public avatarCache: Map<string, SpriteFrame> = new Map<string, SpriteFrame>()
	public textureCache: Map<string, SpriteFrame> = new Map<string, SpriteFrame>()
	public game: Game
	public cameraNode: Node
	public camera: Camera

	constructor() {
		// Create a new GameManager node and add it to the scene
		this.node = new Node()
		this.node.name = 'GameManager'
		director.getScene().addChild(this.node)

        // Make it as a persistent node, so it won't be destroyed when scene changes
        director.addPersistRootNode(this.node)
	}

	loadResources() {
		resources.loadDir("game", function (err, assets) {
			assets.forEach(function (asset) {
				if (asset instanceof SpriteFrame) {
					GameManager.inst.textureCache.set(asset.name, asset)
				}
			})
		})
	}
}


