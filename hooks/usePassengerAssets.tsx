import { useCallback, useEffect, useRef } from "react";

export enum Assets {
    passengerRight = 'passengerRight',
    passengerLeft = 'passengerLeft',
    passengerRightHappy = 'passengerRightHappy',
    passengerLeftHappy = 'passengerLeftHappy',
    briefcase = 'briefcase',
    seat = 'seat'
}
type SeatValues = {
    seatNumber: number
}

type BriefcaseValues = {
    rotation: number,
    opacity: number
}
export type DrawAssetsType = {
    (ctx: CanvasRenderingContext2D, assetName: Exclude<Assets, Assets.seat | Assets.briefcase>, x: number, y: number, fillColor: string): void
    (ctx: CanvasRenderingContext2D, assetName: Assets.seat, x: number, y: number, fillColor: string, seatValues: SeatValues): void
    (ctx: CanvasRenderingContext2D, assetName: Assets.briefcase, x: number, y: number, fillColor: string, briefcaseValues: BriefcaseValues): void

};
export const defaultDrawAsset = () => { return };


type refAssets = {
    luggage: HTMLCanvasElement,
    passengerNormal: HTMLCanvasElement,
    passengerSmile: HTMLCanvasElement
}
const usePassengerAssets = (size: number) => {
    const assets = useRef<refAssets | null>(null);

    useEffect(() => {
        assets.current = {
            luggage: document.createElement('canvas'),
            passengerNormal: document.createElement('canvas'),
            passengerSmile: document.createElement('canvas')
        }
    }, [])

    useEffect(() => {
        if (assets.current === null) return;
        console.log(`reconstruct asset canvas at size:   ${size}`);

        for (const [key, value] of Object.entries(assets.current)) {
            [value.width, value.height] = [size, size]

            const ctx = value.getContext('2d');
            if (ctx === null) return;
            if (key === 'luggage') drawCase(ctx, size, 0);
            if (key === 'passengerNormal') drawPassengerOutline(ctx, size, 0, 'normal');
            if (key === 'passengerSmile') drawPassengerOutline(ctx, size, 0, 'smile');
        }

    }, [size])

    const fillPassenger = useCallback(
        function (ctx: CanvasRenderingContext2D, x: number, y: number) {
            ctx.beginPath()
            ctx.arc(x, y, size / 2, 0, Math.PI * 2)
            ctx.fill()
        }, [size]
    )

    const fillBase = useCallback(
        function (ctx: CanvasRenderingContext2D, x: number, y: number) {
            const halfWidth = size * .375;
            const halfHeight = size * .25;
            const x1 = x - halfWidth;
            const x2 = x + halfWidth
            const y1 = y - halfHeight;
            const y2 = y + halfHeight
            const r = size * .1

            ctx.save()
            ctx.beginPath()
            roundedRectangles(ctx, x1, y1, x2, y2, r)
            ctx.fill()
            ctx.restore()
        }, [size])

    const drawAsset: DrawAssetsType = useCallback(
        (ctx: CanvasRenderingContext2D, assetName: Assets, x: number, y: number, fillColor: string, extraValue?: { [key: string]: number }) => {
            if (assets.current === null) return;

            let [dx, dy] = [x - size / 2, y - size / 2]; //coords of top left corner
            let canvas = null;
            const [width, height] = [size, size]
            ctx.save()
            switch (assetName) {
                case Assets.passengerRight:
                    canvas = assets.current.passengerNormal;
                    ctx.fillStyle = fillColor || 'yellow';
                    fillPassenger(ctx, x, y)
                    break;

                case Assets.passengerLeft:
                    canvas = assets.current.passengerNormal;
                    ctx.fillStyle = fillColor || 'yellow';

                    fillPassenger(ctx, x, y)

                    ctx.translate(dx, dy);
                    [dx, dy] = [0 - size, 0];
                    ctx.scale(-1, 1)
                    break;

                case Assets.passengerRightHappy:
                    canvas = assets.current.passengerSmile;
                    ctx.fillStyle = fillColor || 'yellow';
                    fillPassenger(ctx, x, y)
                    break;

                case Assets.passengerLeftHappy:
                    canvas = assets.current.passengerSmile;
                    ctx.fillStyle = fillColor || 'yellow';
                    fillPassenger(ctx, x, y);
                    ctx.translate(dx, dy);
                    [dx, dy] = [0 - size, 0];
                    ctx.scale(-1, 1)
                    break;

                case Assets.briefcase: {
                    canvas = assets.current.luggage;
                    if (extraValue?.rotation === undefined) return;
                    if (extraValue.opacity === undefined) return;
                    const { rotation, opacity } = extraValue;

                    ctx.fillStyle = fillColor || '#8b4100'
                    ctx.translate(dx, dy);
                    ctx.translate(size / 2, size / 2);
                    ctx.globalAlpha = opacity;

                    ctx.rotate(rotation);
                    fillBase(ctx, 0, 0);
                    [dx, dy] = [-size / 2, -size / 2];
                    break;
                }
                case Assets.seat: {
                    if (extraValue?.seatNumber === undefined) return;
                    const seatNumber = extraValue.seatNumber;

                    drawSeat(size, ctx, x, y, fillColor, seatNumber)
                    return;
                }
            }

            if (canvas === null) return;
            ctx.drawImage(canvas, 0, 0, width, height, dx, dy, width, height);
            ctx.restore()
        }, [size, fillBase, fillPassenger])

    return {
        drawAsset
    }
}





