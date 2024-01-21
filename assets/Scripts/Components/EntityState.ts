import { Quat, Vec3 } from "cc"
import { BodyType } from "db://assets/Scripts/Enums/BodyType"
import { EntityType } from "db://assets/Scripts/Enums/EntityType"
import { ShapeType } from "db://assets/Scripts/Enums/ShapeType"

export class EntityState{
	id: string = ''
	position: Vec3 = new Vec3()
	quaternion: Quat = new Quat()
	size: Vec3 = new Vec3()
	mass: number
	velocity: Vec3 = new Vec3()
	angularVelocity: Vec3 = new Vec3()
	bodyType: BodyType
	shapeType: ShapeType
	texture: string = ''
	entityType: EntityType = EntityType.Default
	linearFactor: Vec3 = new Vec3()
	linearDamping: number = 0.01
	fixedRotation: boolean
	baseSpeed: number = 0
}