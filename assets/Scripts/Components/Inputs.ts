import { _decorator } from "cc"
import { Bind } from 'db://assets/Scripts/Components/Keybinds'
import { NetworkManager } from "../Managers/NetworkManager"
const { ccclass } = _decorator

export interface InputState {
	upward: boolean
	downward: boolean
	powerup: boolean
	sequence: number
}

@ccclass('Inputs')
export class Inputs {
	upward: boolean = false
	downward: boolean = false
	powerup: boolean = false

	public setKeyUp(key: Bind) {
		switch (key) {
			case Bind.Upward:
				this.upward = false
				break

			case Bind.Downward:
				this.downward = false
				break

			case Bind.Powerup:
				this.powerup = false
				break
		}
	}

	public setKeyDown(key: Bind) {
		switch (key) {
			case Bind.Upward:
				this.upward = true
				break

			case Bind.Downward:
				this.downward = true
				break

			case Bind.Powerup:
				this.powerup = true
				break
		}
	}

	public compare(other: InputState) {
		return (this.upward === other.upward && this.downward === other.downward && this.powerup === other.powerup)
	}

	get getInputs(): InputState {
		const state: InputState = {
			upward: this.upward,
			downward: this.downward,
			powerup: this.powerup,
			sequence: 0
		}
		return state
	}
}
