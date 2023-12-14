import { _decorator, Node, AudioSource, AudioClip, resources, director } from 'cc'
const { ccclass, property } = _decorator
import { gameStore, reaction } from 'db://assets/Scripts/Store'

@ccclass('AudioManager')
export class AudioManager {
    private static _inst: AudioManager
    public static get inst(): AudioManager {
        if (this._inst == null) {
            this._inst = new AudioManager()
        }
        return this._inst
    }

	private node!: Node
    private _musicSource!: AudioSource
	private _effectsSource!: AudioSource
	private _UISource!: AudioSource
	public UIClips: Map<string, AudioClip> = new Map<string, AudioClip>()

    constructor() {
		// Create a new AudioManager node and add it to the scene
		this.node = new Node()
		this.node.name = 'AudioManager'
		director.getScene().addChild(this.node)

		// Make it as a persistent node, so it won't be destroyed when scene changes
		director.addPersistRootNode(this.node)

		// Create sources components
		this._musicSource = this.node.addComponent(AudioSource)
		this._effectsSource = this.node.addComponent(AudioSource)
		this._UISource = this.node.addComponent(AudioSource)

		reaction(
			() => gameStore.gameSettings.musicVolume,
			(value: number, previousValue: number) => {
				this._musicSource.volume = value
			}
		)

		reaction(
			() => gameStore.gameSettings.effectsVolume,
			(value: number, previousValue: number) => {
				this._effectsSource.volume = value
			}
		)

		reaction(
			() => gameStore.gameSettings.UIVolume,
			(value: number, previousValue: number) => {
				this._UISource.volume = value
			}
		)
	}
	

    public get musicSource() {
        return this._musicSource
    }

	public get effectsSource() {
        return this._effectsSource
    }

	public get UISource() {
        return this._UISource
    }

	/**
	 * Load every AudioClip inside resources/audio
	*/
	loadResources() {
		resources.loadDir("audio", function (err, assets) {
			assets.forEach(function (asset) {
				if (asset instanceof AudioClip) {
					AudioManager.inst.UIClips.set(asset.name, asset)
				}
			})
		})
	}

	getUIClip(name: string) : AudioClip {
		return this.UIClips.get(name)
	}

    /**
     * Play short audio in Effects audio source
     * @param sound clip or url for the audio
     * @param volume 
     */
    playOneShotEffects(sound: AudioClip | string) {
        if (sound instanceof AudioClip) {
            this._effectsSource.playOneShot(sound, gameStore.getEffectsVolume)
        }
        else {
            resources.load(sound, (err, clip: AudioClip) => {
                if (err) {
                    console.log(err)
                }
                else {
                    this._effectsSource.playOneShot(clip, gameStore.getEffectsVolume)
                }
            })
        }
    }

	/**
     * Play short audio in UI audio source
     * @param sound clip or url for the audio
     * @param volume 
     */
    playOneShotUI(sound: AudioClip | string) {
        if (sound instanceof AudioClip) {
            this._effectsSource.playOneShot(sound)
        }
        else {
			const clip = this.getUIClip(sound)
			if (clip) {
				this._effectsSource.playOneShot(clip)
			} else {
				console.error(`Unknown AudioClip '${sound}'`)
			}
        }
    }

    /**
     * Play long audio in Music audio source
     * @param sound clip or url for the sound
     * @param volume 
     */
    play(sound: AudioClip | string) {
        if (sound instanceof AudioClip) {
            this._musicSource.clip = sound
            this._musicSource.play()
        }
        else {
            resources.load(sound, (err, clip: AudioClip) => {
                if (err) {
                    console.log(err)
                }
                else {
                    this._musicSource.clip = clip
                    this._musicSource.play()
                }
            })
        }
    }

    /**
     * Stop the current audio clip in the Music source
     */
    stopMusic() {
        this._musicSource.stop()
    }

    /**
     * Pause the current audio clip in the Music source
     */
    pauseMusic() {
        this._musicSource.pause()
    }

    /**
     * Resume the current audio clip in the Music source
     */
    resumeMusic(){
        this._musicSource.play()
    }

	/**
     * Stop the current audio clip in the Effects source
     */
    stopEffects() {
        this._effectsSource.stop()
    }

    /**
     * Pause the current audio clip in the Effects source
     */
    pauseEffects() {
        this._effectsSource.pause()
    }

    /**
     * Resume the current audio clip in the Effects source
     */
    resumeEffects(){
        this._effectsSource.play()
    }

	/**
     * Stop the current audio clip in the UI source
     */
    stopUI() {
        this._UISource.stop()
    }

    /**
     * Pause the current audio clip in the UI source
     */
    pauseUI() {
        this._UISource.pause()
    }

    /**
     * Resume the current audio clip in the UI source
     */
    resumeUI(){
        this._UISource.play()
    }

	/**
     * Change the Music source volume
     */
    setMusicVolume(volume: number){
        gameStore.setMusicVolume(volume)
    }

	/**
     * Change the Effects source volume
     */
    setEffectsVolume(volume: number){
        gameStore.setEffectsVolume(volume)
    }

	/**
     * Change the UI source volume
     */
    setUIVolume(volume: number){
        gameStore.setUIVolume(volume)
    }
}
