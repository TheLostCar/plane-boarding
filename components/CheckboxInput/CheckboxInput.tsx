import React, { KeyboardEvent, useEffect, useRef, useState } from "react";
import styles from './CheckboxInput.module.scss'

type Props = {
    defaultState: boolean;
    name: string;
    onChange: (checked: boolean) => void;
}

const CheckboxInput = ({ defaultState, name, onChange }: Props) => {
    const [checked, setChecked] = useState(defaultState)
    const [height, setHeight] = useState<number>(0)

    const labelRef = useRef<HTMLLabelElement>(null)

    const handleClick = () => {
        setChecked(prevState => !prevState)

    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') handleClick();
    }


    useEffect(() => {
        const timeout = setTimeout(() => onChange(checked), 550)
        if (labelRef.current === null) return;

        return () => {
            clearTimeout(timeout);
        }
    }, [checked, onChange])

    useEffect(() => {
        if (labelRef.current?.clientHeight === undefined) return;
        setHeight(labelRef.current?.clientHeight)
    }, [labelRef.current?.clientHeight])

    return (
        <label htmlFor={name} ref={labelRef} className={styles.label} onClick={handleClick} onPointerDown={e => e.stopPropagation()}>{name}
            <div style={{ width: height + 'px' }} className={styles.checkboxWrapper}>
                <span className={`${styles.checkbox} ${checked && styles.checked || ''}`}></span>
            </div>
            <input type="checkbox" name={name} className={styles.hidden} onKeyDown={handleKeyDown} checked={checked} readOnly />
        </label>
    );
}

export default React.memo(CheckboxInput);