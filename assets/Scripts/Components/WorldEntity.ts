import { _decorator, BoxCollider, Collider, director, instantiate, lerp, Mesh, MeshRenderer, Node, physics, RigidBody, SphereCollider, tween, Vec3 } from "cc"
import { InputState } from "db://assets/Scripts/Components/Inputs"
import { BodyType } from "db://assets/Scripts/Enums/BodyType"
import { ShapeType } from "db://assets/Scripts/Enums/ShapeType"
import { GameManager } from "db://assets/Scripts/Managers/GameManager"
import { TweenPool } from "db://assets/Scripts/Components/TweenPool"
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
	targetPosition: Vec3
	tweenPool: TweenPool

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
		this.node.setPosition(state.position)
		this.node.setRotation(state.quaternion)
		this.node.setScale(state.size)

		this.body = this.node.addComponent(RigidBody)
		this.body.node = this.node
		if (state.mass === 0) {
			this.body.mass = 0.0001
		} else {
			this.body.mass = state.mass
		}
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
		if (this.state.fixedRotation) {
			this.body.angularFactor = new Vec3(0, 0, 0)
		}
		// this.body.fixedRotation = this.state.fixedRotation
		// No fixed rotation available?
		this.body.useGravity = false
		this.targetPosition = new Vec3()
		this.tweenPool = new TweenPool()
	}

	moveToVector(position: Vec3) {
		this.node.setPosition(position)
	}

	movePosition(x: number, y: number, z: number) {
		this.node.setPosition(new Vec3(x, y, z))
	}

	moveInputs(inputs: InputState) {
		const newPosition = this.node.getPosition()
		if (inputs.upward && !inputs.downward) {
			newPosition.y += this.state.baseSpeed
			this.node.setPosition(newPosition)
		} else if (!inputs.upward && inputs.downward) {
			newPosition.y -= this.state.baseSpeed
			this.node.setPosition(newPosition)
		}
	}

	updateState() {
		this.targetPosition.set(this.state.position.x, this.state.position.y, this.state.position.z)
		this.node.setPosition(this.targetPosition)

		// We are instantly updating the quaternion and size for now
		this.node.setRotation(this.state.quaternion)
		this.node.setScale(this.state.size)
	}

	tweenState() {
		const newPos = new Vec3(this.state.position.x, this.state.position.y, this.state.position.z)
		if (!this.targetPosition.equals(newPos)) {
			this.tweenPool.clear()
			this.node.setPosition(this.targetPosition)

			this.tweenPool.add(tween(this.node.position).to(1 / 20, newPos, {
				onUpdate: (target: Vec3) => {
					if (this.node) {
						this.node.setPosition(target)
					}
				}
			}).start())

			this.targetPosition.set(newPos)
		}
		
		// We are instantly updating the quaternion and size for now
		this.node.setRotation(this.state.quaternion)
		this.node.setScale(this.state.size)
	}

	destroy() {
		this.tweenPool.clear()
		this.node.destroy()
	}
}