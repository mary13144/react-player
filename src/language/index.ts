import {LanguageType} from "@/types";

export interface LangType<T = string> {
	multiple: T,
	screenshots: T,
	openPicture: T,
	closePicture: T,
	FullWebScreen: T,
	CloseWebFullScreen: T,
	FullScreen: T,
	CloseFullScreen: T,
	multipleSwitch: T,
	qualitySwitch: T,
	light: T,
	loop: T,
	replay: T,
	error: T,
	volume: T
}

const zhJson: LangType = {
	multiple: '倍数',
	screenshots: '截图',
	openPicture: '开启画中画',
	closePicture: '关闭画中画',
	FullWebScreen: '网页全屏',
	CloseWebFullScreen: '退出网页全屏',
	FullScreen: '进入全屏',
	CloseFullScreen: '退出全屏',
	multipleSwitch: '播放倍数已切换到',
	qualitySwitch: '清晰度已切换',
	light: '关灯',
	loop: '循环',
	replay: '重播',
	error: '错误',
	volume: '音量'
}

const enJson: LangType = {
	multiple: 'Multiple',
	screenshots: 'Screenshot',
	openPicture: 'Enable Picture-in-Picture',
	closePicture: 'Disable Picture-in-Picture',
	FullWebScreen: 'Full Web Screen',
	CloseWebFullScreen: 'Exit Full Web Screen',
	FullScreen: 'Enter Full Screen',
	CloseFullScreen: 'Exit Full Screen',
	multipleSwitch: 'The playback multiple has been switched to',
	qualitySwitch: 'Resolution has been switched to',
	light: 'Dark',
	loop: 'Loop',
	replay: 'Replay',
	error: 'Error',
	volume: 'Volume'
}

export const i18n = (languageType: LanguageType, key: keyof LangType) => {
	if (languageType === 'zh') {
		return zhJson[key]
	} else {
		return enJson[key]
	}
}