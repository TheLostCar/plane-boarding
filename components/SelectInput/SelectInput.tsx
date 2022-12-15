import { MouseEvent, useEffect, useState } from "react";
import styles from './SelectInput.module.scss'

type Props = {
    possibleValues: string[];
    displayValues: string[]
    defaultValue: number
    onChange: (v: string) => void;
}

function SelectInput({ possibleValues, displayValues, defaultValue, onChange }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [value, setValue] = useState(defaultValue);
    const toggleOpen = () => setIsOpen(v => !v);

    useEffect(() => {
        const timeout = setTimeout(() => onChange(possibleValues[value]), 550)

        return () => {
            clearTimeout(timeout)
        }
    }, [value, onChange, possibleValues])

    const handleClick = (e: MouseEvent, i: number) => {
        e.preventDefault();
        e.stopPropagation();
        setValue(i)
        setIsOpen(false);

    }

    const closeMenu = () => setIsOpen(false);

    useEffect(() => {
        const handleMouseDown = () => {
            setIsOpen(false);
        }
        window.addEventListener('mousedown', handleMouseDown);

        return () => {
            window.removeEventListener('mousedown', handleMouseDown)
        }
    }, [])

    return (
        <div className={styles.container}>
            <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                onMouseDown={e => e.stopPropagation()}

                className={styles.toggleOpenButton}
                onClick={() => toggleOpen()}
            >
                {displayValues[value]}
            </button>

            <ul className={`${styles.options} ${isOpen ? styles.optionsOpen : styles.optionsClose}`} onMouseLeave={closeMenu}>
                {
                    displayValues.map((v, i) => (
                        <button
                            key={i}
                            className={styles.option}
                            onMouseDown={e => e.stopPropagation()}
                            onClick={(e: MouseEvent) => handleClick(e, i)}

                        >
                            {v}
                        </button>
                    ))
                }
            </ul>
        </div >
    );
}

export default SelectInput;