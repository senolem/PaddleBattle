import { _decorator, Node, director, assetManager, ImageAsset, Texture2D, UI, Canvas, game } from 'cc'
const { ccclass, property } = _decorator
import Colyseus from 'db://colyseus-sdk/colyseus.js'
import { GameManager } from 'db://assets/Scripts/Managers/GameManager'
import { UIManager } from 'db://assets/Scripts/Managers/UIManager'
import { UIState } from 'db://assets/Scripts/Enums/UIState'
import { InvitationData } from 'db://assets/Scripts/Components/InvitationData'
import { MapData } from 'db://assets/Scripts/Components/MapData'
import { Game } from 'db://assets/Scripts/Game'
import { PaddleState } from 'db://assets/Scripts/Enums/PaddleState'

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
		director.getScene().addChild(this.node)

		// Make it as a persistent node, so it won't be destroyed when scene changes
		director.addPersistRootNode(this.node)

		// Instantiate Colyseus Client
		// connects into (ws|wss)://hostname[:port]
		this.client = new Colyseus.Client(`${this.useSSL ? "wss" : "ws"}://${this.hostname}${([443, 80].includes(this.port) || this.useSSL) ? "" : `:${this.port}`}`)

		// Connect into the room
		this.connect()
	}

	async connect() {
		if (!this.LobbyRoom || !this.LobbyRoom.connection.isOpen) {
			try {
				this.LobbyRoom = await this.client.join("LobbyRoom", { accessToken: this.accessToken })

				console.log(`Successfully joined LobbyRoom (${this.LobbyRoom.id})`)
				console.log(`Current sessionId : ${this.LobbyRoom.sessionId}`)

				this.LobbyRoom.onLeave((code) => {
					console.log("onLeave: ", code)
					if (code != 1000) {
						UIManager.inst.showNetworkError('Connection to the server lost. Do you want to try to reconnect?')
					}
				})

				this.LobbyRoom.onMessage('server_error', (error: string) => {
					console.error(`[LobbyRoom] ${error}`)
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
						UIManager.inst.showNotification('Failed to join GameRoom')
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

				this.LobbyRoom.onMessage('joinMatchmaking', () => {
					UIManager.inst.switchUIState(UIState.MatchmakingMenu)
				})

				this.LobbyRoom.onMessage('leaveMatchmaking', () => {
					UIManager.inst.switchUIState(UIState.PlayMenu)
				})
			} catch (error) {
				console.error(error)
			}
		} else {
			UIManager.inst.showNotification('Already connected to LobbyRoom')
		}
	}

	async connectToGame(reservation: any) {
		try {
			this.GameRoom = await this.client.consumeSeatReservation(reservation)
			console.log(`Successfully joined GameRoom (${this.GameRoom.id})`)

			this.GameRoom.onMessage('server_error', (error: string) => {
				console.error(`[GameRoom] ${error}`)
				UIManager.inst.showNotification(error)
			})

			this.GameRoom.onMessage('updateMaps', (maps: MapData[]) => {
				GameManager.inst.thumbnailCache.clear()
				GameManager.inst.backgroundCache.clear()
				GameManager.inst.musicCache.clear()
				UIManager.inst.mapsScrollView.clearMaps()
				if (maps) {
					maps.forEach((value, index) => {
						UIManager.inst.mapsScrollView.addMap(value)
					})
					UIManager.inst.mapsScrollView.setSelectedMap(this.GameRoom.state.selectedMap)
				}
			})

			this.GameRoom.onMessage('setMaps', (maps: MapData[]) => {
				UIManager.inst.mapsScrollView.clearMaps()
				if (maps) {
					maps.forEach((value, index) => {
						UIManager.inst.mapsScrollView.addMap(value)
					})
					UIManager.inst.mapsScrollView.setSelectedMap(this.GameRoom.state.selectedMap)
				}
			})

			this.GameRoom.onMessage('loadGame', () => {
				UIManager.inst.loadingScreen.show()
				director.loadScene('Game', () => {
					UIManager.inst.loadingScreen.setLoadingInfo('Initializing game')
					const gameCanvasNode: Node = director.getScene().getChildByName('GameCanvas')
					const gameCanvas: Canvas = gameCanvasNode.getComponent(Canvas)
					gameCanvas.cameraComponent = GameManager.inst.camera
					GameManager.inst.game = gameCanvasNode.getComponent(Game)
					UIManager.inst.loadingScreen.setLoadingInfo('Clearing UI')
					UIManager.inst.switchUIState(UIState.None)
					UIManager.inst.notifications.children.forEach((node) => {
						node.destroy()
					})
					UIManager.inst.loadingScreen.setLoadingInfo('Setting UI')
					const selectedMap = GameManager.inst.maps.get(this.GameRoom.state.selectedMap)
					GameManager.inst.game.setBackground(selectedMap.background)
					//GameManager.inst.game.setMusic(selectedMap.music)
					const leftPlayer = this.GameRoom.state.players.get(this.GameRoom.state.leftPlayer)
					const rightPlayer = this.GameRoom.state.players.get(this.GameRoom.state.rightPlayer)
					GameManager.inst.game.setLeftPlayer(GameManager.inst.avatarCache.get(leftPlayer.avatarUrl), leftPlayer.username)
					GameManager.inst.game.setRightPlayer(GameManager.inst.avatarCache.get(rightPlayer.avatarUrl), rightPlayer.username)
					GameManager.inst.game.setScores(rightPlayer.score, rightPlayer.score)
					UIManager.inst.loadingScreen.setLoadingInfo('Instancing room')
					this.GameRoom.send('clientReady')
					UIManager.inst.loadingScreen.setLoadingInfo('Waiting for other players')
				})
			})

			this.GameRoom.onMessage('startGame', () => {
				UIManager.inst.loadingScreen.hide()
				GameManager.inst.game.showHUD()
			})

			this.GameRoom.state.listen('countdownStarted', (value) => {
				if (value) {
					UIManager.inst.enableCountdown()
				} else {
					UIManager.inst.disableCountdown()
				}
			})

			this.GameRoom.state.listen('countdown', (value => {
				UIManager.inst.updateCountdown(value)
			}))

			this.GameRoom.state.listen('selectedMap', (value) => {
				UIManager.inst.mapsScrollView.setSelectedMap(value)
			})

			this.GameRoom.state.ballPosition.onChange(() => {
				if (GameManager.inst.game) {
					GameManager.inst.game.moveBall(this.GameRoom.state.ballPosition)
				}
			})

			this.GameRoom.state.players.onAdd((player, key) => {
				UIManager.inst.playersScrollView.addPlayer(player.id, player.username, player.avatarUrl, player.ready)

				player.listen('ready', (value) => {
					UIManager.inst.playersScrollView.updatePlayer(player.id, value)
				})

				player.position.listen('y', (value) => {
					if (GameManager.inst.game) {
						if (this.GameRoom.state.leftPlayer === key) {
							GameManager.inst.game.moveLeftPlayer(value)
						} else if (this.GameRoom.state.rightPlayer === key) {
							GameManager.inst.game.moveRightPlayer(value)
						}
					}
				})

				player.listen('score', (value) => {
					if (GameManager.inst.game) {
						if (this.GameRoom.state.leftPlayer === key) {
							GameManager.inst.game.setLeftPlayerScore(value)
						} else if (this.GameRoom.state.rightPlayer === key) {
							GameManager.inst.game.setRightPlayerScore(value)
						}
					}
				})
			})

			this.GameRoom.state.players.onRemove((player, key) => {
				UIManager.inst.playersScrollView.removePlayer(player.id)
			})
		} catch (error) {
			if (this.GameRoom) {
				this.leaveRoom()
				this.GameRoom = null
			}
			console.error(error)
		}
	}

	createRoom() {
		this.LobbyRoom.send('createRoom')
	}

	leaveRoom() {
		this.LobbyRoom.send('leaveRoom')
	}

	setReady() {
		this.GameRoom.send('setReady')
	}

	acceptInvitation(id: string) {
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
		if (this.LobbyRoom) {
			return this.LobbyRoom.state.players.size
		}
		return -1
	}

	setSelectedMap(id: number) {
		if (this.GameRoom) {
			this.GameRoom.send('setSelectedMap', id)
		}
	}

	getSelectedMap(): number {
		if (this.GameRoom) {
			return this.GameRoom.state.selectedMap
		}
		return -1
	}

	movePaddle(paddleState: PaddleState) {
		this.GameRoom.send('movePaddle', paddleState)
	}
}
