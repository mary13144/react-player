import {ParVoid, VideoAttributes, VideoCallBack, VideoMethod, VideoPlayerOptions} from "@/types";
import {
	CSSProperties,
	forwardRef, SyntheticEvent,
	useCallback, useEffect,
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
import useVideo from "@/core/hooks/useVideo.ts";
import {defaultVolume} from "@/core/config";
import useIsMobile from "@/core/hooks/useIsMobile.ts";

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
		onPlay,
		onPause,
		onEnded,
		onError,
		onQualityChange,
		onVolumeChange,
		onInPicture,
		onLeavePicture,
		onRateChange,
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
	const isMobile = useIsMobile()
	const setVideoWH = (e: SyntheticEvent<HTMLVideoElement, Event>) => {
		const target = e.target as HTMLVideoElement
		const videoWidth = target.videoWidth;
		const videoHeight = target.videoHeight;
		if (videoContainerRef.current) {
			let scaleH;
			let scaleW;

			// 移动端适配逻辑
			if (isMobile) {
				const windowWidth = window.innerWidth;
				const windowHeight = window.innerHeight;

				if (videoWidth > windowWidth) {
					scaleW = windowWidth;
					scaleH = (windowWidth * videoHeight) / videoWidth;
				} else if (videoHeight > windowHeight) {
					scaleH = windowHeight;
					scaleW = (windowHeight * videoWidth) / videoHeight;
				} else {
					scaleW = videoWidth
					scaleH = videoHeight
				}

			} else {
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
			}

			videoContainerRef.current.style.width = `${scaleW}px`
			videoContainerRef.current.style.height = `${scaleH}px`
		}
	}

	useEffect(() => {

	}, [isMobile]);

	/**
	 * @description 设置hls
	 */
	const setHls = useCallback(() => {
		const src = videoSrc ?
			videoSrc :
			qualityConfig?.qualityList.find(item => item.key === qualityConfig?.currentKey)?.url;
		if (videoRef.current && videoType === 'hls') {
			if (Hls.isSupported()) {
				const hls = new Hls()
				if (src) {
					hls.loadSource(src)
					hls.attachMedia(videoRef.current)
				}
			}
		}
	}, [videoType])

	/**
	 * @description 视频资源
	 */
	const VideoSource = useMemo(() => {
		const src = videoSrc ?
			videoSrc :
			qualityConfig?.qualityList.find(item => item.key === qualityConfig?.currentKey)?.url;
		return (
			<>
				<source src={src} type='video/mp4'/>
				<source src={src} type='video/ogg'/>
				<source src={src} type='video/webm'/>
			</>
		)
	}, [videoSrc, JSON.stringify(qualityConfig)])

	const setVolume: ParVoid<number> = (val) => {
		videoRef.current!.volume = val <= 1 ? val : val / 100;
	}

	const handleChangePlayState = () => {
		if (videoAttributes.isPlay) {
			videoRef.current?.pause()
		} else {
			videoRef.current?.play()
		}
	}

	const videoAttributes = useVideo(videoRef.current!)

	/**
	 * @description 执行用户回调
	 */
	useVideoCallBack(videoAttributes, videoState, {
		onIsControl,
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
	useEffect(() => {
		setHls()
		videoMethod.setVolume(defaultVolume)
		const handleEnterPicture = () => {
			onInPicture?.(videoAttributes)
		}
		const handleLeavePicture = () => {
			onLeavePicture?.(videoAttributes)
		}

		videoRef.current?.addEventListener('enterpictureinpicture', handleEnterPicture)
		videoRef.current?.addEventListener('leavepictureinpicture', handleLeavePicture)

		if (videoRef.current && autoPlay) {
			!isMobile && videoMethod.setMuted(true)
			videoMethod.play()
		}

		return () => {
			videoRef.current?.removeEventListener('enterpictureinpicture', handleEnterPicture)
			videoRef.current?.removeEventListener('leavepictureinpicture', handleLeavePicture)
		}
	}, [videoType]);

	const videoContext: VideoContextType = useMemo(() => {
		return {
			videoELe: videoRef.current!,
			videoContainerEle: videoContainerRef.current!,
			lightOffMaskEle: lightOffMaskRef.current!,
			videoOption: option,
			videoAttributes: videoAttributes,
			videoMethod: videoMethod,
			videoState: videoState,
			dispatch,
			handleChangePlayState
		}
	}, [videoAttributes, JSON.stringify(option), videoState])

	useImperativeHandle(ref, () => ({
		videoElement: videoRef.current!,
		...videoAttributes,
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
				onCanPlay={setVideoWH}
				onPlay={() => onPlay?.(videoAttributes)}
				onPause={() => onPause?.(videoAttributes)}
				onEnded={() => onEnded?.(videoAttributes)}
				onError={() => onError?.()}
				onVolumeChange={() => onVolumeChange?.(videoAttributes)}
				onRateChange={() => onRateChange?.(videoAttributes)}
				ref={videoRef}
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