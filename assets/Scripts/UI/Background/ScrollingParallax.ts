import { _decorator, Component, Graphics, Material, Node, Sprite, Vec2 } from 'cc'
const { ccclass, property } = _decorator

@ccclass('ScrollingParallax')
export class ScrollingParallax extends Component {
	private skyNode: Node
	private clouds1Node: Node
	private clouds2Node: Node
	private mountainsNode: Node
	private clouds3Node: Node
	private clouds4Node: Node
	private clouds5Node: Node

	private sky: Material
	private clouds1: Material
	private clouds2: Material
	private mountains: Material
	private clouds3: Material
	private clouds4: Material
	private clouds5: Material
	private graphics: Material

	private skySpeed: number = 0
	private clouds1Speed: number = 0.0125
	private clouds2Speed: number = 0.0155
	private mountainsSpeed: number = 0.0205
	private clouds3Speed: number = 0.025
	private clouds4Speed: number = 0.05
	private clouds5Speed: number = 0.125

	private skyOffset: Vec2 = new Vec2(0, 0)
	private clouds1Offset: Vec2 = new Vec2(0, 0)
	private clouds2Offset: Vec2 = new Vec2(0, 0)
	private mountainsOffset: Vec2 = new Vec2(0, 0)
	private clouds3Offset: Vec2 = new Vec2(0, 0)
	private clouds4Offset: Vec2 = new Vec2(0, 0)
	private clouds5Offset: Vec2 = new Vec2(0, 0)

	protected onEnable(): void {
		this.skyOffset = new Vec2(0, 0)
		this.clouds1Offset =  new Vec2(0, 0)
		this.clouds2Offset =  new Vec2(0, 0)
		this.mountainsOffset = new Vec2(0, 0)
		this.clouds3Offset =  new Vec2(0, 0)
		this.clouds4Offset =  new Vec2(0, 0)
		this.clouds5Offset =  new Vec2(0, 0)
	}

	protected onLoad(): void {
		this.skyNode = this.node.getChildByName('sky')
		this.clouds1Node = this.node.getChildByName('clouds1')
		this.clouds2Node = this.node.getChildByName('clouds2')
		this.mountainsNode = this.node.getChildByName('mountains')
		this.clouds3Node = this.node.getChildByName('clouds3')
		this.clouds4Node = this.node.getChildByName('clouds4')
		this.clouds5Node = this.node.getChildByName('clouds5')

		this.sky = this.skyNode.getComponent(Sprite).material
		this.clouds1 = this.clouds1Node.getComponent(Sprite).material
		this.clouds2 = this.clouds2Node.getComponent(Sprite).material
		this.mountains = this.mountainsNode.getComponent(Sprite).material
		this.clouds3 = this.clouds3Node.getComponent(Sprite).material
		this.clouds4 = this.clouds4Node.getComponent(Sprite).material
		this.clouds5 = this.clouds5Node.getComponent(Sprite).material
	}

	protected update(dt: number): void {
		this.updateOffset(this.sky, this.skySpeed, this.skyOffset, dt)
		this.updateOffset(this.clouds1, this.clouds1Speed, this.clouds1Offset, dt)
		this.updateOffset(this.clouds2, this.clouds2Speed, this.clouds2Offset, dt)
		this.updateOffset(this.mountains, this.mountainsSpeed, this.mountainsOffset, dt)
		this.updateOffset(this.clouds3, this.clouds3Speed, this.clouds3Offset, dt)
		this.updateOffset(this.clouds4, this.clouds4Speed, this.clouds4Offset, dt)
		this.updateOffset(this.clouds5, this.clouds5Speed, this.clouds5Offset, dt)
	}

	updateOffset(material: Material, speed: number, offset: Vec2, dt: number) {
		offset.x += dt * speed
		if (offset.x >= 1.00) {
			offset.x = 0
		}
		material.setProperty('offset', offset)
	}
}
