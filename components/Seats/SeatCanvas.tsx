import React, { useCallback, useEffect, useRef } from "react";
import updateSeatPositions from "./updateSeatPositions";
import { Assets, DrawAssetsType } from "@hooks/usePassengerAssets";
import { PlaneState } from "@models/PlaneState.types";
import Seat from "@models/Seat.types";

type PlaneProps = {
    seatList: Seat[];
    drawAsset: DrawAssetsType;
    planeState: PlaneState
}

const SeatCanvas = ({ seatList, drawAsset, planeState }: PlaneProps) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    const drawSeats = useCallback(
        (ctx: CanvasRenderingContext2D) => {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            for (let i = 0; i < seatList.length; i++) {
                drawAsset(ctx, Assets.seat, seatList[i].pos.x, seatList[i].pos.y, seatList[i].color, { seatNumber: seatList[i].group });
            }
        },
        [drawAsset, seatList]
    )

    useEffect(() => {
        if (canvasRef.current === null) return;
        const canvas = canvasRef.current
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        canvas.width = canvas.parentElement?.clientWidth || document.documentElement.clientWidth;
        canvas.height = canvas.parentElement?.clientHeight || document.documentElement.clientHeight;
        const onResize = () => {
            canvas.width = canvas.parentElement?.clientWidth || document.documentElement.clientWidth;
            canvas.height = canvas.parentElement?.clientHeight || document.documentElement.clientHeight;
            drawSeats(ctx);
        }
        updateSeatPositions(ctx.canvas.height, ctx.canvas.height, planeState);
        drawSeats(ctx);
        window.addEventListener('resize', onResize)
        return () => {
            window.removeEventListener('resize', onResize)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [seatList, drawAsset, planeState.size, drawSeats])

    return <canvas ref={canvasRef}></canvas>;
}

export default SeatCanvas;