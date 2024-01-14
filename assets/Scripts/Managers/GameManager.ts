import { _decorator, Node, director, Texture2D, SpriteFrame, AudioClip, Camera, resources, view, screen, ResolutionPolicy, physics, Vec3, Mesh, Material, ModelComponent, Prefab } from 'cc'
import { GameMap } from 'db://assets/Scripts/Components/GameMap'
import { Game } from 'db://assets/Scripts/Game'
import { Keybinds } from 'db://assets/Scripts/Components/Keybinds'
import { Inputs } from 'db://assets/Scripts/Components/Inputs'
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
	public prefabsCache: Map<string, Prefab> = new Map<string, Prefab>()
	public materialCache: Map<string, Material> = new Map<string, Material>()
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
		physics.PhysicsSystem.instance.gravity = new Vec3(0, 0, 0)
	}

	makeResponsive(): void {
		const resolutionPolicy = new ResolutionPolicy(ResolutionPolicy.ContainerStrategy.PROPORTION_TO_FRAME, ResolutionPolicy.ContentStrategy.EXACT_FIT)
		view.setResolutionPolicy(resolutionPolicy)
	}

	loadResources() {
		resources.loadDir("game", (err, assets) => {
			if (err) {
				throw err
			}
			assets.forEach((asset) => {
				if (asset instanceof SpriteFrame) {
					GameManager.inst.textureCache.set(asset.name, asset)
				}
			})
		})

		resources.loadDir("prefabs", (err, assets) => {
			if (err) {
				throw err
			}
			assets.forEach((asset) => {
				if (asset instanceof Prefab) {
					GameManager.inst.prefabsCache.set(asset.name, asset)
				}
			})
		})

		resources.loadDir("materials", (err, assets) => {
			if (err) {
				throw err
			}
			assets.forEach((asset) => {
				if (asset instanceof Material) {
					GameManager.inst.materialCache.set(asset.name, asset)
				}
			})
		})
	}
}
