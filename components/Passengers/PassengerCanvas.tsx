import useCanvas from "@hooks/useCanvas";
import { Assets, DrawAssetsType } from "@hooks/usePassengerAssets";
import { PlaneState, PlayStates } from "@models/PlaneState.types";
import Passenger from "./Passenger";
import degreesToRadians from "util/degreesToRadians";

type Props = {
    drawAsset: DrawAssetsType,
    passengerList: Passenger[],
    planeState: PlaneState
}

const PassengerCanvas = ({ drawAsset, passengerList, planeState }: Props) => {
    const { playState } = planeState
    const draw = (ctx: CanvasRenderingContext2D) => {
        ctx.save()
        // passenger loop keep track of the most recent stowing passenger to act as block for remaining passengers
        for (let i = 0, frontNeighbor: Passenger | null = null; i < passengerList.length; i++) {
            const passenger = passengerList[i]
            if (playState === PlayStates.PLAY) {
                frontNeighbor = passenger.update(frontNeighbor, planeState)
            }
            drawAsset(ctx, Assets[`passenger${passenger.facing}`], passenger.pos.x, passenger.pos.y, passenger.color)
            drawAsset(ctx, Assets.briefcase, passenger.luggagePos.x, passenger.luggagePos.y, '', {
                rotation: degreesToRadians(passenger.luggageRotation),
                opacity: passenger.luggageOpacity
            })

        }
        ctx.restore()
    }

    const canvasRef = useCanvas(draw)

    return (
        <canvas ref={canvasRef}></canvas>
    );
}

export default PassengerCanvas;