export function drawSeat(size: number, ctx: CanvasRenderingContext2D, x: number, y: number, color: string, groupNumber: number) {
    ctx.save();

    ctx.strokeStyle = 'black';
    ctx.fillStyle = color;
    ctx.lineWidth = .12 * size;

    ctx.save() // remove clipping rect from roundRectangles
    drawCushion(ctx, size, x - size / 2, y - size / 2);
    drawGroupNumber()
    ctx.restore()// remove clipping rect from roundRectangles

    drawSeatLumbarSupport(ctx, size, x + size * 0.02, y - size / 1.6);

    ctx.restore();

    function drawGroupNumber() {
        ctx.save()
        ctx.fillStyle = 'white'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle';
        ctx.font = `bold ${50 * (size / 100)}px Lato`;
        ctx.fillText("" + groupNumber, x, y)
        ctx.restore()
    }

    function drawSeatLumbarSupport(ctx: CanvasRenderingContext2D, size: number, offsetX: number, offsetY: number) {
        const distancefromVerticleEdges = .02 * size; //support is slightly shorter than height 
        const x1 = .375 * size + offsetX
        const y1 = distancefromVerticleEdges + offsetY;
        const x2 = .625 * size + offsetX
        const y2 = size - distancefromVerticleEdges + offsetY;
        const r = size * 0.09375

        ctx.save();
        ctx.beginPath();

        roundedRectangles(ctx, x1, y1, x2, y2, r);
        ctx.fill();
        ctx.stroke();
    }
    function drawCushion(ctx: CanvasRenderingContext2D, size: number, offsetX: number, offsetY: number) {
        const x1 = offsetX;
        const y1 = offsetY;
        const x2 = size + offsetX;
        const y2 = size + offsetY
        const r = size / 8;

        ctx.beginPath()
        roundedRectangles(ctx, x1, y1, x2, y2, r)
        ctx.fill()
        ctx.stroke()
    }

}

// used for drawing on second canvas on background, seat is not saved to assets canvas
function drawCase(ctx: CanvasRenderingContext2D, size: number, offsetX: number) {
    drawBase(size, offsetX);
    drawBagLine(size, offsetX)
    drawHandle(size, offsetX)

    function drawHandle(size: number, offsetX: number) {
        ctx.save()
        ctx.beginPath()

        const leftX = offsetX + size * .35;
        const rightX = offsetX + size * .65;
        const bottomY = size * .325
        const topCurveHeight = size * .155;
        const outerCurveWidth = size * .06;

        const innerCurveHeight = size * .08
        const innerCurveWidth = size * .09
        const outerCurveStraightHeight = size * .06

        const handleWidth = size * .05;

        ctx.moveTo(leftX, bottomY);
        ctx.lineTo(leftX, bottomY)
        ctx.lineTo(leftX, bottomY - outerCurveStraightHeight)
        ctx.quadraticCurveTo(leftX, bottomY - topCurveHeight, leftX + outerCurveWidth, bottomY - topCurveHeight)


        ctx.lineTo(rightX - outerCurveWidth, bottomY - topCurveHeight)
        ctx.quadraticCurveTo(rightX, bottomY - topCurveHeight, rightX, bottomY - outerCurveStraightHeight)

        ctx.lineTo(rightX, bottomY)
        ctx.lineTo(rightX - handleWidth, bottomY)
        ctx.lineTo(rightX - handleWidth, bottomY)
        ctx.quadraticCurveTo(rightX - handleWidth, bottomY - innerCurveHeight, rightX - innerCurveWidth, bottomY - innerCurveHeight)

        ctx.lineTo(leftX + innerCurveWidth, bottomY - innerCurveHeight)
        ctx.quadraticCurveTo(leftX + handleWidth, bottomY - innerCurveHeight, leftX + handleWidth, bottomY)
        ctx.lineTo(leftX + handleWidth, bottomY)



        ctx.lineWidth = size * 0.025
        ctx.fillStyle = '#AFAEB0'
        ctx.strokeStyle = '#000'

        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        ctx.restore()
    }


    function drawBase(size: number, offsetX: number) {
        const x1 = offsetX + size * .125;
        const x2 = size * .875 + offsetX
        const y1 = size * .25;
        const y2 = size * .75
        const r = size * .1
        ctx.save()

        ctx.lineWidth = size * .1
        ctx.beginPath()


        ctx.beginPath()
        ctx.strokeStyle = 'black'
        roundedRectangles(ctx, x1, y1, x2, y2, r)
        ctx.stroke()

        ctx.restore()
    }

    function drawBagLine(size: number, offsetX: number) {
        const x1 = offsetX + size * .22;
        const x2 = offsetX + size * .78;
        const y1 = size * .36;
        const y2 = y1 + size * .03;
        const r = size / 80;

        ctx.save()
        ctx.fillStyle = 'black'
        ctx.beginPath();
        roundedRectangles(ctx, x1, y1, x2, y2, r);
        ctx.fill();
        ctx.restore()
    }
}

