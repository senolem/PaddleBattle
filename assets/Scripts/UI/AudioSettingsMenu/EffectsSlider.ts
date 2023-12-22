import { _decorator, Component, EventHandler, find, Label, Node, Slider } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('EffectsSlider')
export class EffectsSlider extends Component {
	private effectsSliderNode: Node
	private effectsSlider: Slider
	private effectsVolumeValueNode: Node
	private effectsVolumeValue: Label

	protected onLoad(): void {
		this.effectsSliderNode = this.node.getChildByName('EffectsSlider')
		this.effectsSlider = this.effectsSliderNode.getComponent(Slider)
		this.effectsVolumeValueNode = find('EffectsVolumeLayout/EffectsVolumeLabel', this.node)
		this.effectsVolumeValue = this.effectsVolumeValueNode.getComponent(Label)

		this.effectsSlider.progress = AudioManager.inst.getEffectsVolume
		this.effectsVolumeValue.string = String(Math.round(this.effectsSlider.progress * 100))
	}

	protected onEnable(): void {
		this.effectsSlider!.node.on('slide', this.callback, this);
	}

	protected onDisable(): void {
		this.effectsSlider!.node.off('slide', this.callback, this);
	}

	callback(slider: Slider) {
        this.effectsVolumeValue.string = String(Math.round(slider.progress * 100))
		AudioManager.inst.setEffectsVolume(slider.progress)
    }
}


