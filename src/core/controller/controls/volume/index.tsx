import React, {memo, useContext, useEffect, useMemo, useRef, useState} from "react";
import styles from './index.module.scss'
import SvgIcon from "@/components/svgIcon";
import {VideoContext} from "@/core/context";

interface VolumeProps {
	theme?: string;
}

const Volume = memo((props: VolumeProps) => {
	const {theme} = props

	const volumeRef = useRef<HTMLDivElement>(null)

	const {videoMethod, videoAttributes} = useContext(VideoContext)

	const {volume} = videoAttributes!

	const [isMuted, setIsMuted] = useState<boolean>(false)

	const [isShow, setIsShow] = useState<boolean>(false)

	const [isDown, setIsDown] = useState<boolean>(false)

	const volumeNumber = useMemo(() => {
		if (isMuted)
			return 0
		return Math.floor(volume * 100)
	}, [volume, isMuted])

	useEffect(() => {
		if (!volume) {
			setIsMuted(true)
		} else {
			setIsMuted(false)
		}
	}, [volume]);

	useEffect(() => {
		if (isMuted) {
			videoMethod?.setMuted(true)
		} else {
			videoMethod?.setMuted(false)
		}
	}, [isMuted]);

	const handleMouseEnter = () => {
		setIsShow(true)
	}

	const handleMouseLeave = () => {
		setIsShow(false)
	}

	const handleIsMute = () => {
		setIsMuted(prevState => !prevState)
	}

	const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
		const height = volumeRef.current!.offsetHeight
		const volumePercent = (volumeRef.current!.getBoundingClientRect().bottom - e.clientY) / height
		if (volumePercent > 1) {
			videoMethod?.setVolume(1)
		} else if (volumePercent < 0) {
			videoMethod?.setVolume(0)
		} else {
			videoMethod?.setVolume(volumePercent)
		}
	}

	const handleMouseDown = () => {
		setIsDown(true)
	}

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!isDown)
			return
		const height = volumeRef.current!.offsetHeight
		const volumePercent = (volumeRef.current!.getBoundingClientRect().bottom - e.clientY) / height
		if (volumePercent > 1) {
			videoMethod?.setVolume(1)
		} else if (volumePercent < 0) {
			videoMethod?.setVolume(0)
		} else {
			videoMethod?.setVolume(volumePercent)
		}
	}

	const handleMouseUp = () => {
		setIsDown(false)
	}

	useEffect(() => {
		window.addEventListener('mouseup', handleMouseUp)
	}, []);

	return (
		<div
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			className={styles.volumeContainer}
		>
			<div
				onClick={handleIsMute}
				className={styles.volumeIcon}
			>
				<SvgIcon iconClass={isMuted ? 'mute' : 'volume'} fill={'#fff'} fontSize={'20px'}/>
			</div>
			<div
				className={styles.volumeSetContainer}
				style={{opacity: isShow ? '1' : '0', visibility: isShow ? 'visible' : 'hidden'}}
			>
				<div
					onClick={handleClick}
					onMouseDown={handleMouseDown}
					onMouseMove={handleMouseMove}
					className={styles.volumeSet}
				>
					<span className={styles.volumeNumber}>{volumeNumber}</span>
					<div className={styles.volumeSliderContainer}>
						<div
							ref={volumeRef}
							className={styles.volumeSliderBg}
						></div>
						<div
							className={styles.volumeSliderNumber}
							style={{backgroundColor: theme, height: `${volumeNumber}%`}}
						>
							<div
								className={styles.volumeSliderCircle}
								style={{backgroundColor: theme}}
							></div>
						</div>
					</div>
				</div>
			</div>

		</div>
	)
})

export default Volume