import {memo, useContext, useMemo, useState} from "react";
import styles from './index.module.scss'
import Monitor from "@/core/controller/controls/monitor";
import {VideoContext} from "@/core/context";
import Quality from "@/core/controller/controls/quality";
import Multiple from "@/core/controller/controls/multiple";
import Volume from "@/core/controller/controls/volume";
import Set from "@/core/controller/controls/set";
import {defaultLanguage, defaultTheme} from "@/core/config";
import ToolTip from "@/components/toolTip";
import {i18n} from "@/language";
import SvgIcon from "@/components/svgIcon";
import screenfull from "screenfull";
import useToast from "@/components/toast/useToast.ts";

const Controls = memo(function () {

	const {
		videoOption,
		videoELe,
		videoContainerEle,
		videoState
	} = useContext(VideoContext)

	const {
		qualityConfig,
		theme,
		language,
		isShowMultiple,
		isShowSet,
		isShowScreenShot,
		isShowPictureInPicture,
		isShowWebFullScreen,
		toastPosition
	} = videoOption!

	const curTheme = useMemo(() => theme ? theme : defaultTheme, [theme])

	const lang = useMemo(() => language ? language : defaultLanguage, [language])

	// 画中画
	const [isInPicture, setIsInPicture] = useState<boolean>(false)
	const inPictureKey = useMemo(() => !isInPicture ? 'openPicture' : 'closePicture', [isInPicture])

	// 网页全屏
	const [isFullWebScreen, setIsFullWebScreen] = useState<boolean>(false)
	const isFullWebScreenKey = useMemo(() => !isFullWebScreen ? 'FullWebScreen' : 'CloseWebFullScreen', [isFullWebScreen])
	const isFullWebScreenIcon = useMemo(() => !isFullWebScreen ? 'webFullscreen' : 'closeWebFullscreen', [isFullWebScreen])

	// 全屏
	const [isFullScreen, setIsFullScreen] = useState<boolean>(false)
	const isFullScreenKey = useMemo(() => !isFullScreen ? 'FullScreen' : 'CloseFullScreen', [isFullScreen])
	const isFullScreenIcon = useMemo(() => !isFullScreen ? 'fullScreen' : 'closeFullScreen', [isFullWebScreen])

	const {showToast} = useToast()
	// 截图
	const handleScreenshot = () => {
		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');

		// 设置画布宽度和高度与视频一致
		canvas.width = videoELe!.videoWidth;
		canvas.height = videoELe!.videoHeight;

		// 在画布上绘制当前视频帧
		context!.drawImage(videoELe!, 0, 0, canvas.width, canvas.height);

		try {
			// 将 canvas 转换为图片并下载
			const link = document.createElement('a');
			link.download = `screenshot${Date.now()}.png`;
			link.href = canvas.toDataURL('image/png');
			link.click();
		} catch (err: unknown) {
			showToast({
				message: (
					<div>
						{i18n(lang, 'error')}&nbsp;
						<strong style={{color: curTheme}}>{err?.toString()}</strong>
					</div>
				),
				position: toastPosition
			})
		}


	}
	// 画中画
	const handleInPicture = () => {
		if (isInPicture) {
			setIsInPicture(false)
			document.exitPictureInPicture()
		} else {
			setIsInPicture(true)
			videoELe?.requestPictureInPicture()
		}
	}

	const handleChangeGap = () => {
		const list = document.getElementsByClassName(styles.multifunctionItem)
		for (const listElement of list) {
			listElement.classList.toggle('full-screen-space')
		}
	}
	// 网页全屏
	const handleFullWebScreen = () => {
		if (isFullWebScreen) {
			setIsFullWebScreen(false)
			videoContainerEle?.classList.toggle('full-web-screen')
		} else {
			setIsFullWebScreen(true)
			videoContainerEle?.classList.toggle('full-web-screen')
		}
		handleChangeGap()
	}
	// 全屏
	const handleFullScreen = () => {
		if (screenfull.isEnabled) {
			setIsFullScreen(prevState => !prevState)
			screenfull.toggle(videoContainerEle)
			handleChangeGap()
		}
	}


	return (
		<div
			className={styles.controlsContainer}
			style={{opacity: videoState?.isControl ? '1' : '0'}}
		>
			<Monitor/>
			<div className={styles.multifunctionContainer}>
				{qualityConfig && (
					<div className={styles.multifunctionItem}>
						<Quality
							theme={curTheme}
							language={lang}>
						</Quality>
					</div>
				)}
				{
					isShowMultiple !== false && (
						<div className={styles.multifunctionItem}>
							<Multiple theme={curTheme} language={lang}/>
						</div>
					)
				}
				<div className={styles.multifunctionItem}>
					<Volume theme={curTheme}/>
				</div>
				{
					isShowSet !== false && (
						<div className={styles.multifunctionItem}>
							<Set theme={curTheme} language={lang}/>
						</div>
					)
				}
				{
					isShowScreenShot !== false && (
						<div className={styles.multifunctionItem}>
							<ToolTip text={i18n(lang, 'screenshots')}>
								<SvgIcon
									iconClass={'screenshots'}
									fill={'#fff'}
									fontSize={'20px'}
									className={styles.controlsIcon}
									onClick={handleScreenshot}
								/>
							</ToolTip>
						</div>
					)
				}
				{
					isShowPictureInPicture !== false && (
						<div className={styles.multifunctionItem}>
							<ToolTip text={i18n(lang, inPictureKey)}>
								<SvgIcon
									iconClass={'inPicture'}
									fill={'#fff'}
									fontSize={'20px'}
									className={styles.controlsIcon}
									onClick={handleInPicture}
								/>
							</ToolTip>
						</div>
					)
				}
				{
					isShowWebFullScreen !== false && (
						<div className={styles.multifunctionItem}>
							<ToolTip text={i18n(lang, isFullWebScreenKey)}>
								<SvgIcon
									iconClass={isFullWebScreenIcon}
									fill={'#fff'}
									fontSize={'20px'}
									className={styles.controlsIcon}
									onClick={handleFullWebScreen}
								/>
							</ToolTip>
						</div>
					)
				}
				<div className={styles.multifunctionItem}>
					<ToolTip text={i18n(lang, isFullScreenKey)}>
						<SvgIcon
							iconClass={isFullScreenIcon}
							fill={'#fff'}
							fontSize={'20px'}
							className={styles.controlsIcon}
							onClick={handleFullScreen}
						/>
					</ToolTip>
				</div>
			</div>
		</div>
	)
})

export default Controls