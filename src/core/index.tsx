import {
    ParVoid,
    VideoAttributes,
    VideoCallBack,
    VideoMethod,
    VideoPlayerOptions,
} from '@/types';
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
} from 'react';
import { useVideoState } from './hooks/useVideoState.ts';
import useVideoCallBack from './hooks/useVideoCallBack.ts';
import '@/assets/css/reset.scss';
import './index.scss';
import Controller from './controller';
import { VideoContext, VideoContextType } from '@/core/context';
import useVideo from '@/core/hooks/useVideo.ts';
import useSetSize from '@/core/hooks/useSetSize.ts';
import 'virtual:svg-icons-register';
import useUpdate from '@/core/hooks/useUpdate.ts';

export interface VideoProps {
    option: VideoPlayerOptions;
    callback?: Partial<VideoCallBack>;
}

/**
 * @description ref类型
 */
export type ReactPlayerType = VideoAttributes &
    VideoMethod & {
        videoElement: HTMLVideoElement;
    };

const ReactPlayer = forwardRef<ReactPlayerType, VideoProps>((props, ref) => {
    const { option, callback } = props;

    const { crossOrigin, poster, className, style, loop } = option;

    /**
     * @description 视频容器对象
     */
    const videoContainerRef = useRef<HTMLDivElement>(null);
    /**
     * @description 视频对象
     */
    const videoRef = useRef<HTMLVideoElement>(null);
    /**
     * @description 关灯对象
     */
    const lightOffMaskRef = useRef<HTMLDivElement>(null);

    // video控件属性和方法
    const { videoState, dispatch } = useVideoState();

    const { setSize } = useSetSize(
        videoContainerRef.current!,
        videoRef.current!,
        option,
    );

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
        isMute: false,
    });

    const timer = useRef<NodeJS.Timeout | undefined>();

    const forceUpdate = useUpdate();

    const updateVideoState = <T extends Partial<VideoAttributes>>(val: T) => {
        videoAttributes.current = { ...videoAttributes.current, ...val };
        forceUpdate();
    };

    const handleLoadedMetaData = () => {
        updateVideoState({ duration: videoRef.current?.duration });
    };
    const handleEnterPicture = () => {
        updateVideoState({ isPictureInPicture: true });
        callback?.onInPicture?.(videoAttributes.current);
    };
    const handleLeavePicture = () => {
        updateVideoState({ isPictureInPicture: false });
        callback?.onLeavePicture?.(videoAttributes.current);
    };
    const handlePause = () => {
        updateVideoState({ isPlay: !videoRef.current?.paused });
        callback?.onPause?.(videoAttributes.current);
    };
    const handlePlay = () => {
        updateVideoState({ isPlay: !videoRef.current?.paused });
        callback?.onPlay?.(videoAttributes.current);
    };
    const handleEnd = () => {
        updateVideoState({ isEnded: videoRef.current?.ended });
        callback?.onEnded?.(videoAttributes.current);
    };
    const handleError = () => {
        updateVideoState({ error: `播放错误,时间:${Date.now()}` });
        callback?.onError?.();
    };
    const handleVolumeChange = () => {
        updateVideoState({
            volume: videoRef.current?.volume,
            isMute: videoRef.current?.muted,
        });
        callback?.onVolumeChange?.(videoAttributes.current);
    };
    const handleRateChange = () => {
        updateVideoState({ multiple: videoRef.current?.playbackRate });
        callback?.onRateChange?.(videoAttributes.current);
    };
    const handleBufferedTime = () => {
        if (videoRef.current!.buffered.length >= 1) {
            updateVideoState({
                bufferedTime: videoRef.current?.buffered.end(
                    videoRef.current?.buffered.length - 1,
                ),
            });
        }
    };
    const handleWaiting = () => {
        updateVideoState({ isWaiting: true });
        callback?.onWaiting?.(videoAttributes.current);
    };
    const handlePlaying = () => {
        updateVideoState({
            isWaiting: false,
            isPlay: !videoRef.current?.paused,
        });
    };
    const videoInit = (videoELe: HTMLVideoElement) => {
        if (!videoELe) {
            return;
        }
        videoELe.addEventListener('loadedmetadata', handleLoadedMetaData);
        videoELe.addEventListener('play', handlePlay);
        videoELe.addEventListener('playing', handlePlaying);
        videoELe.addEventListener('pause', handlePause);
        videoELe.addEventListener('waiting', handleWaiting);
        videoELe.addEventListener('enterpictureinpicture', handleEnterPicture);
        videoELe.addEventListener('leavepictureinpicture', handleLeavePicture);
        videoELe.addEventListener('error', handleError);
        videoELe.addEventListener('volumechange', handleVolumeChange);
        videoELe.addEventListener('progress', handleBufferedTime);
        videoELe.addEventListener('ratechange', handleRateChange);
        videoELe.addEventListener('ended', handleEnd);
    };
    const videoUnmount = (videoELe: HTMLVideoElement) => {
        if (!videoELe) {
            return;
        }
        videoELe.removeEventListener('loadedmetadata', handleLoadedMetaData);
        videoELe.removeEventListener('play', handlePlay);
        videoELe.removeEventListener('playing', handlePlaying);
        videoELe.removeEventListener('pause', handlePause);
        videoELe.removeEventListener('waiting', handleWaiting);
        videoELe.removeEventListener(
            'enterpictureinpicture',
            handleEnterPicture,
        );
        videoELe.removeEventListener(
            'leavepictureinpicture',
            handleLeavePicture,
        );
        videoELe.removeEventListener('error', handleError);
        videoELe.removeEventListener('volumechange', handleVolumeChange);
        videoELe.removeEventListener('progress', handleBufferedTime);
        videoELe.removeEventListener('ratechange', handleRateChange);
        videoELe.removeEventListener('ended', handleEnd);
    };

    const setVolume: ParVoid<number> = (val) => {
        if (videoRef.current) {
            videoRef.current.volume = val <= 1 ? val : val / 100;
            localStorage.setItem('volume', videoRef.current.volume.toString());
        }
    };

    const handleChangePlayState = () => {
        if (videoAttributes.current.isPlay) {
            videoRef.current?.pause();
        } else {
            videoRef.current?.play();
        }
    };

    const videoMethod = useMemo<VideoMethod>(() => {
        return {
            load: () => videoRef.current?.load(),
            play: () => videoRef.current?.play(),
            pause: () => videoRef.current?.pause(),
            setVolume: setVolume,
            seek: (currentTime) => {
                if (videoRef.current) {
                    videoRef.current.currentTime = currentTime;
                }
            },
            setVideoSrc: (src) => {
                if (videoRef.current) {
                    videoRef.current.src = src;
                }
            },
            setPlayRate: (rate: number) => {
                if (videoRef.current) {
                    videoRef.current.playbackRate = rate;
                    localStorage.setItem('playRate', rate.toString());
                }
            },
            setMuted: (flag: boolean) => {
                if (videoRef.current) {
                    videoRef.current.muted = flag;
                }
            },
            changePlayState: handleChangePlayState,
        };
    }, [videoRef.current]);

    const { loadVideo, loadOptions } = useVideo(option);
    /**
     * @description 执行用户回调
     */
    useVideoCallBack(videoAttributes.current, videoState, callback);

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
        };
    }, [videoAttributes, option, videoState]);

    useEffect(() => {
        if (!videoRef.current || !lightOffMaskRef.current) {
            forceUpdate();
            return;
        }
        videoInit(videoRef.current);
        timer.current = setInterval(() => {
            updateVideoState({ currentTime: videoRef.current?.currentTime });
        }, 10);
        loadOptions(videoRef.current, lightOffMaskRef.current);
        const src = option.videoSrc
            ? option.videoSrc
            : option.qualityConfig?.qualityList.find((item) => {
                  return item.key === option.qualityConfig?.currentKey;
              })?.url;
        if (!src) return;
        loadVideo(videoRef.current, src);
        return () => {
            videoUnmount(videoRef.current!);
            timer && clearTimeout(timer.current);
        };
    }, [option, callback, videoRef.current, lightOffMaskRef.current]);

    useImperativeHandle(ref, () => ({
        videoElement: videoRef.current!,
        ...videoAttributes.current,
        ...videoMethod,
    }));

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
            ></video>
            <VideoContext.Provider value={videoContext}>
                <Controller />
            </VideoContext.Provider>
        </div>
    );
});

export default ReactPlayer;
