import {memo, useCallback, useContext, useEffect, useMemo, useRef} from "react";
import Progress from "./progress";
import styles from './index.module.scss'
import Controls from "@/core/controller/controls";
import {VideoContext} from "@/core/context";
import SvgIcon from "@/components/svgIcon";
import End from "@/core/controller/end";
import {defaultLanguage, defaultTheme} from "@/core/config";
import SuspendedProgress from "@/core/controller/suspendedProgress";
import {debounce, throttle} from "lodash";
import useIsMobile from "@/core/hooks/useIsMobile.ts";


const Controller = memo(function () {

	const {
		videoMethod,
		videoOption,
		videoAttributes,
		videoState,
		dispatch,
	} = useContext(VideoContext)
	const {
		pausePlacement,
		isShowPauseButton,
		language,
		theme,
		setEndContent,
		setBufferContent,
		setPauseButtonContent,
		hideTime,
		isShowProgressFloat
	} = videoOption!

	const {changePlayState} = videoMethod!

	const {isPlay, isEnded, isWaiting} = videoAttributes!

	const {isControl} = videoState!

	const isMobile = useIsMobile()

	const pausePosition = useMemo(() => {
		return pausePlacement === 'center' ? {
			left: '50%',
			top: '50%',
			transform: 'translate(-50%, -50%)',
		} : {
			right: '10%',
			bottom: '10%'
		}

	}, [pausePlacement])

	const isShowPause = useMemo(() => {
		return isShowPauseButton !== false && !isPlay && !isEnded
	}, [isEnded, isPlay])

	const handleMaskMove = useCallback(throttle(() => {
		dispatch?.({type: 'isControl', data: !isEnded})
		handleHide()
	}, 100), [isEnded])

	const handleHide = useCallback(debounce(() => {
		dispatch?.({type: 'isControl', data: false})
	}, hideTime || 2000), [])

	const handleReplay = () => {
		videoAttributes!.isEnded = false
		changePlayState?.()
	}

	const handleMove = useCallback(throttle(() => {
		handleHide.cancel()
	}, 100), [])

	useEffect(() => {
		if (isEnded)
			dispatch?.({type: 'isControl', data: false})
	}, [isEnded]);

	// 移动端双击模拟
	const lastTouchEnd = useRef<number>(0);
	const doubleClickTimeout = useRef<NodeJS.Timeout | undefined>()
	const doubleClickDelay = useRef<number>(300); // 双击的最大间隔时间，单位毫秒

	const handleTouchStart = () => {
		if (doubleClickTimeout.current) {
			clearTimeout(doubleClickTimeout.current);
		}
	}

	const handleTouched = () => {
		const currentTime = new Date().getTime();
		const timeSinceLastTouchEnd = currentTime - lastTouchEnd.current;
		if (timeSinceLastTouchEnd < doubleClickDelay.current && timeSinceLastTouchEnd > 0) {
			// 在这里添加双击事件的逻辑
			changePlayState?.()
			clearTimeout(doubleClickTimeout.current); // 防止双击之后再次触发单击事件
			lastTouchEnd.current = 0; // 重置 lastTouchEnd 防止多次触发
		} else {
			doubleClickTimeout.current = setTimeout(() => {
				// 在这里添加单击事件的逻辑
			}, doubleClickDelay.current);
		}

		lastTouchEnd.current = currentTime;
	}
	return (
		<div
			className={styles.controllerContainer}
			onMouseMoveCapture={handleMaskMove}
		>
			<div
				className={styles.controllerMask}
				style={{cursor: isControl ? 'pointer' : 'none'}}
				onClick={!isMobile ? changePlayState : undefined}
				onTouchStart={handleTouchStart}
				onTouchEnd={handleTouched}
			>
				{
					isShowPause && (
						setPauseButtonContent ? setPauseButtonContent :
							<SvgIcon
								iconClass={'player'}
								fill={'#fff'}
								fontSize={isMobile ? '2em' : '3.5rem'}
								className={styles.pauseIcon}
								style={pausePosition}
							/>
					)
				}
				{
					isWaiting && (
						setBufferContent ? setBufferContent :
							<SvgIcon
								iconClass={'loading'}
								fill={theme ? theme : defaultTheme}
								fontSize={isMobile ? '2em' : '3.5rem'}
								className={styles.waitingIcon}
							/>
					)
				}
			</div>
			<div
				className={styles.progressControlsContainer}
				onMouseMoveCapture={handleMove}
			>
				<Progress/>
				<Controls/>
			</div>
			{
				isShowProgressFloat !== false && (
					!isControl && <SuspendedProgress theme={theme || defaultTheme}/>
				)
			}
			{
				isEnded && (
					setEndContent ? setEndContent : (
						<End
							handleClick={handleReplay}
							language={language || defaultLanguage}
						/>
					)
				)
			}
		</div>
	)
})

export default Controller