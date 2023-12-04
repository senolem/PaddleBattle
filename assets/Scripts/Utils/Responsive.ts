import { _decorator, Component, Node, View, ResolutionPolicy } from 'cc';
const { ccclass } = _decorator;

const view = View.instance

@ccclass('Responsive')
export class Responsive extends Component {
    makeResponsive(): void {
        /**
         * Apply a resolution policy to the design resolution size, which will dynamically adapt to the screen container
         * without losing the original aspect ratio. This will allow the game to be played on any device with any screen
         *
         * const designResolution = view.getDesignResolutionSize();
         * view.setDesignResolutionSize(designResolution.width, designResolution.height, ResolutionPolicy.EXACT_FIT);
         */

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

    onLoad() {
        this.makeResponsive();
        window.addEventListener('resize', () => {
            this.makeResponsive();
        });
    }
}
