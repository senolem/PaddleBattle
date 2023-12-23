import { _decorator, Node, View, ResolutionPolicy, director, Canvas, Button, instantiate, resources, Prefab, Texture2D, ImageAsset, find, SpriteFrame, Label, Camera } from 'cc'
const { ccclass, property } = _decorator
import { UIState } from 'db://assets/Scripts/Enums/UIState'
import { GameManager } from 'db://assets/Scripts/Managers/GameManager'
import { InvitationData } from 'db://assets/Scripts/Components/InvitationData'
import { Invitation } from 'db://assets/Scripts/UI/Invitation/Invitation'
import { Notification } from 'db://assets/Scripts/UI/Notification/Notification'
import { MapsScrollView } from 'db://assets/Scripts/UI/RoomMenu/MapsScrollView'
import { PlayersScrollView } from 'db://assets/Scripts/UI/RoomMenu/PlayersScrollView'
import { LoadingScreen } from 'db://assets/Scripts/UI/LoadingScreen/LoadingScreen'
import { NetworkError } from 'db://assets/Scripts/UI/Notification/NetworkError'
import { EndGameScreen } from 'db://assets/Scripts/UI/EndGameScreen/EndGameScreen'
import { StatusBox } from 'db://assets/Scripts/UI/Notification/StatusBox'
import { PressAnyKeyScreen } from 'db://assets/Scripts/UI/PressAnyKeyScreen/PressAnyKeyScreen'
import { Bind, KeybindCallback } from 'db://assets/Scripts/Components/Keybinds'

const view = View.instance

@ccclass('UIManager')
export class UIManager {
	private static _inst: UIManager
	public static get inst(): UIManager {
		if (this._inst == null) {
			this._inst = new UIManager()
		}
		return this._inst
	}

	public node!: Node
	public canvas: Canvas
	public prefabs: Map<string, Prefab> = new Map<string, Prefab>()
	public UIState: UIState
	public background: Node
	public menu: Node
	public playMenu: Node
	public settingsMenu: Node
	public audioSettingsMenu: Node
	public controlsSettingsMenu: Node
	public roomMenu: Node
	public matchmakingMenu: Node
	public notifications: Node
	public status: Node
	public defaultAvatar: SpriteFrame
	public countdownNode: Node
	public countdownValueNode: Node
	public countdownValueLabel: Label
	public mapsScrollViewNode: Node
	public mapsScrollView: MapsScrollView
	public playersScrollViewNode: Node
	public playersScrollView: PlayersScrollView
	public readyIcon: SpriteFrame
	public notReadyIcon: SpriteFrame
	public loadingScreen: LoadingScreen
	public pressAnyKeyScreen: PressAnyKeyScreen

	constructor() {
		// Create a new UIManager node and add it to the scene
		this.node = new Node()
		this.node.name = 'UIManager'
		director.getScene().addChild(this.node)

		// Make it as a persistent node, so it won't be destroyed when scene changes
		director.addPersistRootNode(this.node)

		// Make the game responsive
		this.makeResponsive()
		window.addEventListener('resize', () => {
			this.makeResponsive()
		})
	}

	loadResources() {
		resources.loadDir("UI", function (err, assets) {
			assets.forEach(function (asset) {
				if (asset instanceof Prefab) {
					UIManager.inst.prefabs.set(asset.name, asset)
				} else if (asset instanceof SpriteFrame) {
					if (asset.name === 'default') {
						UIManager.inst.defaultAvatar = asset
					} else if (asset.name === 'ready') {
						UIManager.inst.readyIcon = asset
					} else if (asset.name === 'notReady') {
						UIManager.inst.notReadyIcon = asset
					}
				}
			})
		})
	}

	switchUIState(state: UIState) {
		this.UIState = state
		this.reactUIState(state)
	}

	// Watch for UIState changes
	reactUIState(value: UIState) {
		this.menu.active = false
		this.playMenu.active = false
		this.settingsMenu.active = false
		this.audioSettingsMenu.active = false
		this.controlsSettingsMenu.active = false
		this.roomMenu.active = false
		this.matchmakingMenu.active = false

		if (value != UIState.None && !this.background.active) {
			this.background.active = true
		}

		switch(value) {
			case UIState.Menu:
			{
				this.menu.active = true
			}
			break

			case UIState.PlayMenu:
			{
				this.playMenu.active = true
			}
			break

			case UIState.SettingsMenu:
			{
				this.settingsMenu.active = true
			}
			break

			case UIState.AudioSettingsMenu:
			{
				this.audioSettingsMenu.active = true
			}
			break

			case UIState.ControlsSettingsMenu:
			{
				this.controlsSettingsMenu.active = true
			}
			break

			case UIState.RoomMenu:
			{
				this.roomMenu.active = true
			}
			break

			case UIState.MatchmakingMenu:
			{
				this.matchmakingMenu.active = true
			}
			break

			case UIState.None:
			{
				this.background.active = false
			}
			break
		}
	}

