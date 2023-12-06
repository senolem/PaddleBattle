import { CCString, CCInteger } from 'cc'

export interface Invitation {
	username: typeof CCString
	avatarUrl: typeof CCString
	sender: typeof CCInteger
	recipient: typeof CCInteger
}