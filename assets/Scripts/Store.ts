import { _decorator, CCBoolean, CCInteger } from 'cc';
import { GameSettings } from 'db://assets/Scripts/Interfaces/GameSettings'
import mobx from 'mobx/dist/mobx.cjs.development.js';

const { ccclass, property } = _decorator;
export const { makeAutoObservable, autorun, reaction } = mobx;

// Define your state class
@ccclass('GameStateStore')
export class GameStateStore {
	gameSettings: GameSettings
	@property(CCInteger)
	gameVolume: 0

	constructor() {
		makeAutoObservable(this);
	}

	setMusicVolume(volume: number): void {
		this.gameVolume = volume
	}
}

// Create an instance of GameState
export const gameStore = new GameStateStore();
//devtools
//@ts-expect-error - Cocos can't properly import this library
window.__MOBX_DEVTOOLS_GLOBAL_STORES_HOOK__ = { stores: { gameStore }, $mobx: mobx.$mobx };