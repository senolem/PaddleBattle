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
import { AudioManager } from 'db://assets/Scripts/Managers/AudioManager'
import { EndGameScreenData } from 'db://assets/Scripts/Components/EndGameScreenData'

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
	private authorization: string
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
	}

	async connect() {
		if (!this.LobbyRoom || !this.LobbyRoom.connection.isOpen) {
			try {
				this.LobbyRoom = await this.client.join("LobbyRoom", { accessToken: this.accessToken })

				this.LobbyRoom.onLeave((code) => {
					console.debug("onLeave: ", code)
					if (code != 1000) {
						UIManager.inst.showNetworkError('Connection to the server lost. Do you want to try to reconnect?')
					}
				})

				this.LobbyRoom.onMessage('server_error', (error: string) => {
					console.error(`[LobbyRoom] ${error}`)
					UIManager.inst.showNotification(error)
				})

				this.LobbyRoom.onMessage('setAuthorization', (authorization: string) => {
					this.authorization = authorization
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
					UIManager.inst.playersScrollView.players.forEach((value, key) => {
						value.destroy()
					})
					UIManager.inst.playersScrollView.players.clear()
					console.debug('Left GameRoom')
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

				if ((!this.GameRoom || !this.GameRoom.connection.isOpen) && UIManager.inst.UIState === UIState.RoomMenu) {
					UIManager.inst.switchUIState(UIState.PlayMenu)
				} 

				console.debug(`Successfully joined LobbyRoom (${this.LobbyRoom.id})`)
				console.debug(`Current sessionId : ${this.LobbyRoom.sessionId}`)
				UIManager.inst.showStatus('You are now connected', 'Successfully joined lobby')
			} catch (error) {
				UIManager.inst.showNetworkError('Connection to the server lost. Do you want to try to reconnect?')
				console.error(error)
			}
		} else {
			UIManager.inst.showNotification('Already connected to LobbyRoom')
		}
	}

	async reconnect() {
		if (this.LobbyRoom) {
			if (!this.LobbyRoom.connection.isOpen) {
				await this.connect()
			}
		} else {
			await this.connect()
		}
		if (this.GameRoom) 
			if (!this.GameRoom.connection.isOpen) {
				//await this.connectToGame()
			// we need reconnectToken
		} else {
			//await this.connectToGame()
			// we need reconnectToken
		}
	}

	async connectToGame(reservation: any) {
		try {
			this.GameRoom = await this.client.consumeSeatReservation(reservation)

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

			this.GameRoom.onMessage('loadMenu', () => {
				director.loadScene('Menu', () => {
					UIManager.inst.loadingScreen.hide()
					UIManager.inst.switchUIState(UIState.RoomMenu)
				})
			})

			this.GameRoom.onMessage('loadingScreen', () => {
				UIManager.inst.loadingScreen.show()
				UIManager.inst.loadingScreen.setLoadingInfo('Waiting for server')
			})

			this.GameRoom.onMessage('loadGame', () => {
				director.loadScene('Game', () => {
					this.loadGame()
				})
			})

			this.GameRoom.onMessage('endGame', () => {
				AudioManager.inst.musicSource.stop()
				UIManager.inst.showEndGameScreen()
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

			this.GameRoom.state.players.onAdd((player, key) => {
				UIManager.inst.playersScrollView.addPlayer(player.id, player.username, player.avatarUrl, player.ready)

				player.listen('ready', (value) => {
					UIManager.inst.playersScrollView.updatePlayer(player.id, value)
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

			UIManager.inst.playersScrollView.clearPlayers()
			console.debug(`Successfully joined GameRoom (${this.GameRoom.id})`)
			UIManager.inst.showStatus('You are now connected', 'Successfully joined game')
		} catch (error) {
			if (UIManager.inst.UIState === UIState.RoomMenu) {
				UIManager.inst.switchUIState(UIState.PlayMenu)
			}
			console.error(error)
		}
	}

	loadGame() {
		UIManager.inst.loadingScreen.setLoadingInfo('Initializing game')
		const gameCanvasNode: Node = director.getScene().getChildByName('GameCanvas')
		const gameCanvas: Canvas = gameCanvasNode.getComponent(Canvas)
		gameCanvas.cameraComponent = GameManager.inst.camera
		GameManager.inst.game = gameCanvasNode.getComponent(Game)
		GameManager.inst.keybinds.updateKeybinds()
		UIManager.inst.loadingScreen.setLoadingInfo('Clearing UI')
		UIManager.inst.switchUIState(UIState.None)
		UIManager.inst.notifications.destroyAllChildren()
		UIManager.inst.loadingScreen.setLoadingInfo('Setting UI')
		const selectedMap = GameManager.inst.maps.get(this.GameRoom.state.selectedMap)
		GameManager.inst.game.setBackground(selectedMap.background)
		AudioManager.inst.musicSource.loop = true
		AudioManager.inst.musicSource.clip = selectedMap.music
		const leftPlayer = this.GameRoom.state.players.get(this.GameRoom.state.leftPlayer)
		const rightPlayer = this.GameRoom.state.players.get(this.GameRoom.state.rightPlayer)
		GameManager.inst.game.setLeftPlayer(GameManager.inst.avatarCache.get(leftPlayer.avatarUrl), leftPlayer.username)
		GameManager.inst.game.setRightPlayer(GameManager.inst.avatarCache.get(rightPlayer.avatarUrl), rightPlayer.username)
		GameManager.inst.game.setScores(rightPlayer.score, rightPlayer.score)
		this.GameRoom.send('clientReady')
		UIManager.inst.loadingScreen.setLoadingInfo('Waiting for other players')

		this.GameRoom.onMessage('startGame', () => {
			UIManager.inst.loadingScreen.hide()
			AudioManager.inst.musicSource.play()
			GameManager.inst.game.showHUD()
		})

		this.GameRoom.state.objects.onAdd((object, key) => {
			const worldObject = GameManager.inst.game.instantiateObject(object, key)
		})
		
		this.GameRoom.state.objects.onRemove((object, key) => {
			GameManager.inst.game.destroyObject(key)
		})
	}

	createRoom() {
		if (this.LobbyRoom && this.LobbyRoom.connection.isOpen) {
			this.LobbyRoom.send('createRoom')
		} else {
			UIManager.inst.showNetworkError('Connection to the server lost. Do you want to try to reconnect?')
		}
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
		if (this.LobbyRoom && this.LobbyRoom.connection.isOpen) {
			this.LobbyRoom.send('joinMatchmaking')
		} else {
			UIManager.inst.showNetworkError('Connection to the server lost. Do you want to try to reconnect?')
		}
	}

	leaveMatchmaking() {
		this.LobbyRoom.send('leaveMatchmaking')
	}

	get getOnlineUsers(): number {
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

	get getSelectedMap(): number {
		if (this.GameRoom) {
			return this.GameRoom.state.selectedMap
		}
		return -1
	}

	movePaddle(paddleState: PaddleState) {
		this.GameRoom.send('movePaddle', paddleState)
	}

	getEndGameScreenData(): EndGameScreenData {
		let winner
		const myself: string = this.GameRoom.sessionId
		let title: string
		let result: number = 0
		const leftPlayer = this.GameRoom.state.players.get(this.GameRoom.state.leftPlayer)
		const rightPlayer = this.GameRoom.state.players.get(this.GameRoom.state.rightPlayer)

		if (leftPlayer.score > rightPlayer.score) {
			winner = this.GameRoom.state.leftPlayer
		} else if (leftPlayer.score < rightPlayer.score) {
			winner = this.GameRoom.state.rightPlayer
		} else {
			winner = myself
		}

		if (!winner) {
			winner = myself
			title = 'DRAW'
			result = 0
		} else {
			if (winner === myself) {
				title = 'YOU WON !'
				result = 1
			} else {
				title = 'YOU LOSE !'
				result = 2
			}
		}

		const winnerUser = this.GameRoom.state.players.get(winner)
		const data: EndGameScreenData = {
			username: winnerUser.username,
			avatar: GameManager.inst.avatarCache.get(winnerUser.avatarUrl),
			leftPlayerScore: leftPlayer.score,
			rightPlayerScore: rightPlayer.score,
			title,
			result
		}
		return data
	}

	get getAuthorization(): string {
		return this.authorization	
	}

	get getLobbyRoom(): Colyseus.Room {
		return this.LobbyRoom
	}

	get getGameRoom(): Colyseus.Room {
		return this.GameRoom
	}
}
