import { _decorator, Component, EventHandler, find, Label, Node, Slider } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('MusicSlider')
export class MusicSlider extends Component {
	private musicSliderNode: Node
	private musicSlider: Slider
	private musicVolumeValueNode: Node
	private musicVolumeValue: Label

	protected onLoad(): void {
		this.musicSliderNode = this.node.getChildByName('MusicSlider')
		this.musicSlider = this.musicSliderNode.getComponent(Slider)
		this.musicVolumeValueNode = find('MusicVolumeLayout/MusicVolumeLabel', this.node)
		this.musicVolumeValue = this.musicVolumeValueNode.getComponent(Label)

		this.musicSlider.progress = AudioManager.inst.getMusicVolume
		this.musicVolumeValue.string = String(Math.round(this.musicSlider.progress * 100))
	}

	protected onEnable(): void {
		this.musicSlider!.node.on('slide', this.callback, this);
	}

	protected onDisable(): void {
		this.musicSlider!.node.off('slide', this.callback, this);
	}

	callback(slider: Slider) {
        this.musicVolumeValue.string = String(Math.round(slider.progress * 100))
		AudioManager.inst.setMusicVolume(slider.progress)
    }
}


