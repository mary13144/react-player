import {useEffect, useRef} from "react";
import {VideoAttributes} from "@/types";
import useUpdate from "@/core/hooks/useUpdate.ts";

const useVideo = (videoEle: HTMLVideoElement) => {

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

	const timer = useRef<NodeJS.Timeout | undefined>()

	const forceUpdate = useUpdate()

	const updateVideoState = <T extends Partial<VideoAttributes>>(val: T) => {
		videoAttributes.current = {...videoAttributes.current, ...val}
		forceUpdate()
	}

	const handleCanPlay = () => {
		updateVideoState({duration: videoEle.duration})
	}
	const handleEnterPicture = () => {
		updateVideoState({isPictureInPicture: true})
	}
	const handleLeavePicture = () => {
		updateVideoState({isPictureInPicture: false})
	}
	const handlePause = () => {
		updateVideoState({isPlay: !videoEle.paused})
	}
	const handlePlay = () => {
		updateVideoState({isPlay: !videoEle.paused})
	}
	const handleEnd = () => {
		updateVideoState({isEnd: videoEle.ended})
	}
	const handleError = () => {
		updateVideoState({error: `播放错误,时间:${Date.now()}`})
	}
	const handleVolumeChange = () => {
		updateVideoState({volume: videoEle.volume})
	}
	const handleRateChange = () => {
		updateVideoState({multiple: videoEle.playbackRate})
	}
	const handleBufferedTime = () => {
		if (videoEle.buffered.length >= 1) {
			updateVideoState({bufferedTime: videoEle.buffered.end(0)})
		}

	}
	const handleWaiting = () => {
		updateVideoState({isWaiting: true})
	}

	const handlePlaying = () => {
		updateVideoState({isWaiting: false, isPlay: !videoEle.paused})
	}

	useEffect(() => {
		if (!videoEle) {
			forceUpdate()
			return
		}
		videoEle.addEventListener('canplay', handleCanPlay)
		videoEle.addEventListener('play', handlePlay)
		videoEle.addEventListener('playing', handlePlaying)
		videoEle.addEventListener('pause', handlePause)
		videoEle.addEventListener('waiting', handleWaiting)
		videoEle.addEventListener('enterpictureinpicture', handleEnterPicture)
		videoEle.addEventListener('leavepictureinpicture', handleLeavePicture)
		videoEle.addEventListener('error', handleError)
		videoEle.addEventListener('volumechange', handleVolumeChange)
		videoEle.addEventListener('progress', handleBufferedTime)
		videoEle.addEventListener('ratechange', handleRateChange)
		videoEle.addEventListener('ended', handleEnd)

		timer.current = setInterval(() => {
			updateVideoState({currentTime: videoEle.currentTime})
		}, 10)
		return () => {
			videoEle.removeEventListener('canplay', handleCanPlay)
			videoEle.removeEventListener('play', handlePlay)
			videoEle.removeEventListener('playing', handlePlaying)
			videoEle.removeEventListener('pause', handlePause)
			videoEle.removeEventListener('waiting', handleWaiting)
			videoEle.removeEventListener('enterpictureinpicture', handleEnterPicture)
			videoEle.removeEventListener('leavepictureinpicture', handleLeavePicture)
			videoEle.removeEventListener('error', handleError)
			videoEle.removeEventListener('volumechange', handleVolumeChange)
			videoEle.removeEventListener('progress', handleBufferedTime)
			videoEle.removeEventListener('ratechange', handleRateChange)
			videoEle.removeEventListener('ended', handleEnd)
			timer && clearTimeout(timer.current)
		}

	}, [videoEle]);

	return videoAttributes.current
}


export default useVideo