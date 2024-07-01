import {memo, useContext, useState} from "react";
import styles from './index.module.scss'
import SvgIcon from "@/components/svgIcon";
import Switch from "@/components/switch";
import {VideoContext} from "@/core/context";
import {LanguageType} from "@/types";
import {i18n} from "@/language";

interface SetProps {
	theme: string;
	language: LanguageType;
}

const Set = memo((props: SetProps) => {

	const {theme, language} = props

	const [isShow, setIsShow] = useState<boolean>(false)

	const {lightOffMaskEle, videoELe} = useContext(VideoContext)

	const handleMoveEnter = () => {
		setIsShow(true)
	}

	const handleMoveLeave = () => {
		setIsShow(false)
	}

	const handleLightOff = (status: boolean) => {
		if (lightOffMaskEle) {
			lightOffMaskEle.style.display = !status ? 'block' : 'none';
		}
	}

	const handleLoop = (status: boolean) => {
		if (videoELe) {
			videoELe.loop = !status;
		}
	}

	return (
		<div
			className={styles.setContainer}
			onMouseEnter={handleMoveEnter}
			onMouseLeave={handleMoveLeave}
		>
			<div className={styles.setIconContainer}>
				<SvgIcon iconClass={'set'} fill={'#fff'} fontSize={'20px'} className={styles.setIcon}/>
			</div>
			<div
				className={styles.setItemContainer}
				style={{opacity: isShow ? '1' : '0', visibility: isShow ? 'visible' : 'hidden'}}
			>
				<ul className={styles.setItemList}>
					<li className={styles.setItem}>
						<Switch label={i18n(language, 'light')} theme={theme} onChange={handleLightOff}/>
					</li>
					<li className={styles.setItem}>
						<Switch label={i18n(language, 'loop')} theme={theme} onChange={handleLoop}/>
					</li>
				</ul>
			</div>
		</div>
	)
})

export default Set;