import React, {FC, memo, useCallback, useContext, useMemo, useRef, useState} from "react";
import styles from './index.module.scss'
import {VideoContext} from "@/core/context";
import {defaultTheme} from "@/core/config";
import {throttle} from "lodash";
import {transToMinutesAndSeconds} from "@/core/utils";
import useDrag from "@/core/hooks/useDrag.ts";
import useIsMobile from "@/core/hooks/useIsMobile.ts";

const Progress: FC = memo(() => {

	// 播放器上下文
	const {
		videoAttributes,
		videoState,
		videoOption,
		videoMethod,
	} = useContext(VideoContext)

	const {duration, bufferedTime, currentTime} = videoAttributes!

	const progressBgRef = useRef<HTMLDivElement>(null!)

	const progressCircleRef = useRef<HTMLDivElement>(null!)

	const [inProgress, setInProgress] = useState<boolean>(false)

	const [PositionX, setPositionX] = useState<number>(0)

	const handleMouseEnter = () => {
		progressBgRef.current.style.height = '0.4rem'
		progressCircleRef.current.style.opacity = '1'
		progressCircleRef.current.style.visibility = 'visible'
		setInProgress(true)
	}

	const handleMouseLeave = () => {
		progressBgRef.current.style.height = '0.2rem'
		progressCircleRef.current.style.opacity = '0'
		progressCircleRef.current.style.visibility = 'hidden'
		setInProgress(false)
	}

	useDrag({
		onDrag: (dragData) => {
			const {left} = progressBgRef.current.getBoundingClientRect()
			const percentX = (dragData.endX - left) / progressBgRef.current.clientWidth;
			const curTime = percentX * duration
			if (curTime > 0 && curTime < duration) {
				videoMethod?.seek(curTime);
			} else if (curTime <= 0) {
				videoMethod?.seek(0)
			} else if (curTime >= duration) {
				videoMethod?.seek(duration)
			}
		}
	}, progressBgRef.current)


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

	const handleProgressMove = useCallback(throttle((e: React.MouseEvent) => {
		const leftDistance = progressBgRef.current.getBoundingClientRect().left
		const deltaX = e.clientX - leftDistance;
		setPositionX(deltaX)
	}, 10), [progressBgRef.current])

	const calcCurrentTime = (curDistance: number) => {
		const sumX = progressBgRef.current.clientWidth;
		const percentage = curDistance / sumX;
		return percentage * duration
	}

	const calcPlayedPercent = useMemo(() => {
		if (!duration) {
			return '0%'
		}
		return ((currentTime / duration) * 100).toString() + "%"
	}, [currentTime, duration])

	const calcBufferedPercent = useMemo(() => {
		if (!duration) {
			return '0%'
		}
		return ((bufferedTime / duration) * 100).toString() + "%"
	}, [bufferedTime, duration])

	const isMobile = useIsMobile()

	return (
		<div
			className={styles.progressContainer}
			style={{
				opacity: videoState?.isControl ? '1' : '0',
				visibility: videoState?.isControl ? 'visible' : 'hidden'
			}}
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
					onTouchStart={handleMouseEnter}
					onTouchEnd={handleMouseLeave}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
					onMouseMove={handleProgressMove}
					onClick={handleClick}
				></div>
				{
					!isMobile && inProgress && (
						<>
							<div
								className={styles.progressTooltip}
								style={{left: `${PositionX}px`}}
							>
								<div
									className={styles.tooltipTop}
									style={{borderTop: `0.25rem solid ${videoOption?.theme ? videoOption.theme : defaultTheme}`}}
								>

								</div>
								<div
									className={styles.tooltipBottom}
									style={{borderBottom: `0.25rem solid ${videoOption?.theme ? videoOption.theme : defaultTheme}`}}
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