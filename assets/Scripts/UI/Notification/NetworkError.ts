import { _decorator, Button, Component, find, Label, Node } from 'cc'
import { AudioManager } from 'db://assets/Scripts/Managers/AudioManager'
import { NetworkManager } from 'db://assets/Scripts/Managers/NetworkManager'
const { ccclass, property } = _decorator

@ccclass('NetworkError')
export class NetworkError extends Component {
	private textNode: Node
	private textLabel: Label
    private reconnectNode: Node
    private reconnectButton: Button
	private clickCallback: any
	private hoverCallback: any

    protected onLoad(): void {
		this.reconnectNode = find('NotificationLayout/ButtonsLayout/ReconnectButton', this.node)
		this.reconnectButton = this.reconnectNode.getComponent(Button)
		this.textNode = find('NotificationLayout/TitleLayout/Message', this.node)
		this.textLabel = this.textNode.getComponent(Label)

        // Click event
		this.clickCallback = (event) => {
			AudioManager.inst.playOneShotUI('button_click')
			NetworkManager.inst.connect()
            this.node.destroy()
		}

		// Hover event
		this.hoverCallback = (event) => {
			AudioManager.inst.playOneShotUI('button_hover')
		}
    }

	protected onEnable(): void {
		this.reconnectNode.on(Button.EventType.CLICK, this.clickCallback)
		this.reconnectNode.on(Node.EventType.MOUSE_ENTER, this.hoverCallback)
	}

	protected onDisable(): void {
		this.reconnectNode.off(Button.EventType.CLICK, this.clickCallback)
		this.node.off(Node.EventType.MOUSE_ENTER, this.hoverCallback)
	}

	init(text: string): void {
		this.textLabel.string = text
    }
}


