import { _decorator, Component, Node, Button } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Managers/AudioManager';
import { UIManager } from 'db://assets/Scripts/Managers/UIManager';
import { UIState } from 'db://assets/Scripts/Enums/UIState';
import { NetworkManager } from 'db://assets/Scripts/Managers/NetworkManager';
const { ccclass, property } = _decorator;

@ccclass('CancelButton')
export class CancelButton extends Component {
	private button: Button

	protected onLoad(): void {
		this.button = this.getComponent(Button)

		// Click event
		this.node.on(Button.EventType.CLICK, (event) => {
			AudioManager.inst.playOneShotUI('button_click')
			NetworkManager.inst.leaveMatchmaking()
		})

		// Hover event
		this.node.on(Node.EventType.MOUSE_ENTER, (event) => {
			AudioManager.inst.playOneShotUI('button_hover')
		})
	}

    update(deltaTime: number) {
        
    }
}