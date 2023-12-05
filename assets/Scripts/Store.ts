import { _decorator, CCBoolean, CCInteger } from 'cc';
import { GameSettings } from 'db://assets/Scripts/Components/GameSettings'
import mobx from 'mobx/dist/mobx.cjs.development.js';
import { UIState } from 'db://assets/Scripts/Enums/UIState';

const { ccclass, property, type } = _decorator;
export const { makeAutoObservable, autorun, reaction } = mobx;

@ccclass('GameStateStore')
export class GameStateStore {
	@property(GameSettings)
	gameSettings!: GameSettings

	@property({ type: UIState })
	uiState: UIState = UIState.Menu

	constructor() {
		makeAutoObservable(this)
	}

	setUIState(state: UIState): void {
		this.uiState = state
	}

	setMusicVolume(volume: number): void {
		this.gameSettings.musicVolume = volume
	}

	setEffectsVolume(volume: number): void {
		this.gameSettings.effectsVolume = volume
	}

	setInterfaceVolume(volume: number): void {
		this.gameSettings.interfaceVolume = volume
	}

	get getUIState(): UIState {
		return this.uiState
	}

	get getMusicVolume(): number {
		return this.gameSettings.musicVolume
	}

	get getEffectsVolume(): number {
		return this.gameSettings.effectsVolume
	}

	get getInterfaceVolume(): number {
		return this.gameSettings.interfaceVolume
	}
}

export const gameStore = new GameStateStore();
//devtools
//@ts-expect-error - Cocos can't properly import this library
window.__MOBX_DEVTOOLS_GLOBAL_STORES_HOOK__ = { stores: { gameStore }, $mobx: mobx.$mobx };