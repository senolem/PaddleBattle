import { _decorator, Quat, Vec2, Vec3 } from "cc"
import { GameManager } from "db://assets/Scripts/Managers/GameManager"
const { ccclass } = _decorator

@ccclass('SimulationState')
export class SimulationState {
	public position: Vec3
	public quaternion: Quat
	public size: Vec3
	public currentTick: number
}
