import { _decorator, Component } from 'cc'
import { GameManager } from 'db://assets/Scripts/Managers/GameManager'
const { ccclass, property } = _decorator

@ccclass('Score')
export class Score extends Component {
	updateLeftScore() {
		GameManager.inst.game.updateLeftScore()
	}

	updateRightScore() {
		GameManager.inst.game.updateRightScore()
	}
}
