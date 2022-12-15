import { SyntheticEvent, useCallback, useEffect, useRef, useState } from "react";
import { DownArrow, UpArrow } from "@components/Arrows";
import styles from './NumberInput.module.scss'

type Props = {
    name: string
    label: string
    title?: string
    defaultValue: number;
    step: number;
    min: number;
    max?: number;
    onChange: (v: number) => void;
}
const NumberInput = ({ name, label, title, defaultValue, step, min, max = Infinity, onChange }: Props) => {
    const [value, setValue] = useState(defaultValue);
    const inputRef = useRef<HTMLInputElement>(null);

    const minMaxCheck = useCallback((v: number, step = 0) => {
        if (v + step <= min) return min;
        if (v + step >= max) return max;
        return v + step;
    }, [min, max])

    useEffect(() => {
        const removeShake = () => inputRef.current?.classList.remove(styles.shake);
        const removeShakeTimeout = setTimeout(() => { removeShake() }, 1000);
        let changeTimeout: NodeJS.Timeout | undefined;

        if (value !== minMaxCheck(value)) {
            setValue(s => minMaxCheck(s));
            inputRef.current?.classList.add(styles.shake);

        } else {
            changeTimeout = setTimeout(() => onChange(value), 300);
        }

        return () => {
            clearTimeout(changeTimeout)
            clearTimeout(removeShakeTimeout)
        }
    }, [value, minMaxCheck, max, min, onChange])

    const stepUp = () => setValue(s => s + step);
    const stepDown = () => setValue(s => s - step);

    return (
        <div className={styles.container}>
            <label htmlFor={name} style={{ flex: 1, flexBasis: "100%", flexGrow: 12 }} title={title}>{label}</label>
            <div className={styles.wrapper}>

                <DownArrow name={`${name}-downArrow`}
                    onClick={(e?: SyntheticEvent) => {
                        e?.preventDefault()
                        stepDown()
                    }}
                />

                <div className={styles.inputWrapper} >

                    <input
                        name={name}
                        id={name}
                        ref={inputRef}
                        className={styles.input}
                        onPaste={e => e.preventDefault()}
                        onPointerDown={e => e.stopPropagation()}
                        onKeyDown={(e) => {
                            switch (e.key) {
                                case 'Backspace':
                                case 'ArrowLeft':
                                case 'ArrowRight':
                                case 'Tab':
                                case '1':
                                case '2':
                                case '3':
                                case '4':
                                case '5':
                                case '6':
                                case '7':
                                case '8':
                                case '9':
                                    return;

                                case 'ArrowUp': return stepUp();
                                case 'ArrowDown': return stepDown();

                            }
                            e.preventDefault()
                        }}
                        onChange={e => setValue(minMaxCheck(+e.target.value))}
                        type="text"
                        size={3}
                        value={value}
                    />
                </div>

                <UpArrow name={`${name}-upArrow`} onClick={(e?: SyntheticEvent) => {
                    e?.preventDefault()
                    stepUp()
                }}
                />
            </div>
        </div>
    );
}

export default NumberInput;