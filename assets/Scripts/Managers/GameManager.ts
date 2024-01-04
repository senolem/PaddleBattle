import { _decorator, Node, director, Texture2D, SpriteFrame, AudioClip, Camera, resources, view, screen, ResolutionPolicy } from 'cc'
import { GameMap } from 'db://assets/Scripts/Components/GameMap'
import { Game } from 'db://assets/Scripts/Game'
import { Keybinds } from 'db://assets/Scripts/Components/Keybinds'
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
	public keybinds: Keybinds

	constructor() {
		// Create a new GameManager node and add it to the scene
		this.node = new Node()
		this.node.name = 'GameManager'
		this.keybinds = this.node.addComponent(Keybinds)
		director.getScene().addChild(this.node)

        // Make it as a persistent node, so it won't be destroyed when scene changes
        director.addPersistRootNode(this.node)

		this.makeResponsive()
	}

	makeResponsive(): void {
		const resolutionPolicy = new ResolutionPolicy(ResolutionPolicy.ContainerStrategy.PROPORTION_TO_FRAME, ResolutionPolicy.ContentStrategy.EXACT_FIT)
		view.setResolutionPolicy(resolutionPolicy)
	}

	loadResources(): Promise<void> {
		return new Promise((resolve, reject) => {
			resources.loadDir("game", function (err, assets) {
				if (err) {
					reject(err)
					return
				}

				assets.forEach(function (asset) {
					if (asset instanceof SpriteFrame) {
						GameManager.inst.textureCache.set(asset.name, asset)
					}
				})

				resolve()
			})
		})
	}
}


