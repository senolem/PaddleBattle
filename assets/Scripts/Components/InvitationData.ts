import { _decorator } from "cc"
const { ccclass } = _decorator

@ccclass('InvitationData')
export class InvitationData {
	id: string
	username: string
	avatarUrl: string
}
