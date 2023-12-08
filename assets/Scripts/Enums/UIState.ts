import { Enum } from "cc"

export enum UIState {
	None = 1,
    Menu,
    PlayMenu,
	SettingsMenu,
	AudioSettingsMenu,
	ControlsSettingsMenu,
    PartyMenu,
    MatchmakingMenu
}
Enum(UIState)