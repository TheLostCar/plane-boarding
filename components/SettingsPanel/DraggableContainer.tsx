import { PointerEvent as ReactPointerEvent, ReactNode, RefObject, useEffect, useState } from 'react'
import styles from './SettingsPanel.module.scss'

type Props = {
    children: ReactNode,
    x: number,
    y: number
    ref?: RefObject<HTMLDivElement>
    className?: string
}
const DraggableContainer = ({ children, x, y, className = '', ref }: Props) => {
    const [pos, setPos] = useState({
        x: x,
        y: y
    })
    const [clicked, setClicked] = useState<boolean>(false);

    function handleStartDrag(e: ReactPointerEvent) {
        e.stopPropagation()
        setClicked(true)
    }
    function handleEndDrag() { setClicked(false) }

    const handleDrag = (e: PointerEvent) => {
        if (clicked === false) return;
        e.preventDefault()
        e.stopPropagation()
        setPos((prev) => ({
            x: prev.x - e.movementX,
            y: prev.y + e.movementY
        }))
    }

    useEffect(() => {
        window.addEventListener('pointermove', handleDrag);
        window.addEventListener('pointerup', handleEndDrag);
        window.addEventListener('pointercancel', handleEndDrag);
        return () => {
            window.removeEventListener('pointermove', handleDrag);
            window.removeEventListener('pointerup', handleEndDrag);
            window.removeEventListener('pointercancel', handleEndDrag);
        }
    })

    return (
        <div
            className={`${styles.container} ${className}`}
            onPointerDown={handleStartDrag}
            ref={ref}
            style={{ right: pos.x, top: pos.y }}
        >
            {children}
        </div>
    );
}

export default DraggableContainer;