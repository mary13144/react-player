import React, {FC, memo, useContext, useEffect, useMemo, useRef, useState} from "react";
import styles from './index.module.scss'
import {VideoContext} from "@/core/context";
import {defaultTheme} from "@/core/config";
import {throttle} from "lodash";
import {transToMinutesAndSeconds} from "@/core/utils";

const Progress: FC = memo(() => {

	// 播放器上下文
	const {
		videoAttributes,
		videoState,
		videoOption,
		videoMethod,
		dispatch
	} = useContext(VideoContext)
	const {duration, bufferedTime, currentTime} = videoAttributes!

	const progressBgRef = useRef<HTMLDivElement>(null!)

	const progressCircleRef = useRef<HTMLDivElement>(null!)

	const isDrag = useRef<boolean>(false)

	const [inProgress, setInProgress] = useState<boolean>(false)

	const [PositionX, setPositionX] = useState<number>(0)

	const handleMouseEnter = () => {
		progressBgRef.current.style.height = '7px'
		progressCircleRef.current.style.opacity = '1'
		progressCircleRef.current.style.animation = 'enter'
		setInProgress(true)
	}

	const handleMouseLeave = () => {
		progressBgRef.current.style.height = '3px'
		progressCircleRef.current.style.opacity = '0'
		progressCircleRef.current.style.animation = 'leave'
		setInProgress(false)
	}

	useEffect(() => {
		window.addEventListener('mousemove', handleMouseMove)
		window.addEventListener('mouseup', handleMouseUp)
		return () => {
			window.removeEventListener('mousemove', handleMouseMove)
			window.removeEventListener('mouseup', handleMouseUp)
		}
	}, []);

	const handleMouseDown = () => {
		isDrag.current = true
		dispatch?.({type: 'progressMouseDownChangeVal', data: Date.now()})
	}
	const handleMouseMove = throttle((e: MouseEvent) => {
		if (!isDrag.current)
			return
		const leftDistance = progressBgRef.current.getBoundingClientRect().left
		const deltaX = e.clientX - leftDistance;
		const curTime = calcCurrentTime(deltaX)
		if (curTime > 0 && curTime < duration) {
			videoMethod?.seek(curTime);
		} else if (curTime <= 0) {
			videoMethod?.seek(0)
		} else if (curTime >= duration) {
			videoMethod?.seek(duration)
		}
	}, 10)
	const handleMouseUp = () => {
		isDrag.current = false
		if (currentTime < duration && !isDrag) {
			videoMethod?.play()
		}
		dispatch?.({type: 'progressMouseUpChangeVal', data: Date.now()})
	}
	const handleClick = (e: React.MouseEvent) => {
		const leftDistance = progressBgRef.current.getBoundingClientRect().left
		const deltaX = e.clientX - leftDistance;
		const curTime = calcCurrentTime(deltaX)
		if (curTime > 0 && curTime < duration) {
			videoMethod?.seek(curTime);
		} else if (curTime <= 0) {
			videoMethod?.seek(0)
		} else if (curTime >= duration) {
			videoMethod?.seek(duration)
		}
	}

	const handleProgressMove = throttle((e: React.MouseEvent) => {
		const leftDistance = progressBgRef.current.getBoundingClientRect().left
		const deltaX = e.clientX - leftDistance;
		setPositionX(deltaX)
	}, 10)

	const calcCurrentTime = (curDistance: number) => {
		const sumX = progressBgRef.current.clientWidth;
		const percentage = curDistance / sumX;
		return percentage * duration
	}

	const calcPlayedPercent = useMemo(() => {
		if (!duration)
			return '0%'
		return ((currentTime / duration) * 100).toString() + "%"
	}, [currentTime, duration])

	const calcBufferedPercent = useMemo(() => {
		if (!duration)
			return '0%'
		return ((bufferedTime / duration) * 100).toString() + "%"
	}, [bufferedTime, duration])

	return (
		<div
			className={styles.progressContainer}
			style={{opacity: videoState?.isControl ? '1' : '0'}}
		>
			<div className={styles.progressBg} ref={progressBgRef}>
				<div className={styles.progressBuffered} style={{width: calcBufferedPercent}}></div>
				<div className={styles.progressPlayed} style={{
					width: calcPlayedPercent,
					backgroundColor: videoOption?.theme ? videoOption.theme : defaultTheme
				}}>
					<i
						className={styles.progressCircle} ref={progressCircleRef}
						style={{backgroundColor: videoOption?.theme ? videoOption.theme : defaultTheme}}
					></i>
				</div>
				<div
					className={styles.progressMask}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
					onMouseMove={handleProgressMove}
					onMouseDown={handleMouseDown}
					onClick={handleClick}
				></div>
				{
					inProgress && (
						<>
							<div
								className={styles.progressTooltip}
								style={{left: `${PositionX}px`}}
							>
								<div
									className={styles.tooltipTop}
									style={{borderTop: `4px solid ${videoOption?.theme ? videoOption.theme : defaultTheme}`}}
								>

								</div>
								<div
									className={styles.tooltipBottom}
									style={{borderBottom: `4px solid ${videoOption?.theme ? videoOption.theme : defaultTheme}`}}
								>

								</div>
							</div>
							<div
								className={styles.progressTimeTip}
								style={{left: `${PositionX}px`}}
							>
								{
									videoOption?.setProgressTimeTip ? videoOption.setProgressTimeTip(transToMinutesAndSeconds(calcCurrentTime(PositionX))) :
										<span className={styles.currentTime}>
											{transToMinutesAndSeconds(calcCurrentTime(PositionX))}
										</span>
								}
							</div>
						</>
					)
				}
			</div>
		</div>
	)
})

export default Progress;