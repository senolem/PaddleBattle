import { _decorator, Node, director } from 'cc'
import { GameStateStore } from 'db://assets/Scripts/Store'
import { gameStore, reaction } from 'db://assets/Scripts/Store'
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
    public store!: GameStateStore

	constructor() {
		// Create a new GameManager node and add it to the scene
		this.node = new Node()
		this.node.name = 'GameManager'
		director.getScene().addChild(this.node);

        // Make it as a persistent node, so it won't be destroyed when scene changes
        director.addPersistRootNode(this.node)

		// Instanting the mobx store
		this.store = gameStore
	}
}


