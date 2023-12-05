import { CCString, CCInteger, Texture2D } from 'cc';

export interface User {
	username: typeof CCString;
	avatarUrl: typeof CCString;
	avatar: typeof Texture2D;
	level: typeof CCInteger;
	usernameColor: typeof CCString;
};