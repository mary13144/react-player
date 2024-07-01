import {memo, useContext, useMemo} from "react";
import {VideoContext} from "@/core/context";
import styles from './index.module.scss'

interface SuspendedProgressProps {
	theme: string;
}

const SuspendedProgress = memo((props: SuspendedProgressProps) => {
	const {theme} = props
	const {videoAttributes, videoOption} = useContext(VideoContext)
	const {progressFloatPosition} = videoOption!
	const {currentTime, duration} = videoAttributes!
	const percent = useMemo(() => {
		return ((currentTime / duration) * 100).toString() + '%';
	}, [currentTime, duration])

	return (
		<div
			className={styles.suspendedProgressContainer}
			style={progressFloatPosition === 'top' ? {top: 0} : {bottom: 0}}
		>
			<div className={styles.suspendedProgress} style={{backgroundColor: theme, width: percent}}></div>
		</div>
	)
})

export default SuspendedProgress
