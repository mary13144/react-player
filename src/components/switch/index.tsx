import React, {memo, useEffect, useMemo, useRef, useState} from "react";
import styles from './index.module.scss'

interface SwitchProps {
	valueInit: boolean;
	label: string;
	onChange: (status: boolean) => void;
	theme: string;
}

let switchId = 0

const Switch = memo((props: SwitchProps) => {

	const {valueInit, label, onChange, theme} = props

	const [status, setStatus] = useState<boolean>(valueInit)

	const switchRef = useRef<HTMLInputElement>(null)

	const id = useMemo(() => {
		return label + switchId++
	}, [label]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.stopPropagation()
		setStatus(prevState => !prevState)
		onChange?.(status)
	}

	const switchValue = useMemo(() => {
		return status ? 'true' : 'false'
	}, [status])

	useEffect(() => {
		if (switchRef.current && valueInit) {
			switchRef.current.checked = valueInit
		}
	}, []);

	return (
		<div className={styles.switchContainer}>
			<label htmlFor={id} className={styles.switchLabel}>
				{label}
			</label>
			<input
				ref={switchRef}
				id={id}
				className={styles.switch}
				style={{backgroundColor: status ? theme : '#7f8c8d'}}
				type='checkbox'
				onChange={handleChange}
				value={switchValue}
			/>
		</div>
	)
})

export default Switch