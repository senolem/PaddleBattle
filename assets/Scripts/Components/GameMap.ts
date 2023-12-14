import { AudioClip, SpriteFrame, Texture2D, _decorator } from "cc"
const { ccclass } = _decorator

@ccclass('GameMap')
export class GameMap {
	id?: number
	displayName?: string
	thumbnail?: SpriteFrame
	background?: SpriteFrame
	music?: AudioClip
}
