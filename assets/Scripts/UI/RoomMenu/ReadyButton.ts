import { _decorator, Component, Node, Button } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Managers/AudioManager';
import { UIManager } from 'db://assets/Scripts/Managers/UIManager';
import { UIState } from 'db://assets/Scripts/Enums/UIState';
import { NetworkManager } from '../../Managers/NetworkManager';
const { ccclass, property } = _decorator;

@ccclass('ReadyButton')
export class ReadyButton extends Component {
	private button: Button
	private clickCallback: any;
	private hoverCallback: any;

	protected onEnable(): void {
		this.button = this.getComponent(Button)

		// Click event
		this.clickCallback = (event) => {
			AudioManager.inst.playOneShotUI('button_click');
			NetworkManager.inst.setReady();
		};
		this.node.on(Button.EventType.CLICK, this.clickCallback);

		// Hover event
		this.hoverCallback = (event) => {
			AudioManager.inst.playOneShotUI('button_hover');
		};
		this.node.on(Node.EventType.MOUSE_ENTER, this.hoverCallback);
	}

	protected onDisable(): void {
		this.node.off(Button.EventType.CLICK, this.clickCallback);
		this.node.off(Node.EventType.MOUSE_ENTER, this.hoverCallback);
	}

	update(deltaTime: number) {
		
	}
}
