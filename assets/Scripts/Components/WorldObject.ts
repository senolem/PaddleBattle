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
		this.state = state

		const existingNode = parent.getChildByName(this.id)
		if (!existingNode) {
			this.node = new Node()
			this.node.parent = parent
			this.node.name = this.id
			this.node.layer = 1 << 18
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
		} else {
			this.node = existingNode
			this.transform = this.node.getComponent(UITransform)
			this.sprite = this.node.getComponent(Sprite)
		}
		this.node.position = state.position
		this.transform.width = state.size.x
		this.transform.height = state.size.y
		const spriteFrame = GameManager.inst.textureCache.get(state.texture)
		this.sprite.spriteFrame = spriteFrame
	}

	move(position: Vec3) {
		this.node.position = position
	}

	destroy() {
		this.node.destroy()
	}
}