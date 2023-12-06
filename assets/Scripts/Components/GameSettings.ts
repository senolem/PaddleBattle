import { _decorator } from "cc"
const { ccclass } = _decorator

@ccclass('GameSettings')
export class GameSettings {
	musicVolume: number
	effectsVolume: number
	UIVolume: number
}
