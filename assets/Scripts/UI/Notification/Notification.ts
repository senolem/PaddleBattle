import { _decorator, Button, Component, find, Label, Node } from 'cc'
import { AudioManager } from 'db://assets/Scripts/Managers/AudioManager'
const { ccclass, property } = _decorator

@ccclass('Notification')
export class Notification extends Component {
	private textNode: Node
	private textLabel: Label
    private okNode: Node
    private okButton: Button
	private clickCallback: any
	private hoverCallback: any

    protected onLoad(): void {
		this.okNode = find('NotificationLayout/ButtonsLayout/OKButton', this.node)
		this.okButton = this.okNode.getComponent(Button)
		this.textNode = find('NotificationLayout/TitleLayout/Message', this.node)
		this.textLabel = this.textNode.getComponent(Label)

        // Click event
		this.clickCallback = (event) => {
			AudioManager.inst.playOneShotUI('button_click')
            this.node.destroy()
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

	init(text: string): void {
		this.textLabel.string = text
    }
}