function roundedRectangles(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, r: number) {
    const pi = Math.PI
    ctx.beginPath()
    ctx.arc(x1 + r, y1 + r, r, pi, 1.5 * pi);  // upper left corner
    ctx.arc(x2 - r, y1 + r, r, 1.5 * pi, 0);   // upper right corner
    ctx.arc(x2 - r, y2 - r, r, 0, 0.5 * pi);   // lower right corner
    ctx.arc(x1 + r, y2 - r, r, 0.5 * pi, pi);  // lower left corner
    ctx.closePath()
    ctx.clip()
}

function drawPassengerOutline(ctx: CanvasRenderingContext2D, size: number, offsetX: number, face: 'normal' | 'smile' = 'normal') {
    ctx.save()
    ctx.fillStyle = 'black'
    ctx.strokeStyle = 'black'

    drawBorder(size, offsetX)
    drawEyes(size, offsetX)
    if (face === 'normal') drawMouth(size, offsetX); else drawSmile(size, offsetX)
    ctx.restore()

    function drawBorder(size: number, offsetX: number) {
        ctx.beginPath()
        const centerX = (size / 2) + offsetX
        ctx.arc(centerX, size / 2, size / 2, 0, Math.PI * 2)
        ctx.lineWidth = .15 * size //  appears as .075 * size due to clipping
        ctx.clip()
        ctx.stroke()
        ctx.closePath()
    }

    function drawEyes(size: number, offsetX: number) {
        ctx.beginPath()
        const eyeRadius = size / 12
        const distanceFromTop = size * .4;

        const distanceFromCenter = size / 2.7;
        const centerX = (size / 2) + offsetX;


        ctx.arc(centerX + distanceFromCenter, distanceFromTop, eyeRadius, 0, Math.PI * 2)
        ctx.arc(centerX, distanceFromTop, eyeRadius, 0, Math.PI * 2) //center eye
        ctx.fill()
    }

    function drawSmile(size: number, offsetX: number) {
        ctx.beginPath()
        const distanceFromEdge = size * .13
        const centerX = (size / 2) + offsetX
        const controlPointHeight = size * .22
        const controlPointOffsetX = size * .07

        const x1 = centerX - size * .04;
        const x2 = offsetX + size - distanceFromEdge


        const y = size * .6;

        ctx.lineCap = 'round'
        ctx.lineWidth = size * .06
        ctx.moveTo(x1, y)

        ctx.bezierCurveTo(x1 + controlPointOffsetX, y + controlPointHeight, x2 - controlPointOffsetX, y + controlPointHeight, x2, y)
        ctx.stroke()
    }
    function drawMouth(size: number, offsetX: number) {
        ctx.beginPath()
        const distanceFromCenter = size * 0.06;
        const centerX = (size / 2) + offsetX

        const x1 = centerX + distanceFromCenter;
        const x2 = offsetX + size

        const y = size * .73;

        ctx.lineCap = 'round'
        ctx.lineWidth = size * .06
        ctx.moveTo(x1, y)
        ctx.lineTo(x2, y)
        ctx.stroke()
    }

}

export default usePassengerAssets;