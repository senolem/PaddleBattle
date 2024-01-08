import { _decorator, Component, Graphics, lerp, Material, math, Node, screen, Sprite, Vec2, view } from 'cc'
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

	private skyMaterial: Material
	private clouds1Material: Material
	private clouds2Material: Material
	private mountainsMaterial: Material
	private clouds3Material: Material
	private clouds4Material: Material
	private clouds5Material: Material
	private graphicsMaterial: Material

    private skySpeed: number = 0
    private clouds1Speed: number = 0.006
    private clouds2Speed: number = 0.0160
    private mountainsSpeed: number = 0.0200
    private clouds3Speed: number = 0.028
    private clouds4Speed: number = 0.04
    private clouds5Speed: number = 0.120

	private skyOffset: Vec2 = new Vec2(0, 0)
	private clouds1Offset: Vec2 = new Vec2(0, 0)
	private clouds2Offset: Vec2 = new Vec2(0, 0)
	private mountainsOffset: Vec2 = new Vec2(0, 0)
	private clouds3Offset: Vec2 = new Vec2(0, 0)
	private clouds4Offset: Vec2 = new Vec2(0, 0)
	private clouds5Offset: Vec2 = new Vec2(0, 0)

	private skyAccumulatedOffset: Vec2 = new Vec2(0, 0)
	private clouds1AccumulatedOffset: Vec2 = new Vec2(0, 0)
	private clouds2AccumulatedOffset: Vec2 = new Vec2(0, 0)
	private mountainsAccumulatedOffset: Vec2 = new Vec2(0, 0)
	private clouds3AccumulatedOffset: Vec2 = new Vec2(0, 0)
	private clouds4AccumulatedOffset: Vec2 = new Vec2(0, 0)
	private clouds5AccumulatedOffset: Vec2 = new Vec2(0, 0)

	private canvasSize: math.Size
	private designSize: math.Size

	protected onEnable(): void {
		this.skyOffset = new Vec2(0, 0)
		this.clouds1Offset =  new Vec2(0, 0)
		this.clouds2Offset =  new Vec2(0, 0)
		this.mountainsOffset = new Vec2(0, 0)
		this.clouds3Offset =  new Vec2(0, 0)
		this.clouds4Offset =  new Vec2(0, 0)
		this.clouds5Offset =  new Vec2(0, 0)
		this.updateScreenSize()

		window.addEventListener('resize', this.updateScreenSize)
	}

	protected onDisable(): void {
		window.removeEventListener('resize', this.updateScreenSize)
	}

	protected onLoad(): void {
		this.skyNode = this.node.getChildByName('sky')
		this.clouds1Node = this.node.getChildByName('clouds1')
		this.clouds2Node = this.node.getChildByName('clouds2')
		this.mountainsNode = this.node.getChildByName('mountains')
		this.clouds3Node = this.node.getChildByName('clouds3')
		this.clouds4Node = this.node.getChildByName('clouds4')
		this.clouds5Node = this.node.getChildByName('clouds5')

		this.skyMaterial = this.skyNode.getComponent(Sprite).material
		this.clouds1Material = this.clouds1Node.getComponent(Sprite).material
		this.clouds2Material = this.clouds2Node.getComponent(Sprite).material
		this.mountainsMaterial = this.mountainsNode.getComponent(Sprite).material
		this.clouds3Material = this.clouds3Node.getComponent(Sprite).material
		this.clouds4Material = this.clouds4Node.getComponent(Sprite).material
		this.clouds5Material = this.clouds5Node.getComponent(Sprite).material
	}

	protected update(dt: number): void {
		this.updateOffset(this.skyMaterial, this.skySpeed, this.skyOffset, this.skyAccumulatedOffset, dt)
		this.updateOffset(this.clouds1Material, this.clouds1Speed, this.clouds1Offset, this.clouds1AccumulatedOffset, dt)
		this.updateOffset(this.clouds2Material, this.clouds2Speed, this.clouds2Offset, this.clouds2AccumulatedOffset, dt)
		this.updateOffset(this.mountainsMaterial, this.mountainsSpeed, this.mountainsOffset, this.mountainsAccumulatedOffset, dt)
		this.updateOffset(this.clouds3Material, this.clouds3Speed, this.clouds3Offset, this.clouds3AccumulatedOffset, dt)
		this.updateOffset(this.clouds4Material, this.clouds4Speed, this.clouds4Offset, this.clouds4AccumulatedOffset, dt)
		this.updateOffset(this.clouds5Material, this.clouds5Speed, this.clouds5Offset, this.clouds5AccumulatedOffset, dt)
	}

	updateOffset(material: Material, speed: number, offset: Vec2, accumulatedOffset: Vec2, dt: number) {
		const pixelsPerSecond = speed * this.canvasSize.width;
	
		const pixelsThisFrame = pixelsPerSecond * dt;
	
		accumulatedOffset.x += pixelsThisFrame;
	
		if (Math.abs(accumulatedOffset.x) >= 1) {
			const offsetChange = Math.floor(accumulatedOffset.x);
			accumulatedOffset.x -= offsetChange;
			offset.x += offsetChange / this.canvasSize.width;

			material.setProperty('offset', offset);
		}
	}	

	updateScreenSize = () => {
		this.canvasSize = screen.windowSize
		this.designSize = view.getDesignResolutionSize()
	}
}
