import {ParVoid, VideoAttributes, VideoCallBack, VideoMethod, VideoPlayerOptions} from "@/types";
import {
	CSSProperties,
	forwardRef, SyntheticEvent,
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef
} from "react";
import {useVideoState} from "./hooks/useVideoState.ts";
import useVideoCallBack from "./hooks/useVideoCallBack.ts";
import Hls from "hls.js";
import '@/assets/reset.scss'
import styles from './index.module.scss';
import Controller from "./controller";
import {VideoContext, VideoContextType} from "@/core/context";
import useUpdate from "@/core/hooks/useUpdate.ts";
import {defaultVolume} from "@/core/config";


interface videoProps extends Partial<VideoCallBack> {
	option: VideoPlayerOptions;
	style?: CSSProperties;
	className?: string;
}

/**
 * @description ref类型
 */
type ReactPlayer = VideoAttributes & VideoMethod & {
	videoElement: HTMLVideoElement
}

export const ReactPlayer = forwardRef<ReactPlayer, videoProps>((props, ref) => {
	const {
		option,
		className,
		style,
		onProgressMouseDown,
		onProgressMouseUp,
		onPlay,
		onPause,
		onEnd,
		onError,
		onQualityChange,
		onTimeChange,
		onVolumeChange,
		onInPicture,
		onLeavePicture,
		onMultiple,
		onIsControl,
	} = props

	const {
		videoSrc,
		videoType,
		width,
		height,
		autoPlay,
		mode,
		qualityConfig,
		crossOrigin,
		poster,
	} = option


	/**
	 * @description 视频容器对象
	 */
	const videoContainerRef = useRef<HTMLDivElement>(null)
	/**
	 * @description 视频对象
	 */
	const videoRef = useRef<HTMLVideoElement>(null)
	/**
	 * @description 关灯对象
	 */
	const lightOffMaskRef = useRef<HTMLDivElement>(null)

	// video控件属性和方法
	const {videoState, dispatch} = useVideoState()

	/**
	 * @description 设置播放器容器大小
	 * @param e
	 */
	const setVideoWH = (e: SyntheticEvent<HTMLVideoElement, Event>) => {
		const target = e.target as HTMLVideoElement
		const videoWidth = target.videoWidth;
		const videoHeight = target.videoHeight;
		if (videoContainerRef.current) {
			let scaleH;
			let scaleW;

			if (width && height) {
				scaleH = height;
				scaleW = width;
			} else {
				if (mode === 'widthFix' && width) {
					scaleH = (width * videoHeight) / videoWidth;
					scaleW = width
				} else if (mode === 'heightFix' && height) {
					scaleH = height
					scaleW = (height * videoWidth) / videoHeight
				} else {
					scaleH = height ? height : videoHeight;
					scaleW = width ? width : videoWidth;
				}
			}
			videoContainerRef.current.style.width = `${scaleW}px`
			videoContainerRef.current.style.height = `${scaleH}px`
		}
	}

	/**
	 * @description 设置hls
	 */
	const setHls = useCallback(() => {
		if (videoRef.current && videoType === 'hls') {
			if (Hls.isSupported()) {
				const hls = new Hls()

				// hls.loadSource(videoSrc)
				hls.attachMedia(videoRef.current)
			}
		}
	}, [videoType])

	/**
	 * @description 视频资源
	 */
	const VideoSource = useMemo(() => {
		let src;
		if (videoSrc) {
			src = videoSrc
		} else {
			src = qualityConfig?.qualityList.find(item => {
				return item.key === qualityConfig?.currentKey;
			})?.url
		}
		return (
			<>
				<source src={src} type='video/mp4'/>
				<source src={src} type='video/ogg'/>
				<source src={src} type='video/webm'/>
			</>
		)
	}, [videoSrc, JSON.stringify(qualityConfig)])


	/**
	 * @description 视频属性
	 */
	const videoAttributes = useRef<VideoAttributes>({
		bufferedTime: 0,
		currentTime: 0,
		duration: 0,
		error: undefined,
		isEnd: false,
		isPictureInPicture: false,
		isPlay: false,
		isWaiting: false,
		multiple: 1.0,
		volume: 0
	})
	const forceUpdate = useUpdate()
	const updateVideoState = <T extends Partial<VideoAttributes>>(val: T) => {
		videoAttributes.current = {...videoAttributes.current, ...val}
		forceUpdate()
	}
	const setVolume: ParVoid<number> = (val) => {
		videoRef.current!.volume = val <= 1 ? val : val / 100;
	}
	const handleChangePlayState = () => {
		if (videoAttributes.current.isPlay) {
			videoRef.current?.pause()
		} else {
			videoRef.current?.play()
		}
	}
	const handleCanPlay = (e: SyntheticEvent<HTMLVideoElement, Event>) => {
		updateVideoState({duration: videoRef.current?.duration})
		setVideoWH(e)
	}
	const handleEnterPicture = () => {
		updateVideoState({isPictureInPicture: true})
		onInPicture?.(videoAttributes.current)
	}
	const handleLeavePicture = () => {
		updateVideoState({isPictureInPicture: false})
		onLeavePicture?.(videoAttributes.current)
	}
	const handlePause = () => {
		updateVideoState({isPlay: !videoRef.current?.paused})
		onPause?.(videoAttributes.current)
	}
	const handlePlay = () => {
		updateVideoState({isPlay: !videoRef.current?.paused})
		onPlay?.(videoAttributes.current)
	}
	const handleEnd = () => {
		updateVideoState({isEnd: videoRef.current?.ended})
		onEnd?.(videoAttributes.current)
	}
	const handleError = () => {
		updateVideoState({error: `播放错误,时间:${Date.now()}`})
		onError?.()
	}
	const handleVolumeChange = () => {
		updateVideoState({volume: videoRef.current?.volume})
		onVolumeChange?.(videoAttributes.current)
	}
	const handleRateChange = () => {
		updateVideoState({multiple: videoRef.current?.playbackRate})
	}
	const handleBufferedTime = () => {
		if (videoRef.current!.buffered.length >= 1) {
			updateVideoState({bufferedTime: videoRef.current?.buffered.end(0)})
		}

	}
	const handleCurrentTime = () => {
		onTimeChange?.(videoAttributes.current)
	}
	const handleWaiting = () => {
		updateVideoState({isWaiting: true})
	}
	const handlePlaying = () => {
		updateVideoState({isWaiting: false})
	}

	/**
	 * @description 执行用户回调
	 */
	useVideoCallBack(videoAttributes.current, videoState, {
		onIsControl,
		onMultiple,
		onProgressMouseDown,
		onProgressMouseUp,
		onQualityChange,
	})

	/**
	 * @description 视频方法
	 */
	const videoMethod = useMemo<VideoMethod>(() => {
		return {
			load: () => videoRef.current?.load(),
			play: () => videoRef.current?.play(),
			pause: () => videoRef.current?.pause(),
			setVolume: setVolume,
			seek: (currentTime) => {
				videoRef.current!.currentTime = currentTime;
			},
			setVideoSrc: (src) => {
				videoRef.current!.src = src
			},
			setPlayRate: (rate: number) => {
				videoRef.current!.playbackRate = rate
			},
			setMuted: (flag: boolean) => {
				videoRef.current!.muted = flag
			}
		}
	}, [])

	// 视频初始化
	const timer = useRef<NodeJS.Timeout | undefined>()
	useEffect(() => {
		setHls()
		setVolume(defaultVolume)
		/**
		 * @description 监听是否进入画中画
		 */
		videoRef.current?.addEventListener('enterpictureinpicture', handleEnterPicture)
		/**
		 * @description 监听是否离开画中画
		 */
		videoRef.current?.addEventListener('leavepictureinpicture', handleLeavePicture)

		timer.current = setInterval(() => {
			updateVideoState({currentTime: videoRef.current?.currentTime})
		}, 10)
		return () => {
			videoRef.current?.removeEventListener('enterpictureinpicture', handleEnterPicture);
			videoRef.current?.removeEventListener('leavepictureinpicture', handleLeavePicture);
			timer.current && clearInterval(timer.current)
		}
	}, [videoType]);

	const videoContext: VideoContextType = useMemo(() => {
		return {
			videoELe: videoRef.current!,
			videoContainerEle: videoContainerRef.current!,
			lightOffMaskEle: lightOffMaskRef.current!,
			videoOption: option,
			videoAttributes: videoAttributes.current,
			videoMethod: videoMethod,
			videoState: videoState,
			dispatch,
			handleChangePlayState
		}
	}, [videoAttributes.current, JSON.stringify(option), videoState])

	useImperativeHandle(ref, () => ({
		videoElement: videoRef.current!,
		...videoAttributes.current,
		...videoMethod
	}))

	return (
		<div
			ref={videoContainerRef}
			id={'video-container'}
			style={style}
			className={`${styles.playerContainer} ${className}`}
		>
			<div className={styles.lightOffMask} ref={lightOffMaskRef}></div>
			<video
				onCanPlay={handleCanPlay}
				onProgress={handleBufferedTime}
				onTimeUpdate={handleCurrentTime}
				onPause={handlePause}
				onPlay={handlePlay}
				onError={handleError}
				onVolumeChange={handleVolumeChange}
				onEnded={handleEnd}
				onRateChange={handleRateChange}
				onPlaying={handlePlaying}
				onWaiting={handleWaiting}
				ref={videoRef}
				autoPlay={autoPlay}
				className={styles.player}
				crossOrigin={crossOrigin}
				poster={poster}
			>
				{VideoSource}
			</video>
			<VideoContext.Provider value={videoContext}>
				<Controller/>
			</VideoContext.Provider>
		</div>
	)
})