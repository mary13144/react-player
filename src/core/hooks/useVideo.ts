import { useRef } from 'react';
import {
    supportTypes,
    VideoPlayerOptions,
} from '@/types';

import Hls from 'hls.js';
import { defaultVolume } from '@/core/config';

const useVideo = (option: VideoPlayerOptions) => {

    const curHls = useRef<Hls | undefined>();

    /**
     * @description hls视频加载
     */
    const setHls = (videoEle: HTMLVideoElement, src: string) => {
        if (Hls.isSupported()) {
            if (curHls.current) {
                curHls.current?.detachMedia();
                curHls.current?.loadSource(src);
                curHls.current?.attachMedia(videoEle);
            } else {
                const hls = new Hls();
                hls.loadSource(src);
                hls.attachMedia(videoEle);
                curHls.current = hls;
            }
        }
    };

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
            const response = await fetch(url, { method: 'HEAD' });
            const contentTypes = response.headers
                .get('Content-Type')
                ?.toLowerCase()
                .split(';')
                .map((item) => item.trim());
            contentTypes?.find((item) => {
                // HLS流的播放列表文件（.m3u8）通常会被服务器设置为特定的MIME类型，
                // 即application/vnd.apple.mpegurl或application/x-mpegURL。
                // 这些MIME类型是标准的，可以直接通过HTTP头部进行检查。
                if (
                    item.includes('application/vnd.apple.mpegurl') ||
                    item.includes('application/vnd.apple.mpegurl')
                ) {
                    return true;
                }
            });
            // HLS流的播放列表文件（通常是.m3u8文件）包含特定的标签，如#EXTM3U和#EXT-X-STREAM-INF，这些标签是HLS流的标志。
            const content = await response.text();
            return (
                content.includes('#EXTM3U') &&
                content.includes('#EXT-X-STREAM-INF')
            );
        } catch (error) {
            console.error(`请求错误: ${error}`);
            return false;
        }
    };

    /**
     * @description 加载url
     * @param videoEle 视频对象
     * @param url
     */
    const loadSrc = (videoEle: HTMLVideoElement, url: string) => {
        videoEle.innerHTML = ''
        supportTypes.forEach((item) => {
            const source = document.createElement('source');
            source.type = item;
            source.src = url;
            videoEle.appendChild(source);
        });
    };

    /**
     * @description 加载视频
     * @param videoEle
     * @param url
     */
    const loadVideo = async (videoEle: HTMLVideoElement, url: string) => {
        loadSrc(videoEle, url);
        let flag = false;
        if (option.crossOrigin) {
            flag = await checkHls(url);
        }
        if (option.videoType === 'hls') {
            flag = true;
        }
        if (flag) {
            setHls(videoEle, url);
        }
    };

    /**
     * @description 加载localstorage中的配置，防止刷新重置
     */
    const loadOptions = (
        videoELe: HTMLVideoElement,
        videoMaskEle: HTMLDivElement,
    ) => {
        const curVolume = localStorage.getItem('volume');
        const curLight = localStorage.getItem('light');
        const curLoop = localStorage.getItem('loop');
        const curRate = localStorage.getItem('playRate');
        if (curVolume) {
            videoELe.volume = parseFloat(curVolume)
        } else {
            videoELe.volume = defaultVolume / 100;
        }
        if (curLight) {
            videoMaskEle.style.display = curLight;
        }
        if (curLoop) {
            videoELe.loop = curLoop === 'true';
        }
        if (curRate) {
            videoELe.playbackRate = parseFloat(curRate)
        }
    };
    return {
        loadVideo,
        loadOptions,
    };
};

export default useVideo;
