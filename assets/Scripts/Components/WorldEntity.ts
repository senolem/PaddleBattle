import { _decorator, BoxCollider, Collider, director, instantiate, lerp, Mesh, MeshRenderer, Node, physics, RigidBody, SphereCollider, Vec3 } from "cc"
import { InputState } from "db://assets/Scripts/Components/Inputs"
import { BodyType } from "db://assets/Scripts/Enums/BodyType"
import { ShapeType } from "db://assets/Scripts/Enums/ShapeType"
import { GameManager } from "../Managers/GameManager"
const { ccclass } = _decorator

@ccclass('WorldEntity')
export class WorldEntity {
	node: Node
	state: any
	mesh: Mesh
	meshRenderer: MeshRenderer
	id: string
	body: RigidBody
	collider: Collider

	constructor(state: any, id: string, parent: Node) {
		const existingNode = parent.getChildByName(id)
		if (existingNode) {
			existingNode.destroy()
		}

		this.id = id
		this.state = state

		let prefab
		switch (state.shapeType) {
			case ShapeType.Sphere:
				prefab = GameManager.inst.prefabsCache.get('Sphere')
				break
			
			case ShapeType.Box:
				prefab = GameManager.inst.prefabsCache.get('Cube')
				break
			
			default:
				prefab = GameManager.inst.prefabsCache.get('Cube')
				break
		}

		this.node = instantiate(prefab)
		this.node.parent = director.getScene().getChildByName('Entities')
		this.node.name = this.id
		this.node.layer = 1 << 18
		this.meshRenderer = this.node.getComponent(MeshRenderer)
		this.node.position = state.position
		this.node.rotation = state.quaternion
		this.node.scale = state.size

		this.body = this.node.addComponent(RigidBody)
		this.body.node = this.node
		this.body.mass = state.mass
		this.body.setLinearVelocity(this.state.velocity)
		this.body.setAngularVelocity(this.state.angularVelocity)
		switch (state.bodyType) {
			case BodyType.Static:
				this.body.type = physics.ERigidBodyType.STATIC
				break
			
			case BodyType.Dynamic:
				this.body.type = physics.ERigidBodyType.DYNAMIC
				break

			case BodyType.Kinematic:
				this.body.type = physics.ERigidBodyType.KINEMATIC
				break
		}
		this.body.linearFactor = new Vec3(this.state.linearFactor.x, this.state.linearFactor.y, this.state.linearFactor.z)
		this.body.linearDamping = this.state.linearDamping
		// this.body.fixedRotation = this.state.fixedRotation
		// No fixed rotation available?
	}

	move(position: Vec3) {
		this.node.position = position
	}

	moveInputs(inputs: InputState) {
		if (inputs.upward && !inputs.downward) {
			this.body.setLinearVelocity(new Vec3(0, this.state.baseSpeed, 0))
		} else if (!inputs.upward && inputs.downward) {
			this.body.setLinearVelocity(new Vec3(0, -this.state.baseSpeed, 0))
		} else {
			this.body.setLinearVelocity(new Vec3(0, 0, 0))
		}
	}

	tween() {
		this.node.position = new Vec3(
			lerp(this.node.position.x, this.state.position.x, 0.9),
			lerp(this.node.position.y, this.state.position.y, 0.9),
			lerp(this.node.position.z, this.state.position.z, 0.9)
		)
	}

	destroy() {
		this.node.destroy()
	}
}