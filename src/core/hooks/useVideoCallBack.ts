import {VideoAttributes, VideoCallBack} from "@/types";
import {VideoStateType} from "./useVideoState.ts";
import {useEffect} from "react";

export default function useVideoCallBack(videoAttributes: VideoAttributes, videoState: VideoStateType, callback?: Partial<VideoCallBack>) {
	const {
		isControl,
		quality,
	} = videoState

	useEffect(() => {
		if (quality) {
			callback?.onQualityChange?.(videoAttributes)
		}
	}, [quality]);

	useEffect(() => {
		if (isControl) {
			callback?.onIsControl?.(videoAttributes)
		}
	}, [isControl]);
}