import { _decorator, Node, Sprite, SpriteFrame, UITransform, Vec3 } from "cc"
import { BodyType } from "db://assets/Scripts/Enums/BodyType"
import { ShapeType } from "db://assets/Scripts/Enums/ShapeType"
import { ObjectType } from "db://assets/Scripts/Enums/ObjectType"
import { GameManager } from "../Managers/GameManager"
const { ccclass } = _decorator

@ccclass('WorldObject')
export class WorldObject {
	node: Node
	transform: UITransform
	sprite: Sprite
	id: string

	constructor(id: string, parent: Node, position: Vec3, size: Vec3, shapeType: ShapeType, bodyType: BodyType, texture: string) {
		this.id = id
		this.node = new Node()
		this.node.name = this.id
		this.node.layer = 1 << 18
		this.node.parent = parent
		this.transform = this.node.addComponent(UITransform)
		this.sprite = this.node.addComponent(Sprite)

		this.node.position = position
		this.transform.width = size.x
		this.transform.height = size.y
		const spriteFrame = GameManager.inst.textureCache.get(texture)
		this.sprite.spriteFrame = spriteFrame
	}

	move(position: Vec3) {
		this.node.position = position
	}

	destroy() {
		this.node.destroy()
	}
}