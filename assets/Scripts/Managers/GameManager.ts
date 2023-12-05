import { _decorator, Component, Node } from 'cc';
import { GameStateStore } from 'db://assets/Scripts/Store';
import { UIManager } from 'db://assets/Scripts/Managers/UIManager';
import { NetworkManager } from 'db://assets/Scripts/Managers/NetworkManager';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property({ type: GameStateStore })
    store!: GameStateStore;

    @property({ type: UIManager })
    uiManager!: UIManager;

    @property({ type: NetworkManager })
    networkManager!: NetworkManager;

    start() {

    }

    update(deltaTime: number) {
        
    }
}


