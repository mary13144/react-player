import {VideoAttributes, VideoCallBack} from "@/types";
import {VideoStateType} from "./useVideoState.ts";
import {useEffect} from "react";

export default function useVideoCallBack(videoAttr:VideoAttributes,videoState:VideoStateType,handle:Partial<VideoCallBack>) {
	const {
		multiple,
	} = videoAttr
	const {
		isControl,
		quality,
		progressMouseDownChangeVal,
		progressMouseUpChangeVal
	} = videoState
	const {
		onQualityChange,
		onProgressMouseUp,
		onProgressMouseDown,
		onIsControl,
		onMultiple,
	} = handle

	useEffect(() => {
		if (progressMouseDownChangeVal){
			onProgressMouseDown?.(videoAttr)
		}
	}, [progressMouseDownChangeVal]);

	useEffect(() => {
		if (progressMouseUpChangeVal){
			onProgressMouseUp?.(videoAttr)
		}
	}, [progressMouseUpChangeVal]);


	useEffect(() => {
		if (quality){
			onQualityChange?.(videoAttr)
		}
	}, [quality]);


	useEffect(() => {
		if (isControl){
			onIsControl?.(videoAttr)
		}
	}, [isControl]);

	useEffect(() => {
		if (multiple){
			onMultiple?.(videoAttr)
		}
	}, [multiple]);
}