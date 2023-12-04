import { CCString, CCInteger } from 'cc';

export interface GameSettings {
	musicVolume: typeof CCInteger;
	effectsVolume: typeof CCInteger;
	interfaceVolume: typeof CCInteger;
	arcadeVolume: typeof CCInteger;
};
