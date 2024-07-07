import {useEffect, useMemo, useRef} from "react";
import {ParVoid, supportTypes, VideoAttributes, VideoCallBack, VideoMethod, VideoPlayerOptions} from "@/types";
import useUpdate from "@/core/hooks/useUpdate.ts";
import Hls from "hls.js";
import {defaultVolume} from "@/core/config";

const useVideo = (videoEle: HTMLVideoElement, maskEle: HTMLDivElement, option: VideoPlayerOptions, callback?: Partial<VideoCallBack>) => {

	const vRef = useRef<HTMLVideoElement>(videoEle)

	useEffect(() => {
		vRef.current = videoEle // 获取最新对象
	}, [videoEle]);

	const maskRef = useRef<HTMLDivElement>(maskEle)

	useEffect(() => {
		maskRef.current = maskEle // 获取最新对象
	}, [maskEle]);

	const videoAttributes = useRef<VideoAttributes>({
		bufferedTime: 0,
		currentTime: 0,
		duration: 0,
		error: undefined,
		isEnded: false,
		isPictureInPicture: false,
		isPlay: false,
		isWaiting: false,
		multiple: 1.0,
		volume: 0,
		isMute: false
	})

	const timer = useRef<NodeJS.Timeout | undefined>()

	const curHls = useRef<Hls | undefined>()

	const forceUpdate = useUpdate()

	const updateVideoState = <T extends Partial<VideoAttributes>>(val: T) => {
		videoAttributes.current = {...videoAttributes.current, ...val}
		forceUpdate()
	}

	const handleLoadedMetaData = () => {
		updateVideoState({duration: vRef.current?.duration})
	}
	const handleEnterPicture = () => {
		updateVideoState({isPictureInPicture: true})
		callback?.onInPicture?.(videoAttributes.current)
	}
	const handleLeavePicture = () => {
		updateVideoState({isPictureInPicture: false})
		callback?.onLeavePicture?.(videoAttributes.current)
	}
	const handlePause = () => {
		updateVideoState({isPlay: !vRef.current?.paused})
		callback?.onPause?.(videoAttributes.current)
	}
	const handlePlay = () => {
		updateVideoState({isPlay: !vRef.current?.paused})
		callback?.onPlay?.(videoAttributes.current)
	}
	const handleEnd = () => {
		updateVideoState({isEnded: vRef.current?.ended})
		callback?.onEnded?.(videoAttributes.current)
	}
	const handleError = () => {
		updateVideoState({error: `播放错误,时间:${Date.now()}`})
		callback?.onError?.()
	}
	const handleVolumeChange = () => {
		updateVideoState({volume: vRef.current?.volume, isMute: vRef.current?.muted})
		callback?.onVolumeChange?.(videoAttributes.current)
	}
	const handleRateChange = () => {
		updateVideoState({multiple: vRef.current?.playbackRate})
		callback?.onRateChange?.(videoAttributes.current)
	}
	const handleBufferedTime = () => {
		if (videoEle.buffered.length >= 1) {
			updateVideoState({bufferedTime: vRef.current?.buffered.end(vRef.current?.buffered.length - 1)})
		}
	}
	const handleWaiting = () => {
		updateVideoState({isWaiting: true})
		callback?.onWaiting?.(videoAttributes.current)
	}

	const handlePlaying = () => {
		updateVideoState({isWaiting: false, isPlay: !vRef.current?.paused})
	}

	const videoInit = (videoELe: HTMLVideoElement) => {
		if (!videoELe) {
			return
		}
		videoELe.addEventListener('loadedmetadata', handleLoadedMetaData)
		videoELe.addEventListener('play', handlePlay)
		videoELe.addEventListener('playing', handlePlaying)
		videoELe.addEventListener('pause', handlePause)
		videoELe.addEventListener('waiting', handleWaiting)
		videoELe.addEventListener('enterpictureinpicture', handleEnterPicture)
		videoELe.addEventListener('leavepictureinpicture', handleLeavePicture)
		videoELe.addEventListener('error', handleError)
		videoELe.addEventListener('volumechange', handleVolumeChange)
		videoELe.addEventListener('progress', handleBufferedTime)
		videoELe.addEventListener('ratechange', handleRateChange)
		videoELe.addEventListener('ended', handleEnd)
	}

	const videoUnmount = (videoELe: HTMLVideoElement) => {
		if (!videoELe) {
			return
		}
		videoELe.removeEventListener('loadedmetadata', handleLoadedMetaData)
		videoELe.removeEventListener('play', handlePlay)
		videoELe.removeEventListener('playing', handlePlaying)
		videoELe.removeEventListener('pause', handlePause)
		videoELe.removeEventListener('waiting', handleWaiting)
		videoELe.removeEventListener('enterpictureinpicture', handleEnterPicture)
		videoELe.removeEventListener('leavepictureinpicture', handleLeavePicture)
		videoELe.removeEventListener('error', handleError)
		videoELe.removeEventListener('volumechange', handleVolumeChange)
		videoELe.removeEventListener('progress', handleBufferedTime)
		videoELe.removeEventListener('ratechange', handleRateChange)
		videoELe.removeEventListener('ended', handleEnd)
	}


	/**
	 * @description 视频方法
	 */

	const setVolume: ParVoid<number> = (val) => {
		if (vRef.current) {
			vRef.current.volume = val <= 1 ? val : val / 100;
			localStorage.setItem('volume', vRef.current.volume.toString())
		}
	}

	const handleChangePlayState = () => {
		if (videoAttributes.current.isPlay) {
			vRef.current?.pause()
		} else {
			vRef.current?.play()
		}
	}

	const videoMethod = useMemo<VideoMethod>(() => {
		return {
			load: () => vRef.current?.load(),
			play: () => vRef.current?.play(),
			pause: () => vRef.current?.pause(),
			setVolume: setVolume,
			seek: (currentTime) => {
				if (vRef.current) {
					vRef.current.currentTime = currentTime;
				}
			},
			setVideoSrc: (src) => {
				if (vRef.current) {
					vRef.current.src = src
				}
			},
			setPlayRate: (rate: number) => {
				if (vRef.current) {
					vRef.current.playbackRate = rate
					localStorage.setItem('playRate', rate.toString())
				}
			},
			setMuted: (flag: boolean) => {
				if (vRef.current) {
					vRef.current.muted = flag
				}
			},
			changePlayState: handleChangePlayState
		}
	}, [vRef.current])

	/**
	 * @description hls视频加载
	 */
	const setHls = (videoEle: HTMLVideoElement, src: string) => {
		if (Hls.isSupported()) {
			if (curHls.current) {
				curHls.current?.detachMedia()
				curHls.current?.loadSource(src)
				curHls.current?.attachMedia(videoEle)
			} else {
				const hls = new Hls()
				hls.loadSource(src)
				hls.attachMedia(videoEle)
				curHls.current = hls
			}
		}
	}


	/**
	 * @description 通过url检测视频是否是hls格式，需要cors支持
	 * @param url 视频url
	 */
	const checkHls = async (url: string) => {
		// 通过文件后缀名判断
		if (url.toLowerCase().trim().endsWith('.m3u8')) {
			return true;
		}
		// 发送http请求判断,检查响应的内容类型
		try {
			const response = await fetch(url, {method: 'HEAD'});
			const contentTypes = response.headers.get('Content-Type')
				?.toLowerCase().split(';')
				.map(item => item.trim());
			contentTypes?.find(item => {
				// HLS流的播放列表文件（.m3u8）通常会被服务器设置为特定的MIME类型，
				// 即application/vnd.apple.mpegurl或application/x-mpegURL。
				// 这些MIME类型是标准的，可以直接通过HTTP头部进行检查。
				if (item.includes('application/vnd.apple.mpegurl') || item.includes('application/vnd.apple.mpegurl')) {
					return true
				}
			})
			// HLS流的播放列表文件（通常是.m3u8文件）包含特定的标签，如#EXTM3U和#EXT-X-STREAM-INF，这些标签是HLS流的标志。
			const content = await response.text();
			return content.includes('#EXTM3U') && content.includes('#EXT-X-STREAM-INF');
		} catch (error) {
			console.error(`请求错误: ${error}`);
			return false;
		}
	}

	/**
	 * @description 加载url
	 * @param videoEle 视频对象
	 * @param url
	 */
	const loadSrc = (videoEle: HTMLVideoElement, url: string) => {
		supportTypes.forEach(item => {
			const source = document.createElement('source')
			source.type = item
			source.src = url
			videoEle.appendChild(source)
		})
	}

	/**
	 * @description 加载视频
	 * @param videoEle
	 * @param url
	 */
	const loadVideo = async (videoEle: HTMLVideoElement, url: string) => {
		loadSrc(videoEle, url)
		let flag = false
		if (option.crossOrigin) {
			flag = await checkHls(url)
		}
		if (option.videoType === 'hls') {
			flag = true
		}
		if (flag) {
			setHls(videoEle, url)
		}
	}

	/**
	 * @description 加载localstorage中的配置，防止刷新重置
	 */
	const loadOptions = (videoELe: HTMLVideoElement, videoMaskEle: HTMLDivElement) => {
		const curVolume = localStorage.getItem('volume')
		const curLight = localStorage.getItem('light')
		const curLoop = localStorage.getItem('loop')
		const curRate = localStorage.getItem('playRate')
		if (curVolume) {
			videoELe.volume = parseFloat(curVolume)
		} else {
			videoELe.volume = defaultVolume / 100
		}
		if (curLight) {
			videoMaskEle.style.display = curLight
		}
		if (curLoop) {
			videoELe.loop = curLoop === 'true'
		}
		if (curRate) {
			videoELe.playbackRate = parseFloat(curRate)
		}
	}

	useEffect(() => {
		if (!vRef.current || !maskRef.current) {
			forceUpdate()
			return
		}
		videoInit(vRef.current)
		timer.current = setInterval(() => {
			updateVideoState({currentTime: vRef.current.currentTime})
		}, 10)
		loadOptions(vRef.current, maskRef.current)
		return () => {
			videoUnmount(vRef.current)
			timer && clearTimeout(timer.current)
		}
	}, [vRef.current]);

	return {
		videoAttributes: videoAttributes.current,
		videoMethod,
		loadVideo,
	}
}


export default useVideo