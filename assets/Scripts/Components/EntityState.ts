import { Quat, Vec3 } from "cc"

export class EntityState{
	id: string = ''
	position: Vec3 = new Vec3()
	quaternion: Quat = new Quat()
	size: Vec3 = new Vec3()
	velocity: Vec3 = new Vec3()
	angularVelocity: Vec3 = new Vec3()
}