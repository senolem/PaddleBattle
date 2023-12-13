import { _decorator, Button, Component, find, Label, Node } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Managers/AudioManager';
import { UIManager } from 'db://assets/Scripts/Managers/UIManager';
import { UIState } from 'db://assets/Scripts/Enums/UIState';
import { NetworkManager } from 'db://assets/Scripts/Managers/NetworkManager';
const { ccclass, property } = _decorator;

@ccclass('Notification')
export class Notification extends Component {
	private textNode: Node
	private textLabel: Label
    private okNode: Node
    private okButton: Button

    protected onLoad(): void {
		this.okNode = find('NotificationLayout/ButtonsLayout/OKButton', this.node)
		this.okButton = this.okNode.getComponent(Button)
		this.textNode = find('NotificationLayout/TitleLayout/Message', this.node)
		this.textLabel = this.textNode.getComponent(Label)

        // Click event
		this.okNode.on(Button.EventType.CLICK, (event) => {
			AudioManager.inst.playOneShotUI('button_click')
            this.node.destroy()
		})

		// Hover event
		this.okNode.on(Node.EventType.MOUSE_ENTER, (event) => {
			AudioManager.inst.playOneShotUI('button_hover')
		})
		this.okNode.on(Node.EventType.MOUSE_ENTER, (event) => {
			AudioManager.inst.playOneShotUI('button_hover')
		})
    }

	init(text: string): void {
		this.textLabel.string = text
    }
}

