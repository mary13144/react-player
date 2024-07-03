import {NoParVoid, VideoAttributes, VideoMethod, VideoPlayerOptions} from "@/types";
import {createContext, Dispatch} from "react";
import {VideoActionType, VideoStateType} from "@/core/hooks/useVideoState.ts";


export interface VideoContextType{
	videoELe?: HTMLVideoElement;
	videoContainerEle?: HTMLElement;
	lightOffMaskEle?:HTMLElement;
	videoAttributes?:VideoAttributes;
	videoMethod?:VideoMethod;
	videoOption?:VideoPlayerOptions;
	videoState?:VideoStateType;
	dispatch?:Dispatch<VideoActionType>;
	handleChangePlayState?:NoParVoid;
}

export const VideoContext = createContext<VideoContextType>({})