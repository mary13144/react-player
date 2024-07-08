import { VideoPlayerOptions } from '@/types';
import useIsMobile from '@/core/hooks/useIsMobile.ts';
import { useEffect, useRef } from 'react';

/**
 * @description 设置视频尺寸hook
 * @param containerEle 视频容器对象
 * @param videoELe 视频对象
 * @param option 配置项
 */
const useSetSize = (
    containerEle: HTMLDivElement,
    videoELe: HTMLVideoElement,
    option: VideoPlayerOptions,
) => {
    const cRef = useRef<HTMLDivElement>(containerEle);
    const vRef = useRef<HTMLVideoElement>(videoELe);

    useEffect(() => {
        cRef.current = containerEle;
        vRef.current = videoELe;
    }, [containerEle, videoELe]);
    /**
     * @description 获取当前元素长宽
     * @param ele 元素对象
     */
    const getELementSize = (ele: HTMLElement) => {
        const width = parseFloat(getComputedStyle(ele).width);
        const height = parseFloat(getComputedStyle(ele).height);
        return { width, height };
    };

    /**
     * @description 自适应视频比例
     */
    const adaptSize = () => {
        // 容器长宽
        const { width: cWidth, height: cHeight } = getELementSize(cRef.current);
        // 视频本身长宽
        const vWidth = vRef.current.videoWidth;
        const vHeight = vRef.current.videoHeight;

        const cRatio = cWidth / cHeight; // 视频容器宽长比

        const vRatio = vWidth / vHeight; // 视频宽长比

        /**
         * 两种情况：
         * 1. 视频容器宽长比大于视频宽长比，则视频容器更加细长，此时为保证视频原有宽长比，应该将视频长度与视频容器一直，压缩宽度，即左右有黑边
         * 2. 视频容器宽长比小于视频宽长比，则视频容器更加矮胖，测试为保证视频原有宽长比，应该将视频宽度与视频容器一直，压缩长度，即上下有黑边
         */
        if (cRatio > vRatio) {
            vRef.current.style.height = '100%';
            vRef.current.style.width = `${vRatio * cHeight}px`;
        } else {
            vRef.current.style.width = '100%';
            vRef.current.style.height = `${cWidth / vRatio}px`;
        }
    };

    const isMobile = useIsMobile();
    /**
     * @description 设置视频尺寸
     */
    const setSize = () => {
        if (!option.width && !option.style?.width) {
            cRef.current.style.width = `${vRef.current.videoWidth}px`;
        }

        if (!option.height && !option.style?.height) {
            cRef.current.style.height = `${vRef.current.videoHeight}px`;
        }

        if (option.width) {
            if (typeof option.width === 'number') {
                cRef.current.style.width = `${option.width}px`;
            } else {
                cRef.current.style.width = option.width;
            }
        }

        if (option.height) {
            if (typeof option.height === 'number') {
                cRef.current.style.height = `${option.height}px`;
            } else {
                cRef.current.style.height = option.height;
            }
        }

        if (isMobile) {
            const { width, height } = getELementSize(cRef.current);

            const vWidth = vRef.current.videoWidth;
            const vHeight = vRef.current.videoHeight;

            const vRatio = vWidth / vHeight;

            if (
                width > window.visualViewport!.width ||
                height > window.visualViewport!.height
            ) {
                cRef.current.style.width = `${window.visualViewport!.width}px`;
                cRef.current.style.height = `${window.visualViewport!.width / vRatio}px`;
            }
        }

        adaptSize();
    };

    return { setSize, adaptSize };
};

export default useSetSize;
