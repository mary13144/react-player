import React, {memo, useContext, useEffect, useMemo, useRef, useState} from "react";
import styles from './index.module.scss'
import SvgIcon from "@/components/svgIcon";
import {VideoContext} from "@/core/context";
import useDrag from "@/core/hooks/useDrag.ts";
import useIsMobile from "@/core/hooks/useIsMobile.ts";

interface VolumeProps {
	theme?: string;
}

const Volume = memo((props: VolumeProps) => {
	const {theme} = props

	const volumeRef = useRef<HTMLDivElement>(null)
	const volumeSetRef = useRef<HTMLDivElement>(null)

	const {videoMethod, videoAttributes} = useContext(VideoContext)

	const {volume, isMute} = videoAttributes!

	const [isMuted, setIsMuted] = useState<boolean>(isMute)

	const [isShow, setIsShow] = useState<boolean>(false)

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

	const handleTouched = () => {
		setIsShow(prevState => !prevState)
	}

	const handleIsMute = () => {
		setIsMuted(prevState => !prevState)
	}
	const isMobile = useIsMobile()
	const handleClick = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
		const height = volumeRef.current!.offsetHeight
		let positionX;
		if (!isMobile) {
			const event = e as React.MouseEvent<HTMLDivElement>
			positionX = event.clientX
		} else {
			const event = e as React.TouchEvent<HTMLDivElement>
			positionX = event.touches[0].clientX
		}
		const volumePercent = (volumeRef.current!.getBoundingClientRect().bottom - positionX) / height
		if (volumePercent > 1) {
			videoMethod?.setVolume(1)
		} else if (volumePercent < 0) {
			videoMethod?.setVolume(0)
		} else {
			videoMethod?.setVolume(volumePercent)
		}
	}


	useDrag({
		onDrag: (dragData) => {
			const bottom = volumeRef.current!.getBoundingClientRect().bottom
			const height = volumeRef.current!.clientHeight
			const percentY = (bottom - dragData.endY) / height;
			if (percentY > 1) {
				videoMethod?.setVolume(1)
			} else if (percentY < 0) {
				videoMethod?.setVolume(0)
			} else {
				videoMethod?.setVolume(percentY)
			}
		}
	}, volumeSetRef.current!, volumeSetRef.current!)

	return (
		<div
			onMouseEnter={!isMobile ? handleMouseEnter : undefined}
			onMouseLeave={!isMobile ? handleMouseLeave : undefined}
			className={styles.volumeContainer}
		>
			<div
				onClick={!isMobile ? handleIsMute : undefined}
				onTouchStart={isMobile ? handleTouched : undefined}
				className={styles.volumeIcon}
			>
				<SvgIcon iconClass={isMuted ? 'mute' : 'volume'} fill={'#fff'} fontSize={'20px'}/>
			</div>
			<div
				className={styles.volumeSetContainer}
				style={{opacity: isShow ? '1' : '0', visibility: isShow ? 'visible' : 'hidden'}}
			>
				<div
					onClick={!isMobile ? handleClick : undefined}
					// onTouchStart={isMobile ? handleClick : undefined}
					ref={volumeSetRef}
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