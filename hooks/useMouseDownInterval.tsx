import { PointerEvent, useRef } from "react"

const usePointerInterval = (callback: (e: PointerEvent) => void, delay: number, frequency: number) => {
    const timeout = useRef<NodeJS.Timeout>()
    const interval = useRef<NodeJS.Timer>()

    const handleStartInterval = (e: PointerEvent) => {
        e.stopPropagation();
        callback(e)
        timeout.current = setTimeout(() => {
            interval.current = setInterval(() => { callback(e) }, frequency)
        }, delay)
    }
    const handleCancelInterval = (e: PointerEvent) => {
        e.stopPropagation();
        clearTimeout(timeout.current);
        clearInterval(interval.current)
    }


    return [handleStartInterval, handleCancelInterval];
}

export default usePointerInterval;