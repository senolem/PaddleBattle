import { _decorator } from "cc"
const { ccclass } = _decorator

@ccclass('GameSettings')
export class GameSettings {
	musicVolume: number = 0
	effectsVolume: number = 0
	UIVolume: number = 0
}
