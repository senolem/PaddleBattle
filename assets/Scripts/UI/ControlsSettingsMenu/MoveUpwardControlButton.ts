import { _decorator, Component, Node, Button, Label, KeyCode } from 'cc'
import { AudioManager } from 'db://assets/Scripts/Managers/AudioManager'
import { UIManager } from 'db://assets/Scripts/Managers/UIManager'
import { Bind, KeybindCallback } from 'db://assets/Scripts/Components/Keybinds'
import { GameManager } from 'db://assets/Scripts/Managers/GameManager'
const { ccclass, property } = _decorator

@ccclass('MoveUpwardControlButton')
export class MoveUpwardControlButton extends Component {
	private buttonNode: Node
	private button: Button
	private keybindNode: Node
	private keybindLabel: Label
	private clickCallback: any
	private hoverCallback: any
	private keybindCallback: KeybindCallback

	protected onLoad(): void {
		this.buttonNode = this.node.getChildByName('MoveUpwardControlButton')
		this.button = this.buttonNode.getComponent(Button)
		this.keybindNode = this.buttonNode.getChildByName('Label')
		this.keybindLabel = this.keybindNode.getComponent(Label)

		this.updateKeybindLabel(GameManager.inst.keybinds.getKeybind(Bind.Upward))

		// Click event
		this.clickCallback = (event) => {
			AudioManager.inst.playOneShotUI('button_click')
			UIManager.inst.pressAnyKeyScreen.show(Bind.Upward, this.updateKeybindLabel.bind(this))
		}

		// Hover event
		this.hoverCallback = (event) => {
			AudioManager.inst.playOneShotUI('button_hover')
		}
	}

	protected onEnable(): void {
		this.buttonNode.on(Button.EventType.CLICK, this.clickCallback)
		this.buttonNode.on(Node.EventType.MOUSE_ENTER, this.hoverCallback)
	}

	protected onDisable(): void {
		this.buttonNode.off(Button.EventType.CLICK, this.clickCallback)
		this.buttonNode.off(Node.EventType.MOUSE_ENTER, this.hoverCallback)
	}

	private updateKeybindLabel(keycode: KeyCode): void {
		this.keybindLabel.string = `${KeyCode[keycode]}`;
	}
}
