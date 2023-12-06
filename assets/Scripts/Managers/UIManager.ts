import { _decorator, Node, View, ResolutionPolicy, director, Canvas, Button } from 'cc'
const { ccclass, property } = _decorator
import { gameStore, reaction } from 'db://assets/Scripts/Store'
import { UIState } from 'db://assets/Scripts/Enums/UIState'
import { GameManager } from 'db://assets/Scripts/Managers/GameManager'

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

	private canvas: Canvas
	public node!: Node
	public menu: Node
	public playMenu: Node
	public settingsMenu: Node
	public partyMenu: Node
	public matchmakingMenu: Node

	constructor() {
		// Create a new UIManager node and add it to the scene
		this.node = new Node()
		this.node.name = 'UIManager'
		director.getScene().addChild(this.node);

		// Make it as a persistent node, so it won't be destroyed when scene changes
		director.addPersistRootNode(this.node)

		// Make the game responsive
		this.makeResponsive();
		window.addEventListener('resize', () => {
			this.makeResponsive();
		});

		// Watch for UIState changes
		reaction(
			() => GameManager.inst.store.uiState,
			(value: UIState, previousValue: UIState) => {
				this.menu.active = false
				this.playMenu.active = false
				//this.settingsMenu.active = false
				this.partyMenu.active = false
				//this.matchmakingMenu.active = false

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

					//case UIState.SettingsMenu:
					//{
					//	this.settingsMenu.active = true
					//}
					//break

					case UIState.PartyMenu:
					{
						this.partyMenu.active = true
					}
					break

					//case UIState.MatchmakingMenu:
					//{
					//	this.matchmakingMenu.active = true
					//}
					//break
				}
			}
		)
	}

	switchUIState(state: UIState) {
		switch(state) {
			case UIState.Menu:
			{
				GameManager.inst.store.setUIState(UIState.Menu)
			}
			break

			case UIState.PlayMenu:
			{
				GameManager.inst.store.setUIState(UIState.PlayMenu)
			}
			break

			//case UIState.SettingsMenu:
			//{
			//	GameManager.inst.store.setUIState(UIState.SettingsMenu)
			//}
			//break

			case UIState.PartyMenu:
			{
				GameManager.inst.store.setUIState(UIState.PartyMenu)
			}
			break

			//case UIState.MatchmakingMenu:
			//{
			//	GameManager.inst.store.setUIState(UIState.MatchmakingMenu)
			//}
			//break
			
			default:
			{
				console.error('Invalid UI State')
			}
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
		this.menu = canvas.node.getChildByName("Menu");
		this.playMenu = canvas.node.getChildByName("PlayMenu");
		this.partyMenu = canvas.node.getChildByName("PartyMenu");
		this.settingsMenu = canvas.node.getChildByName("SettingsMenu");
		this.matchmakingMenu = canvas.node.getChildByName("MatchmakingMenu");
	}
}


