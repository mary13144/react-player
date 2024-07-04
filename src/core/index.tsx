import {VideoAttributes, VideoCallBack, VideoMethod, VideoPlayerOptions} from "@/types";
import {
	forwardRef,
	useImperativeHandle,
	useMemo,
	useRef
} from "react";
import {useVideoState} from "./hooks/useVideoState.ts";
import useVideoCallBack from "./hooks/useVideoCallBack.ts";
import '@/assets/css/reset.scss'
import './index.scss';
import Controller from "./controller";
import {VideoContext, VideoContextType} from "@/core/context";
import useVideo from "@/core/hooks/useVideo.ts";
import useSetSize from "@/core/hooks/useSetSize.ts";

interface VideoProps {
	option: VideoPlayerOptions;
	callback?: Partial<VideoCallBack>;
}

/**
 * @description ref类型
 */
type ReactPlayer = VideoAttributes & VideoMethod & {
	videoElement: HTMLVideoElement
}

export const ReactPlayer = forwardRef<ReactPlayer, VideoProps>((props, ref) => {
	const {
		option,
		callback
	} = props

	const {
		crossOrigin,
		poster,
		className,
		style,
		loop
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

	const {setSize} = useSetSize(videoContainerRef.current!, videoRef.current!, option)

	const {videoAttributes, videoMethod} = useVideo(videoRef.current!, option, callback)
	/**
	 * @description 执行用户回调
	 */
	useVideoCallBack(videoAttributes, videoState, callback)

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
			className={`player-container ${className}`}
		>
			<div className={'lightOffMask'} ref={lightOffMaskRef}></div>
			<video
				onLoadedMetadata={setSize}
				ref={videoRef}
				className={'player'}
				crossOrigin={crossOrigin}
				poster={poster}
				loop={loop}
			>
			</video>
			<VideoContext.Provider value={videoContext}>
				<Controller/>
			</VideoContext.Provider>
		</div>
	)
})