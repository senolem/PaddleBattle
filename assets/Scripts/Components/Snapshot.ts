import { Quat, Vec3 } from "cc"
import { EntityState } from "db://assets/Scripts/Components/EntityState"

export type State = EntityState[]
export type Value = number | string | Vec3 | Quat | undefined

export interface Snapshot {
	id: string
	time: number
	state: State
}

export interface InterpolatedSnapshot {
	state: State
	percentage: number
	older: string
	newer: string
}
