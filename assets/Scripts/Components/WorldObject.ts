import { _decorator, MobilityMode, Node, Sprite, SpriteFrame, UITransform, Vec3 } from "cc"
import { GameManager } from "db://assets/Scripts/Managers/GameManager"
const { ccclass } = _decorator

@ccclass('WorldObject')
export class WorldObject {
	node: Node
	state: any
	transform: UITransform
	sprite: Sprite
	id: string

	constructor(state: any, id: string, parent: Node) {
		this.id = id
		this.node = new Node()
		this.node.parent = parent
		this.node.name = this.id
		this.node.layer = 1 << 18
		this.state = state
		//switch (bodyType) {
		//	case BodyType.Static:
		//		this.node.mobility = MobilityMode.Static
		//		break
		//	
		//	case BodyType.Dynamic:
		//		this.node.mobility = MobilityMode.Movable
		//		break
//
		//	case BodyType.Kinematic:
		//		this.node.mobility = MobilityMode.Stationary
		//		break
		//}
		this.transform = this.node.addComponent(UITransform)
		this.sprite = this.node.addComponent(Sprite)

		this.node.position = state.position
		this.transform.width = state.size.x
		this.transform.height = state.size.y
		const spriteFrame = GameManager.inst.textureCache.get(state.texture)
		this.sprite.spriteFrame = spriteFrame
	}

	move(position: Vec3) {
		this.node.position = position
	}

	linear(p0: number, p1: number, t: number): number {
		return p0 + (p1 - p0) * t;
	}

	destroy() {
		this.node.destroy()
	}
}