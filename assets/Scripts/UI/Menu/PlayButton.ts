import { _decorator, Component, Node, Button, EventHandler } from 'cc'
import { AudioManager } from 'db://assets/Scripts/Managers/AudioManager'
import { UIManager } from 'db://assets/Scripts/Managers/UIManager'
import { UIState } from 'db://assets/Scripts/Enums/UIState'
const { ccclass, property } = _decorator

@ccclass('PlayButton')
export class PlayButton extends Component {
	private button: Button
	private clickCallback: any
	private hoverCallback: any

	protected onLoad(): void {
		this.button = this.getComponent(Button)

		// Click event
		this.clickCallback = (event) => {
			AudioManager.inst.playOneShotUI('button_click')
			UIManager.inst.switchUIState(UIState.PlayMenu)
		}

		// Hover event
		this.hoverCallback = (event) => {
			AudioManager.inst.playOneShotUI('button_hover')
		}
	}

	protected onEnable(): void {
		this.node.on(Button.EventType.CLICK, this.clickCallback)
		this.node.on(Node.EventType.MOUSE_ENTER, this.hoverCallback)
	}

	protected onDisable(): void {
		this.node.off(Button.EventType.CLICK, this.clickCallback)
		this.node.off(Node.EventType.MOUSE_ENTER, this.hoverCallback)
	}
}
