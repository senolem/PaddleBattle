import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

import Colyseus from '../Colyseus/colyseus-cocos-creator.js';

@ccclass('NetworkManager')
export class NetworkManager extends Component {
    @property hostname = "127.0.0.1";
    @property port = 3000;
    @property useSSL = false;
    @property accessToken = "UNITY"

    client!: Colyseus.Client;
    room!: Colyseus.Room;

    start () {
        // Instantiate Colyseus Client
        // connects into (ws|wss)://hostname[:port]
        this.client = new Colyseus.Client(`${this.useSSL ? "wss" : "ws"}://${this.hostname}${([443, 80].includes(this.port) || this.useSSL) ? "" : `:${this.port}`}`);

        // Connect into the room
        this.connect();
    }

    async connect() {
        try {
            this.room = await this.client.join("LobbyRoom", { accessToken: this.accessToken });

            console.log("Successfully joined LobbyRoom");
            console.log("Current sessionId:", this.room.sessionId);

            this.room.onStateChange((state) => {
                console.log("onStateChange: ", state);
            });

            this.room.onLeave((code) => {
                console.log("onLeave:", code);
            });

        } catch (e) {
            console.error(e);
        }
    }
}
