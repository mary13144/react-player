import { CSSProperties, ReactNode } from 'react';
import { ToastPosition } from '@/components/toast';

export type VideoSrcType = 'hls' | 'h264';

/**
 *  @description 支持的HTTP传输对象类别(Content-Type)
 */
export const supportTypes = [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'application/vnd.apple.mpegurl',
    'application/x-mpegurl',
];

export type NoParVoid = () => void;
export type ParVoid<T> = (par: T) => void;
export type CallBackType<T = VideoAttributes> = (attr: T) => void;

export type CrossOrigin = 'anonymous' | 'use-credentials' | '' | undefined;

export interface QualityList {
    key: number;
    url: string;
    enName: string;
    zhName: string;
}

export interface QualityConfig {
    currentKey: number;
    qualityList: QualityList[];
}

/**
 * @description 暂停键位置
 */
export type PausePlacement = 'bottomRight' | 'center';
/**
 * @description 悬浮进度条位置
 */
export type ProgressFloatPosition = 'top' | 'bottom';
/**
 * @description 支持语言
 */
export type LanguageType = 'zh' | 'en';

/**
 * @description 视频播放器配置项
 */
export interface VideoPlayerOptions {
    /**
     * @description 视频容器的width
     */
    width?: number | string;
    /**
     * @description 视频容器的height
     */
    height?: number | string;
    /**
     * @description 视频容器styles
     */
    style?: CSSProperties;
    /**
     * @description 视频容器className
     */
    className?: string;
    /**
     * @description 视频播放地址
     */
    videoSrc?: string;
    /**
     * @description 视频资源是否允许跨域
     */
    crossOrigin?: CrossOrigin;
    /**
     * @description 视频播放格式，支持h264(.mp4,.webm,.ogg)，hls(m3u8),默认h264格式
     */
    videoType?: VideoSrcType;
    /**
     * @description 主题
     */
    theme?: string;
    /**
     * @description 视频封面图
     */
    poster?: string;
    /**
     * @description 是否循环播放
     */
    loop?: boolean;
    /**
     * @description 自定义视频结束时显示的内容
     */
    setEndContent?: ReactNode;
    /**
     * @description 自定义视频缓冲加载组件
     */
    setBufferContent?: ReactNode;
    /**
     *  @description 自定义视频暂停键
     */
    setPauseButtonContent?: ReactNode;
    /**
     * @description 暂停键的位置
     */
    pausePlacement?: PausePlacement;
    /**
     * @description 多少毫秒，无任何操作，隐藏鼠标和控制器/ms
     */
    hideTime?: number;
    /**
     * @description 是否显示播放倍数功能
     */
    isShowMultiple?: boolean;
    /**
     * @description 是否显示设置功能
     */
    isShowSet?: boolean;
    /**
     * @description 是否显示截图功能
     */
    isShowScreenShot?: boolean;
    /**
     * @description 是否显示画中画
     */
    isShowPictureInPicture?: boolean;
    /**
     * @description 是否显示网页全屏
     */
    isShowWebFullScreen?: boolean;
    /**
     * @description  语言,默认中文
     */
    language?: LanguageType;
    /**
     * @description 是否显示暂停键
     */
    isShowPauseButton?: boolean;
    /**
     * @description 视频质量清晰度的选择列表
     */
    qualityConfig?: QualityConfig;
    /**
     * @description 是否显示toast，默认不显示
     */
    isShowToast?: boolean;
    /**
     * @description toast的位置，此值只有isToast为true时，才有效果
     */
    toastPosition?: ToastPosition;
    /**
     * @description 是否显示进度条浮层提示
     */
    isShowProgressFloat?: boolean;
    /**
     *  @description 进度条浮层提示的位置，此值只有isProgressFloat为true时，才有效果
     */
    progressFloatPosition?: ProgressFloatPosition;
    /**
     * @description 设置自定义事件显示
     * @param currentTime
     */
    setProgressTimeTip?: (currentTime: string) => ReactNode;
}

/**
 * @description 视频播放属性
 */
export interface VideoAttributes {
    /**
     * @description 是否播放
     */
    isPlay: boolean;
    /**
     * @description 当前时间/s
     */
    currentTime: number;
    /**
     * @description 持续时间
     */
    duration: number;
    /**
     * @description 缓冲时间
     */
    bufferedTime: number;
    /**
     * @description 是否开启画中画
     */
    isPictureInPicture: boolean;
    /**
     * @description 音量
     */
    volume: number;
    /**
     * @description 是否静音
     */
    isMute: boolean;
    /**
     * @description 视频播放倍数
     */
    multiple: number;
    /**
     * @description 是否播放结束
     */
    isEnded: boolean;
    /**
     * @description 错误
     */
    error: string | undefined;
    /**
     * @description 暂停缓冲
     */
    isWaiting: boolean;
}

/**
 * @description 视频播放器方法
 */
export interface VideoMethod {
    /**
     * @description 加载视频
     */
    load: NoParVoid;
    /**
     * @description 播放视频
     */
    play: NoParVoid;
    /**
     * @description 暂停
     */
    pause: NoParVoid;
    /**
     * @description 设置音量
     */
    setVolume: ParVoid<number>;
    /**
     * @description 指定视频播放位置/s
     */
    seek: ParVoid<number>;
    /**
     * @description 设置视频的地址src
     */
    setVideoSrc: ParVoid<string>;
    /**
     * @description 设置播放倍数
     */
    setPlayRate: ParVoid<number>;
    /**
     * @description 设置静音
     */
    setMuted: ParVoid<boolean>;
    /**
     * @description 改变播放状态
     */
    changePlayState: NoParVoid;
}

/**
 * @description 视频播放回调函数
 */
export interface VideoCallBack<T = CallBackType> {
    /**
     * @description 视频播放回调函数
     */
    onPlay: T;
    /**
     * @description 视频暂停播放回调函数
     */
    onPause: T;
    /**
     * @description 视频播放结束回调函数
     */
    onEnded: T;
    /**
     * @description 视频播放失败回调函数
     */
    onError: NoParVoid;
    /**
     * @description 音量改变回调函数
     */
    onVolumeChange: T;
    /**
     * @description 视频清晰度改变回调函数
     */
    onQualityChange: T;
    /**
     * @description 进入画中画回调函数
     */
    onInPicture: T;
    /**
     * @description 离开画中画回调函数
     */
    onLeavePicture: T;
    /**
     * @description 显示控件回调函数
     */
    onIsControl: T;
    /**
     * @description 调整播放倍数回调函数
     */
    onRateChange: T;
    /**
     * @description 视频缓冲回调函数
     */
    onWaiting: T;
}
