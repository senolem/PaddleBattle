import { _decorator, Node, director, assetManager, ImageAsset, Texture2D } from 'cc'
const { ccclass, property } = _decorator
import Colyseus from 'db://colyseus-sdk/colyseus.js';
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
	private GameRoom: Colyseus.Room

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

            console.log(`Successfully joined LobbyRoom (${this.LobbyRoom.id})`)
            console.log(`Current sessionId : ${this.LobbyRoom.sessionId}`)

            this.LobbyRoom.onLeave((code) => {
                console.log("onLeave: ", code)
            })

			this.LobbyRoom.onMessage('server_error', (error: string) => {
				console.error(error)
				UIManager.inst.showNotification(error)
			})

			this.LobbyRoom.onMessage('setAuthorization', (authorization: string) => {
				GameManager.inst.store.setAuthorization(authorization)
			})

			this.LobbyRoom.onMessage('joinRoom', async (reservation: any) => {
				try {
					UIManager.inst.switchUIState(UIState.RoomMenu)
					await this.connectToGame(reservation)
				} catch (error) {
					UIManager.inst.switchUIState(UIState.PlayMenu)
					console.error('Failed to join GameRoom')
				}
			})

			this.LobbyRoom.onMessage('leaveRoom', () => {
				this.GameRoom = null
				UIManager.inst.playersScrollView.players.forEach((value, key) => {
					value.destroy()
				})
				UIManager.inst.playersScrollView.players.clear()
				console.log('Left GameRoom')
				UIManager.inst.switchUIState(UIState.PlayMenu)
			})

			this.LobbyRoom.onMessage('receivedInvitation', (invitation: InvitationData) => {
				UIManager.inst.showInvitation(invitation)
			})

			this.LobbyRoom.onMessage('joinMatchmaking', async (reservation: any) => {
				UIManager.inst.switchUIState(UIState.MatchmakingMenu)
			})

			this.LobbyRoom.onMessage('leaveMatchmaking', async (reservation: any) => {
				UIManager.inst.switchUIState(UIState.PlayMenu)
			})
        } catch (e) {
            console.error(e)
        }
    }

	async connectToGame(reservation: any) {
		try {
			this.GameRoom = await this.client.consumeSeatReservation(reservation)
			console.log(`Successfully joined GameRoom (${this.GameRoom.id})`)

			this.GameRoom.onMessage('setMaps', (maps: Map<string, string>) => {
				maps.forEach((value, key) => {
					assetManager.loadRemote<ImageAsset>(value + '?authorization=' + GameManager.inst.store.getAuthorization, (err, imageAsset) => {
						const thumbnail = new Texture2D();
						thumbnail.image = imageAsset;
						UIManager.inst.mapsScrollView.addMap(key, thumbnail)
					});
				})
			})

			this.GameRoom.state.listen('players', (value, previousValue) => {
				value.forEach((value, key) => {
					assetManager.loadRemote<ImageAsset>(value.avatarUrl + '?authorization=' + GameManager.inst.store.getAuthorization, (err, imageAsset) => {
						const avatar = new Texture2D();
						avatar.image = imageAsset;
						UIManager.inst.playersScrollView.updatePlayer(value.id, value.username, avatar)
					});
				})
			})
		} catch (error) {
			this.leaveRoom()
			throw new Error(error)
		}
	}

	createRoom() {
        this.LobbyRoom.send('createRoom')
    }

	leaveRoom() {
        this.LobbyRoom.send('leaveRoom')
    }

    acceptInvitation(id: string) {
		console.log(id)
        this.LobbyRoom.send('acceptInvitation', id)
    }

    declineInvitation(id: string) {
        this.LobbyRoom.send('declineInvitation', id)
    }

	joinMatchmaking() {
		this.LobbyRoom.send('joinMatchmaking')
	}

	leaveMatchmaking() {
		this.LobbyRoom.send('leaveMatchmaking')
	}

	getOnlineUsers(): number {
		return this.LobbyRoom.state.players.size
	}
}
