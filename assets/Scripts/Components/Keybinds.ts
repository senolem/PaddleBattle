import { _decorator, Component, Game, KeyCode, Node, sys } from 'cc'
import { GameManager } from '../Managers/GameManager'
const { ccclass, property } = _decorator

export enum Bind {
	Upward,
	Downward,
	Powerup
}

export type KeybindCallback = (keyCode: KeyCode) => void

@ccclass('Keybinds')
export class Keybinds extends Component {
	private keybinds: Map<Bind, KeyCode> = new Map<Bind, KeyCode>()

	protected onLoad(): void {
		this.keybinds = this.loadKeybinds()
		if (this.keybinds.size === 0) {
			this.keybinds.set(Bind.Upward, KeyCode.KEY_W)
			this.keybinds.set(Bind.Downward, KeyCode.KEY_S)
			this.keybinds.set(Bind.Powerup, KeyCode.KEY_D)
			this.saveKeybinds()
			this.updateKeybinds()
		}
	}

	setKeybind(bind: Bind, keycode: KeyCode) {
		this.keybinds.set(bind, keycode)
		this.saveKeybinds()
	}

	getKeybind(bind: Bind) {
		return this.keybinds.get(bind)
	}

	loadKeybinds(): Map<Bind, KeyCode> {
		const loadedKeybinds = sys.localStorage.getItem('keybinds')
		if (loadedKeybinds) {
			const obj = JSON.parse(loadedKeybinds)
			const map = new Map<Bind, KeyCode>()
			Object.entries(obj).forEach(([key, value]) => {
				map.set(Number(key) as Bind, value as KeyCode)
			})
			return map
		} else {
			return new Map()
		}
	}
		
	saveKeybinds() {
		const obj = Object.fromEntries(this.keybinds)
		sys.localStorage.setItem('keybinds', JSON.stringify(obj))
		this.updateKeybinds()
	}

	updateKeybinds() {
		if (GameManager.inst.game) {
			GameManager.inst.game.updateKeybinds(this.keybinds)
		}
	}
}


