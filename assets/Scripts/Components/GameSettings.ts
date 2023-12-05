import { _decorator, CCInteger, Component } from "cc";
const { ccclass, property } = _decorator;

@ccclass('GameSettings')
export class GameSettings extends Component {
	@property({ type: CCInteger })
	musicVolume: number;

	@property({ type: CCInteger })
	effectsVolume: number;

	@property({ type: CCInteger })
	interfaceVolume: number;
}
