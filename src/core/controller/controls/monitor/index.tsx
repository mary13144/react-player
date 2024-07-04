import {memo, useContext} from "react";
import styles from './index.module.scss'
import SvgIcon from "@/components/svgIcon";
import {VideoContext} from "@/core/context";
import {transToMinutesAndSeconds} from "@/core/utils";

const Monitor = memo(() => {

	const {videoAttributes, videoMethod} = useContext(VideoContext)
	const {changePlayState} = videoMethod!
	const {isPlay, currentTime, duration} = videoAttributes!

	return (
		<div className={styles.monitorContainer}>
			<SvgIcon
				iconClass={!isPlay ? 'player' : 'pause'}
				fill={'#fff'}
				fontSize={'20px'}
				onClick={changePlayState}
				className={styles.icon}
			/>
			<span className={styles.timeContainer}>
				<span className={styles.currentTime}>{transToMinutesAndSeconds(currentTime)}</span>
				<span> / </span>
				<span className={styles.totalTime}>{transToMinutesAndSeconds(duration)}</span>
			</span>
		</div>
	)
})

export default Monitor