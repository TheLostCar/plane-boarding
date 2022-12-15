import { useRef, useEffect } from 'react'

const useCanvas = (draw: (ctx: CanvasRenderingContext2D, dt: number) => void) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas: HTMLCanvasElement = canvasRef.current;

        canvas.width = canvas.parentElement?.clientWidth || document.documentElement.clientWidth;
        canvas.height = canvas.parentElement?.clientHeight || document.documentElement.clientHeight;

        const ctx = canvas.getContext('2d');

        if (!ctx) return;


        const onResize = () => {
            canvas.width = canvas.parentElement?.clientWidth || document.documentElement.clientWidth;
            canvas.height = canvas.parentElement?.clientHeight || document.documentElement.clientHeight;
        }
        window.addEventListener('resize', onResize)

        let animationFrameId: number

        const render = (timestamp: number, previousTimestamp: number) => {
            const deltaTime = timestamp - previousTimestamp

            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            draw(ctx, deltaTime)


            animationFrameId = window.requestAnimationFrame((timestamp) => render(timestamp, previousTimestamp))

            previousTimestamp = timestamp
        }

        // on first render - timestamp === previousTimestamp
        window.requestAnimationFrame((timestamp) => render(timestamp, timestamp))

        return () => {
            window.cancelAnimationFrame(animationFrameId)
            window.removeEventListener('resize', onResize)
        }
    }, [draw])

    return canvasRef
}

export default useCanvas