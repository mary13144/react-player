import {memo, MouseEventHandler} from "react";
import {LanguageType} from "@/types";
import styles from './index.module.scss'
import SvgIcon from "@/components/svgIcon";
import {i18n} from "@/language";

interface EndProps {
	handleClick: MouseEventHandler
	language: LanguageType
}

const End = memo((props: EndProps) => {
	const {
		handleClick,
		language,
	} = props

	return (
		<div className={styles.endContainer}>
			<div className={styles.endReplay}>
				<SvgIcon
					iconClass={'replay'}
					fill={'#fff'}
					fontSize={'50px'}
					className={styles.replayIcon}
					onClick={handleClick}
				/>
				<p className={styles.replayText}>{i18n(language, 'replay')}</p>
			</div>
		</div>
	)
})

export default End