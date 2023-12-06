import { _decorator, Component, Node, director, Canvas } from 'cc';
import { GameManager } from 'db://assets/Scripts/Managers/GameManager';
import { UIManager } from 'db://assets/Scripts/Managers/UIManager';
import { AudioManager } from 'db://assets/Scripts/Managers/AudioManager';
import { NetworkManager } from 'db://assets/Scripts/Managers/NetworkManager';
import { UIState } from './Enums/UIState';
const { ccclass, property } = _decorator;

@ccclass('Initialize')
export class Initialize extends Component {

    protected onLoad(): void {
		GameManager.inst
		UIManager.inst
		AudioManager.inst
		NetworkManager.inst

		director.loadScene("Menu", () => {
			AudioManager.inst.loadResources()
			UIManager.inst.setCanvas(director.getScene().getChildByName('UICanvas').getComponent(Canvas))
			UIManager.inst.switchUIState(UIState.Menu)
		});
	}
}
