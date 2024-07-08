import { Reducer, useReducer } from 'react';

/**
 * @description videoState
 */
export interface VideoStateType {
    /**
     * @description 是否显示视频控件
     */
    isControl: boolean;
    /**
     * @description 视频质量清晰度
     */
    quality: number | undefined;
}

interface IsControlActionType {
    type: 'isControl';
    data: VideoStateType['isControl'];
}

interface QualityActionType {
    type: 'quality';
    data: VideoStateType['quality'];
}

/**
 * @description Action
 */
export type VideoActionType = IsControlActionType | QualityActionType;

const initialState: VideoStateType = {
    isControl: false,
    quality: undefined,
};

export const useVideoState = () => {
    const videoReducer: Reducer<VideoStateType, VideoActionType> = (
        prevState,
        action,
    ) => {
        switch (action.type) {
            case 'isControl':
                return { ...prevState, isControl: action.data };
            case 'quality':
                return { ...prevState, quality: action.data };
            default:
                return prevState;
        }
    };
    const [videoState, dispatch] = useReducer(videoReducer, initialState);
    return {
        videoState,
        dispatch,
    };
};
