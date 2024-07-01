import {memo, useContext, useMemo, useState} from "react";
import styles from './index.module.scss'
import {VideoContext} from "@/core/context";
import {i18n} from "@/language";
import useToast from "@/components/toast/useToast.ts";
import {LanguageType} from "@/types";

const multipleList = [
	{id: 0.5, name: '0.5x'},
	{id: 0.75, name: '0.75x'},
	{id: 1.0, name: '1.0x'},
	{id: 1.25, name: '1.25x'},
	{id: 1.5, name: '1.5x'},
	{id: 2, name: '2.0x'},
];

interface MultipleProps {
	theme: string;
	language: LanguageType;
}

const Multiple = memo((props: MultipleProps) => {
	const {theme, language} = props
	const {
		videoMethod,
		videoOption,
		videoAttributes
	} = useContext(VideoContext)
	const {multiple} = videoAttributes!
	const {isShowToast, toastPosition} = videoOption!
	const [isShow, setIsShow] = useState<boolean>(false)
	const multipleName = useMemo(() => {
		return multipleList.find(item => item.id === multiple)?.name
	}, [multiple])

	const handleMoveEnter = () => {
		setIsShow(true)
	}

	const handleMoveLeave = () => {
		setIsShow(false)
	}
	const {showToast} = useToast()
	const handleClick = (rate: number, rateName: string) => {
		videoMethod?.setPlayRate(rate)
		isShowToast !== false && showToast({
			message: (
				<div>
					{i18n(language, 'multipleSwitch')}&nbsp;
					<strong style={{color: theme}}>{rateName}</strong>
				</div>
			),
			position: toastPosition
		})
	}

	return (
		<div
			className={styles.multipleContainer}
			onMouseEnter={handleMoveEnter}
			onMouseLeave={handleMoveLeave}
		>
			<div className={styles.multipleText}>
				{multipleName}
			</div>
			<div
				className={styles.multipleSelectContainer}
				style={{opacity: isShow ? '1' : '0', visibility: isShow ? 'visible' : 'hidden'}}
			>
				<ul className={styles.multipleSelectList}>
					{multipleList.map(item => {
						return (
							<li
								key={item.id}
								className={styles.multipleSelectItem}
								style={{color: item.id === multiple ? theme : 'rgba(256, 256, 256, 0.7)'}}
								onClick={() => handleClick(item.id, item.name)}
							>
								{item.name}
							</li>
						)
					})}
				</ul>
			</div>


		</div>
	)
})

export default Multiple