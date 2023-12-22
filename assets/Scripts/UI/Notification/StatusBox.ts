import { _decorator, AnimationComponent, Button, Component, find, Label, Node } from 'cc'
import { AudioManager } from 'db://assets/Scripts/Managers/AudioManager'
const { ccclass, property } = _decorator

@ccclass('StatusBox')
export class StatusBox extends Component {
	private titleNode: Node
	private titleLabel: Label
	private messageNode: Node
	private messageLabel: Label
	private animation: AnimationComponent
	private clickCallback: any

    protected onLoad(): void {
		this.titleNode = find('StatusBoxLayout/TitleLayout/StatusTitle', this.node)
		this.titleLabel = this.titleNode.getComponent(Label)
		this.messageNode = find('StatusBoxLayout/MessageLayout/StatusMessage', this.node)
		this.messageLabel = this.messageNode.getComponent(Label)
		this.animation = this.node.getComponent(AnimationComponent)
		this.node.addComponent(Button)

		// Click event
		this.clickCallback = (event) => {
			AudioManager.inst.playOneShotUI('status_close')
			if (this.animation && !this.animation.getState) {
            	this.animation.play('notificationFadeOut')
			}
		}
    }

	protected onEnable(): void {
		this.node.on(Button.EventType.CLICK, this.clickCallback)
	}

	protected onDisable(): void {
		this.node.off(Button.EventType.CLICK, this.clickCallback)
	}

	init(title: string, message: string): void {
		this.titleLabel.string = title
		this.messageLabel.string = message
		this.animation.play('notificationFadeIn')
		setTimeout(() => {
			if (this.animation && !this.animation.getState) {
				this.animation.play('notificationFadeOut')
			}
		}, 2500)
    }

	destroyStatusBox() {
		if (this.node) {
			this.node.destroy()
		}
	}
}
