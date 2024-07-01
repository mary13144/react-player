import React, {memo, useCallback, useContext, useMemo} from "react";
import Progress from "./progress";
import styles from './index.module.scss'
import Controls from "@/core/controller/controls";
import {VideoContext} from "@/core/context";
import SvgIcon from "@/components/svgIcon";
import End from "@/core/controller/end";
import {defaultLanguage, defaultTheme} from "@/core/config";
import SuspendedProgress from "@/core/controller/suspendedProgress";
import {debounce, throttle} from "lodash";


const Controller = memo(function () {

	const {
		handleChangePlayState,
		videoOption,
		videoAttributes,
		videoState,
		dispatch
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
	const {isPlay, isEnd, isWaiting} = videoAttributes!
	const {isControl} = videoState!
	const pausePosition = useMemo(() => {
		return pausePlacement === 'center' ? {
			left: '50%',
			top: '50%',
			transform: 'translate(-50%, -50%)',
		} : undefined
	}, [pausePlacement])

	const isShowPause = useMemo(() => {
		return isShowPauseButton !== false && !isPlay && !isEnd
	}, [isEnd, isPlay])

	const handleMove = useCallback(throttle(() => {
		dispatch?.({type: 'isControl', data: true})
		handleHide()
	}, 1000), [])

	const handleHide = useCallback(debounce(() => {
		dispatch?.({type: 'isControl', data: false})
	}, hideTime || 2000), [])

	const handleReplay = (e: React.MouseEvent) => {
		e.stopPropagation()
		videoAttributes!.isEnd = false
		handleChangePlayState?.()
	}

	return (
		<div
			className={styles.controllerContainer}
			onMouseMove={handleMove}
		>
			<div
				className={styles.controllerMask}
				style={{cursor: isControl ? 'pointer' : 'none'}}
				onClick={handleChangePlayState}
			>
				{
					isShowPause && (
						setPauseButtonContent ? setPauseButtonContent :
							<SvgIcon
								iconClass={'player'}
								fill={'#fff'}
								fontSize={'55px'}
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
								fontSize={'55px'}
								className={styles.waitingIcon}
							/>
					)
				}
			</div>
			<div className={styles.progressControlsContainer}>
				<Progress/>
				<Controls/>
			</div>
			{
				isShowProgressFloat !== false && (
					!isControl && <SuspendedProgress theme={theme || defaultTheme}/>
				)
			}
			{
				isEnd && (
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