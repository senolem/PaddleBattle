import { _decorator, Component, Node, director, Canvas } from 'cc'
import { GameManager } from 'db://assets/Scripts/Managers/GameManager'
import { UIManager } from 'db://assets/Scripts/Managers/UIManager'
import { AudioManager } from 'db://assets/Scripts/Managers/AudioManager'
import { NetworkManager } from 'db://assets/Scripts/Managers/NetworkManager'
import { UIState } from './Enums/UIState'
const { ccclass, property } = _decorator

@ccclass('Initialize')
export class Initialize extends Component {

    protected async onLoad(): Promise<void> {
		try {
			await GameManager.inst.loadResources()
			await AudioManager.inst.loadResources()
			await UIManager.inst.loadResources()
		} catch (error) {
			throw Error(`Failed to load resource: ${error}`)
		}

		if (GameManager.inst) {
			console.log('GameManager initialized')
		}
		if (UIManager.inst) {
			console.log('UIManager initialized')
		}
		if (AudioManager.inst) {
			console.log('AudioManager initialized')
		}
		if (NetworkManager.inst) {
			console.log('NetworkManager initialized')
		}

		director.loadScene("Menu", () => {
			const canvasNode = director.getScene().getChildByName('UICanvas')
			director.addPersistRootNode(canvasNode)
			UIManager.inst.setCanvas(canvasNode.getComponent(Canvas))
			UIManager.inst.switchUIState(UIState.Menu)
			AudioManager.inst.play('menu')
			NetworkManager.inst.connect()
		})
	}
}
