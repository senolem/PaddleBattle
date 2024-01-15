import { InputState } from "./Inputs"

export interface ClientInputMessage {
	sn: number
	inputs: InputState[]
}