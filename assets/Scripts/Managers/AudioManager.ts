import { _decorator, Node, AudioSource, AudioClip, resources, director, game, Game, sys } from 'cc'
import { GameManager } from 'db://assets/Scripts/Managers/GameManager'
const { ccclass, property } = _decorator

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
	public clips: Map<string, AudioClip> = new Map<string, AudioClip>()


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

		this._musicSource.playOnAwake = false
		this._effectsSource.playOnAwake = false
		this._UISource.playOnAwake = false

		this._musicSource.volume = this.getMusicVolume
		this._effectsSource.volume = this.getEffectsVolume
		this._UISource.volume = this.getUIVolume

		this._musicSource.loop = true
		this._effectsSource.loop = false
		this._UISource.loop = false
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
	loadResources(): Promise<void> {
		return new Promise((resolve, reject) => {
			resources.loadDir("audio", function (err, assets) {
				if (err) {
					reject(err)
					return
				}

				assets.forEach(function (asset) {
					if (asset instanceof AudioClip) {
						AudioManager.inst.clips.set(asset.name, asset)
					}
				})

				resolve()
			})
		})
	}

	getClip(name: string) : AudioClip {
		return this.clips.get(name)
	}

    /**
     * Play short audio in Effects audio source
     * @param sound clip or url for the audio
     * @param volume 
     */
    playOneShotEffects(sound: AudioClip | string) {
        if (sound instanceof AudioClip) {
            this._effectsSource.playOneShot(sound, 1)
        }
        else {
			const clip = this.getClip(sound)
			if (clip) {
				this._effectsSource.playOneShot(clip)
			} else {
				console.error(`Unknown AudioClip '${sound}'`)
			}
        }
    }

	/**
     * Play short audio in UI audio source
     * @param sound clip or url for the audio
     * @param volume 
     */
    playOneShotUI(sound: AudioClip | string) {
        if (sound instanceof AudioClip) {
            this._UISource.playOneShot(sound, 1)
        }
        else {
			const clip = this.getClip(sound)
			if (clip) {
				this._UISource.playOneShot(clip)
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
			const clip = this.getClip(sound)
			if (clip) {
				this._musicSource.clip = clip
            	this._musicSource.play()
			} else {
				console.error(`Unknown AudioClip '${sound}'`)
			}
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
        sys.localStorage.setItem('musicVolume', volume)
		this._musicSource.volume = volume
    }

	/**
     * Change the Effects source volume
     */
    setEffectsVolume(volume: number){
		sys.localStorage.setItem('effectsVolume', volume)
		this._effectsSource.volume = volume
    }

	/**
     * Change the UI source volume
     */
    setUIVolume(volume: number){
		sys.localStorage.setItem('UIVolume', volume)
		this._UISource.volume = volume
    }

	/**
     * Change the Music source volume
     */
	public get getMusicVolume() {
		let volume = sys.localStorage.getItem('musicVolume')
		if (volume === undefined) {
			volume = 0.75
			sys.localStorage.setItem('musicVolume', volume)
			this._musicSource.volume = volume
		}
		return volume
	}

	/**
     * Change the Effects source volume
     */
    public get getEffectsVolume() {
		let volume = sys.localStorage.getItem('effectsVolume')
		if (volume === undefined) {
			volume = 0.50
			sys.localStorage.setItem('effectsVolume', volume)
			this._effectsSource.volume = volume
		}
		return volume
	}

	/**
     * Change the UI source volume
     */
    public get getUIVolume() {
		let volume = sys.localStorage.getItem('UIVolume')
		if (volume === undefined) {
			volume = 0.60
			sys.localStorage.setItem('UIVolume', volume)
			this._musicSource.volume = volume
		}
		return volume
	}
}
