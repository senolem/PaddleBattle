import { Enum } from "cc"

export enum UIState {
	None = 1,
    Menu,
    PlayMenu,
	SettingsMenu,
	AudioSettingsMenu,
	ControlsSettingsMenu,
    RoomMenu,
    MatchmakingMenu
}
Enum(UIState)