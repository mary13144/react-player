import {VideoAttributes, VideoCallBack} from "@/types";
import {VideoStateType} from "./useVideoState.ts";
import {useEffect} from "react";

export default function useVideoCallBack(videoAttributes: VideoAttributes, videoState: VideoStateType, handle: Partial<VideoCallBack>) {
	const {
		isControl,
		quality,
	} = videoState

	const {
		onQualityChange,
		onIsControl,
	} = handle

	useEffect(() => {
		if (quality) {
			onQualityChange?.(videoAttributes!)
		}
	}, [quality]);

	useEffect(() => {
		if (isControl) {
			onIsControl?.(videoAttributes!)
		}
	}, [isControl]);
}