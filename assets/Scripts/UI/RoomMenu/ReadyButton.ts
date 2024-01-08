import { _decorator, Component, Node, Button } from 'cc'
import { AudioManager } from 'db://assets/Scripts/Managers/AudioManager'
import { NetworkManager } from 'db://assets/Scripts/Managers/NetworkManager'
const { ccclass, property } = _decorator

@ccclass('ReadyButton')
export class ReadyButton extends Component {
	private button: Button
	private clickCallback: any
	private hoverCallback: any

	protected onLoad(): void {
		this.button = this.getComponent(Button)

		// Click event
		this.clickCallback = (event) => {
			NetworkManager.inst.setReady()
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

	setInteractable(interactable: boolean) {
		this.button.interactable = interactable
	}
}
