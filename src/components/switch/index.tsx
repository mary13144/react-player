import React, {memo, useMemo, useState} from "react";
import styles from './index.module.scss'

interface SwitchProps{
	label:string;
	onChange:(status:boolean)=>void;
	theme:string;
}

let switchId = 0

const Switch = memo((props:SwitchProps)=>{

	const {label,onChange,theme} = props

	const [status,setStatus] = useState<boolean>(false)

	const id = useMemo(() => {
		return label+switchId++
	}, [label]);

	const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
		e.stopPropagation()
		setStatus(prevState => !prevState)
		onChange?.(status)
	}

	const switchValue = useMemo(()=>{
		return status ? 'true' : 'false'
	},[status])

	return (
		<div className={styles.switchContainer}>
			<label htmlFor={id} className={styles.switchLabel}>
				{label}
			</label>
			<input
				id={id}
				className={styles.switch}
				style={{backgroundColor:status ? theme : '#7f8c8d'}}
				type='checkbox'
				onChange={handleChange}
				value={switchValue}
			/>
		</div>
	)
})

export default Switch