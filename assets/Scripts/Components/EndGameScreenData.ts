import { AudioClip, SpriteFrame, Texture2D, _decorator } from "cc"
const { ccclass } = _decorator

@ccclass('EndGameScreenData')
export class EndGameScreenData {
	username: string
	avatarUrl: string
	leftPlayerScore: number
	rightPlayerScore: number
	winner: number
	loser: number
}
