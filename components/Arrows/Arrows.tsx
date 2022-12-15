import useMouseDownInterval from "@hooks/useMouseDownInterval";
import { KeyboardEvent, MouseEvent, SyntheticEvent } from "react";
import styles from './Arrows.module.scss'

type Props = {
    onClick: (e?: SyntheticEvent) => void;
    name: string
}

export const DownArrow = ({ onClick, name }: Props) => {
    const [handleStartInterval, handleCancelInterval] = useMouseDownInterval(onClick, 150, 75)

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') onClick();
    }

    return (
        <button
            name={name}
            onClick={(e: MouseEvent) => { e.preventDefault(); e.stopPropagation() }}

            onKeyDown={handleKeyDown}

            onPointerDown={handleStartInterval}
            onPointerUp={handleCancelInterval}
            onPointerLeave={handleCancelInterval}
            onPointerCancel={handleCancelInterval}

            className={styles.arrow}
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 330 330">
                <path name="up" d="M325.607 79.393c-5.857-5.857-15.355-5.858-21.213.001l-139.39 139.393L25.607 79.393c-5.857-5.857-15.355-5.858-21.213.001-5.858 5.858-5.858 15.355 0 21.213l150.004 150a14.999 14.999 0 0 0 21.212-.001l149.996-150c5.859-5.857 5.859-15.355.001-21.213z" />
            </svg>
            <div className={styles.srOnly}>{name}</div>
        </button>
    );
}


export const UpArrow = ({ onClick, name }: Props) => {
    const [handleStartInterval, handleCancelInterval] = useMouseDownInterval(onClick, 150, 75)

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') onClick();
    }
    return (
        <button
            name={name}
            onKeyDown={handleKeyDown}

            onPointerDown={handleStartInterval}
            onPointerUp={handleCancelInterval}
            onPointerLeave={handleCancelInterval}
            onPointerCancel={handleCancelInterval}

            className={styles.arrow}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 330 330" style={styles}>
                <path name="down" d="m325.606 229.393-150.004-150a14.997 14.997 0 0 0-21.213.001l-149.996 150c-5.858 5.858-5.858 15.355 0 21.213 5.857 5.857 15.355 5.858 21.213 0l139.39-139.393 139.397 139.393A14.953 14.953 0 0 0 315 255a14.95 14.95 0 0 0 10.607-4.394c5.857-5.858 5.857-15.355-.001-21.213z" />
            </svg>
            <div className={styles.srOnly}>{name}</div>
        </button>
    );
}
