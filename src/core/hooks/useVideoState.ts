import {Reducer, useReducer} from "react";

/**
 * @description videoState
 */
export interface VideoStateType {
	/**
	 * @description 是否显示视频控件
	 */
	isControl: boolean;
	/**
	 * @description onProgressMouseDown事件的变化数据
	 */
	progressMouseDownChangeVal: number;
	/**
	 * @description onProgressMouseUp事件的变化数据
	 */
	progressMouseUpChangeVal: number;
	/**
	 * @description 视频质量清晰度
	 */
	quality: number | undefined;
}

interface IsControlActionType {
	type: 'isControl';
	data: VideoStateType['isControl']
}

interface ProgressMouseDownChangeValActionType {
	type: 'progressMouseDownChangeVal';
	data: VideoStateType['progressMouseDownChangeVal']
}

interface ProgressMouseUpChangeValActionType {
	type: 'progressMouseUpChangeVal';
	data: VideoStateType['progressMouseUpChangeVal']
}

interface QualityActionType {
	type: 'quality';
	data: VideoStateType['quality']
}

/**
 * @description Action
 */
export type VideoActionType =
	IsControlActionType |
	ProgressMouseDownChangeValActionType |
	ProgressMouseUpChangeValActionType |
	QualityActionType


const initialState: VideoStateType = {
	isControl: false,
	progressMouseDownChangeVal: 0,
	progressMouseUpChangeVal: 0,
	quality: undefined,
}
export const useVideoState = () => {
	const videoReducer: Reducer<VideoStateType, VideoActionType> = (prevState, action) => {
		switch (action.type) {
			case 'isControl':
				return {...prevState, isControl: action.data};
			case 'progressMouseDownChangeVal':
				return {...prevState, progressMouseDownChangeVal: action.data};
			case 'progressMouseUpChangeVal':
				return {...prevState, progressMouseUpChangeVal: action.data};
			case 'quality':
				return {...prevState, quality: action.data};
			default:
				return prevState;
		}
	}
	const [videoState, dispatch] = useReducer(videoReducer, initialState);
	return {
		videoState,
		dispatch
	}
}