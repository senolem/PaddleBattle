import { _decorator, Component, EventKeyboard, find, Input, input, KeyCode, Label, Node } from 'cc';
import { Bind, KeybindCallback } from 'db://assets/Scripts/Components/Keybinds';
import { GameManager } from 'db://assets/Scripts/Managers/GameManager';
import { UIManager } from 'db://assets/Scripts/Managers/UIManager';
const { ccclass, property } = _decorator;

@ccclass('PressAnyKeyScreen')
export class PressAnyKeyScreen extends Component {
	private pressAnyKeyNode: Node
	private pressAnyKeyLabel: Label
	private cancellingNode: Node
	private cancellingLabel: Label
	private bind: Bind
	private timeoutInterval: number
	private onKeyBindSetCallback: KeybindCallback | null = null

	protected onLoad(): void {
		this.pressAnyKeyNode = find('PressAnyKeyLayout/PressAnyKey', this.node)
		this.pressAnyKeyLabel = this.pressAnyKeyNode.getComponent(Label)
		this.cancellingNode = find('PressAnyKeyLayout/Cancelling', this.node)
		this.cancellingLabel = this.cancellingNode.getComponent(Label)
	}

	protected onEnable(): void {
		input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
	}

	protected onDisable(): void {
		input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
	}

	onKeyDown(event: EventKeyboard) {
		clearInterval(this.timeoutInterval)
		GameManager.inst.keybinds.setKeybind(this.bind, event.keyCode)
		if (this.onKeyBindSetCallback) {
            this.onKeyBindSetCallback(event.keyCode);
        }
		this.node.active = false
    }

	show(bind: Bind, callback: KeybindCallback): KeyCode {
		if (this.node.active) {
			return null
		}
		this.node.active = true

		this.bind = bind
		this.onKeyBindSetCallback = callback || null
		let count = 5

		this.cancellingLabel.string = `Cancelling in ${count} seconds`
		this.node.active = true
		this.timeoutInterval = setInterval(() => {
			count -= 1
			this.cancellingLabel.string = `Cancelling in ${count} seconds`
			if (count <= 0) {
				clearInterval(this.timeoutInterval)
				this.node.active = false
			}
		}, 1000)
	}
}
