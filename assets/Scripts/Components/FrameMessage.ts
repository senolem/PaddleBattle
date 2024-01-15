import { Inputs } from "./Inputs"

export interface FrameMessage {
    inputs: Inputs[]
    lastSn?: number
}