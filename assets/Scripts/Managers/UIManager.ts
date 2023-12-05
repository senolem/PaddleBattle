import { _decorator, Component, Node, View, ResolutionPolicy } from 'cc';
const { ccclass, property } = _decorator;
import { gameStore, reaction } from 'db://assets/Scripts/Store';
import { UIState } from 'db://assets/Scripts/Enums/UIState';

const view = View.instance

@ccclass('UIManager')
export class UIManager extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }

    protected onLoad(): void {
        this.makeResponsive();
        window.addEventListener('resize', () => {
            this.makeResponsive();
        });
    }

    switchUIState(state: string) {
        //console.log(state)
        switch(state) {
            case 'Menu':
            {
                console.log('menu')
            }
            break;

            case 'Play':
            {
                console.log('play')
            }
            break;

            case 'Party':
            {
                console.log('party')
            }
            break;

            case 'Matchmaking':
            {
                console.log('matchmaking')
            }
            break;
            
            default:
            {
                console.log('default')
            }
        }
    }

    makeResponsive(): void {
        const resolutionPolicy = view.getResolutionPolicy();
        const designResolution = view.getDesignResolutionSize();
        const desiredRatio = designResolution.width / designResolution.height;
        const deviceRatio = screen.width / screen.height;

        if (deviceRatio >= desiredRatio) {
            resolutionPolicy.setContentStrategy(ResolutionPolicy.ContentStrategy.FIXED_HEIGHT);
        }

        if (deviceRatio <= desiredRatio) {
            resolutionPolicy.setContentStrategy(ResolutionPolicy.ContentStrategy.FIXED_WIDTH);
        }

        view.setResolutionPolicy(resolutionPolicy);
    }
}


