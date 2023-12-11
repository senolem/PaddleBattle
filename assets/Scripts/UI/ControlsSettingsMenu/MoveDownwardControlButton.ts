import { _decorator, Component, Node, Button } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Managers/AudioManager';
import { UIManager } from 'db://assets/Scripts/Managers/UIManager';
import { UIState } from 'db://assets/Scripts/Enums/UIState';
const { ccclass, property } = _decorator;

@ccclass('MoveDownwardControlButton')
export class MoveDownwardControlButton extends Component {
	private button: Button

	protected onLoad(): void {
		this.button = this.getComponent(Button)

		// Click event
		this.node.on(Button.EventType.CLICK, (event) => {
			AudioManager.inst.playOneShotUI('button_click')
		})

		// Hover event
		this.node.on(Node.EventType.MOUSE_ENTER, (event) => {
			AudioManager.inst.playOneShotUI('button_hover')
		})
	}

    update(deltaTime: number) {
        
    }
}
