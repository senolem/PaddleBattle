import { _decorator } from "cc"
const { ccclass } = _decorator

@ccclass('MapData')
export class MapData {
	id: number
	displayName: string
	thumbnailUrl: string
	backgroundUrl: string
	musicUrl: string
}
