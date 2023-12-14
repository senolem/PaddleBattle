import { _decorator, CCBoolean, CCInteger, CCString } from 'cc'
import { GameSettings } from 'db://assets/Scripts/Components/GameSettings'
import mobx from 'mobx/dist/mobx.cjs.development.js'
import { UIState } from 'db://assets/Scripts/Enums/UIState'

const { ccclass, property, type } = _decorator
export const { makeAutoObservable, autorun, reaction } = mobx

@ccclass('GameStateStore')
export class GameStateStore {
	@property(GameSettings)
	gameSettings: GameSettings = new GameSettings

	@property({ type: UIState })
	uiState: UIState = UIState.None

	@property(CCString)
	authorization: string

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

	setUIVolume(volume: number): void {
		this.gameSettings.UIVolume = volume
	}

	setAuthorization(authorization: string): void {
		this.authorization = authorization
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

	get getUIVolume(): number {
		return this.gameSettings.UIVolume
	}

	get getAuthorization(): string {
		return this.authorization
	}
}

export const gameStore = new GameStateStore()
//devtools
//@ts-expect-error - Cocos can't properly import this library
window.__MOBX_DEVTOOLS_GLOBAL_STORES_HOOK__ = { stores: { gameStore }, $mobx: mobx.$mobx }