	makeResponsive(): void {
		const resolutionPolicy = view.getResolutionPolicy()
		const designResolution = view.getDesignResolutionSize()
		const desiredRatio = designResolution.width / designResolution.height
		const deviceRatio = screen.width / screen.height

		if (deviceRatio >= desiredRatio) {
			resolutionPolicy.setContentStrategy(ResolutionPolicy.ContentStrategy.FIXED_HEIGHT)
		}

		if (deviceRatio <= desiredRatio) {
			resolutionPolicy.setContentStrategy(ResolutionPolicy.ContentStrategy.FIXED_WIDTH)
		}

		view.setResolutionPolicy(resolutionPolicy)
	}

	setCanvas(canvas: Canvas) {
		this.canvas = canvas
		GameManager.inst.cameraNode = canvas.node.getChildByName('Camera')
		GameManager.inst.camera = GameManager.inst.cameraNode.getComponent(Camera)
		this.background = canvas.node.getChildByName('Background')
		this.menu = canvas.node.getChildByName('Menu')
		this.playMenu = canvas.node.getChildByName('PlayMenu')
		this.roomMenu = canvas.node.getChildByName('RoomMenu')
		this.settingsMenu = canvas.node.getChildByName('SettingsMenu')
		this.audioSettingsMenu = canvas.node.getChildByName('AudioSettingsMenu')
		this.controlsSettingsMenu = canvas.node.getChildByName('ControlsSettingsMenu')
		this.matchmakingMenu = canvas.node.getChildByName('MatchmakingMenu')
		this.notifications = canvas.node.getChildByName('Notifications')
		this.status = this.notifications.getChildByName('Status')
		this.countdownNode = this.roomMenu.getChildByName('CountdownLayout')
		this.countdownValueNode = find('CountdownValue', this.countdownNode)
		this.countdownValueLabel = this.countdownValueNode.getComponent(Label)
		this.mapsScrollViewNode = find('RoomLayout/RoomLayout/MapsScrollView', this.roomMenu)
		this.mapsScrollView = this.mapsScrollViewNode.getComponent(MapsScrollView)
		this.playersScrollViewNode = find('RoomLayout/RoomPlayersLayout/PlayersScrollView', this.roomMenu)
		this.playersScrollView = this.playersScrollViewNode.getComponent(PlayersScrollView)
		this.loadingScreen = canvas.node.getChildByName('LoadingScreen').getComponent(LoadingScreen)
		this.pressAnyKeyScreen = canvas.node.getChildByName('PressAnyKeyScreen').getComponent(PressAnyKeyScreen)
	}

	showInvitation(invitationData: InvitationData) {
		const invitationNode = instantiate(this.prefabs.get('Invitation'))
		invitationNode.parent = this.notifications

		const invitation = invitationNode.getComponent(Invitation)
		invitation.init(invitationData.id, invitationData.username, invitationData.avatarUrl)
	}

	showNotification(text: string) {
		const notificationNode = instantiate(this.prefabs.get('Notification'))
		notificationNode.parent = this.notifications

		const notification = notificationNode.getComponent(Notification)
		notification.init(text)
	}

	showNetworkError(text: string) {
		const existingError = this.notifications.getChildByName('NetworkError')
		if (existingError) {
			return
		}

		const networkErrorNode = instantiate(this.prefabs.get('NetworkError'))
		networkErrorNode.parent = this.notifications

		const networkError = networkErrorNode.getComponent(NetworkError)
		networkError.init(text)
	}

	showEndGameScreen() {
		const endGameScreenNode = instantiate(this.prefabs.get('EndGameScreen'))
		endGameScreenNode.parent = this.notifications
		const endGame = endGameScreenNode.getComponent(EndGameScreen)
		endGame.init()
	}

	showStatus(title: string, message: string) {
		const statusBoxNode = instantiate(this.prefabs.get('StatusBox'))
		statusBoxNode.parent = this.status

		const statusBox = statusBoxNode.getComponent(StatusBox)
		statusBox.init(title, message)
	}

	enableCountdown() {
		if (!this.countdownNode.active) {
			this.countdownNode.active = true
		}
	}

	disableCountdown() {
		if (this.countdownNode.active) {
			this.countdownNode.active = false
		}
	}

	updateCountdown(countdown: number) {
		this.countdownValueLabel.string = String(countdown)
	}

	showPressAnyKeyScreen(bind: Bind, callback: KeybindCallback) {
		this.pressAnyKeyScreen.show(bind, callback)
	}
}
