import { _decorator, Node, director } from 'cc'
const { ccclass, property } = _decorator
import Colyseus from 'db://assets/Scripts/Colyseus/colyseus-cocos-creator.js'
import { GameManager } from 'db://assets/Scripts/Managers/GameManager'
import { UIManager } from 'db://assets/Scripts/Managers/UIManager'
import { UIState } from 'db://assets/Scripts/Enums/UIState'
import { InvitationData } from 'db://assets/Scripts/Components/InvitationData'

@ccclass('NetworkManager')
export class NetworkManager {
	private static _inst: NetworkManager
    public static get inst(): NetworkManager {
        if (this._inst == null) {
            this._inst = new NetworkManager()
        }
        return this._inst
    }

	private node!: Node
    private hostname: string = "127.0.0.1"
    private port: number = 3000
    private useSSL: boolean = false
    private accessToken: string = "UNITY"
    private client!: Colyseus.Client
    private LobbyRoom: Colyseus.Room

	constructor() {
		// Create a new NetworkManager node and add it to the scene
		this.node = new Node()
		this.node.name = 'NetworkManager'
		director.getScene().addChild(this.node);

        // Make it as a persistent node, so it won't be destroyed when scene changes
        director.addPersistRootNode(this.node)

		// Instantiate Colyseus Client
        // connects into (ws|wss)://hostname[:port]
		this.client = new Colyseus.Client(`${this.useSSL ? "wss" : "ws"}://${this.hostname}${([443, 80].includes(this.port) || this.useSSL) ? "" : `:${this.port}`}`)

		// Connect into the room
        this.connect()
	}

    async connect() {
        try {
            this.LobbyRoom = await this.client.join("LobbyRoom", { accessToken: this.accessToken })

            console.log("Successfully joined LobbyRoom")
            console.log("Current sessionId: ", this.LobbyRoom.sessionId)

            this.LobbyRoom.onStateChange((state) => {
                console.log("onStateChange: ", state)
            })

            this.LobbyRoom.onLeave((code) => {
                console.log("onLeave: ", code)
            })

			this.LobbyRoom.onMessage('setAuthorization', (authorization: string) => {
				GameManager.inst.store.setAuthorization(authorization)
			})

			this.LobbyRoom.onMessage('joinRoom', () => {
				UIManager.inst.switchUIState(UIState.PartyMenu)
			})

			this.LobbyRoom.onMessage('leaveRoom', () => {
				UIManager.inst.switchUIState(UIState.PlayMenu)
			})

			this.LobbyRoom.onMessage('receivedInvitation', (invitation: InvitationData) => {
				UIManager.inst.showInvitation(invitation)
			})
        } catch (e) {
            console.error(e)
        }
    }

    acceptInvitation(id: string) {
        this.LobbyRoom.send('acceptInvitation', id)
    }

    declineInvitation(id: string) {
        this.LobbyRoom.send('declineInvitation', id)
    }
}
