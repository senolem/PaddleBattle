import { Enum } from "cc"

export enum UIState {
	None = 1,
    Menu,
    PlayMenu,
	SettingsMenu,
    PartyMenu,
    MatchmakingMenu
}
Enum(UIState)