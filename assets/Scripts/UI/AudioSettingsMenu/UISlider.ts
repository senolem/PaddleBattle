import { _decorator, Component, EventHandler, find, Label, Node, Slider } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('UISlider')
export class UISlider extends Component {
	private UISliderNode: Node
	private UISlider: Slider
	private UIVolumeValueNode: Node
	private UIVolumeValue: Label

	protected onLoad(): void {
		this.UISliderNode = this.node.getChildByName('UISlider')
		this.UISlider = this.UISliderNode.getComponent(Slider)
		this.UIVolumeValueNode = find('UIVolumeLayout/UIVolumeLabel', this.node)
		this.UIVolumeValue = this.UIVolumeValueNode.getComponent(Label)

		this.UISlider.progress = AudioManager.inst.getUIVolume
		this.UIVolumeValue.string = String(Math.round(this.UISlider.progress * 100))
	}

	protected onEnable(): void {
		this.UISlider!.node.on('slide', this.callback, this);
	}

	protected onDisable(): void {
		this.UISlider!.node.off('slide', this.callback, this);
	}

	callback(slider: Slider) {
        this.UIVolumeValue.string = String(Math.round(slider.progress * 100))
		AudioManager.inst.setUIVolume(slider.progress)
    }
}


