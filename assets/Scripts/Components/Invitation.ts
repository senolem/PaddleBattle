import { _decorator } from "cc"
const { ccclass } = _decorator

@ccclass('Invitation')
export class Invitation {
	id: string
	username: string
	avatarUrl: string
}
