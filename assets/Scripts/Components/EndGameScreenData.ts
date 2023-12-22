import { AudioClip, SpriteFrame, Texture2D, _decorator } from "cc"
const { ccclass } = _decorator

@ccclass('EndGameScreenData')
export class EndGameScreenData {
	username: string
	avatar: SpriteFrame
	leftPlayerScore: number
	rightPlayerScore: number
	title: string
	result: number
}
