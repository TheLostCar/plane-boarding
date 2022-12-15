import { PlaneState } from "@models/PlaneState.types";

export default function updateSeatPositions(height: number, width: number, planeState: PlaneState) {
    if (planeState.seatList.length === 0) return;

    const { size, rows, cols, distanceBetweenCols, distanceBetweenRows, seatList } = planeState
    let currentX = size * 2;
    let currentY = (height / 2) - ((distanceBetweenCols) * ((cols / 2) + 1));// extra one is from the walking space in the center

    for (let col = 0; col < cols; col++) {// top to bottom 
        // cols are the horizontal stretch of seats due to the rotated view of the plane
        currentY += distanceBetweenCols;

        currentX = size * 2;
        if (col === cols / 2) currentY += distanceBetweenCols;

        for (let row = 0; row < rows; row++) {//left to right

            const x = currentX;
            const y = currentY;
            seatList[col * rows + row].update({ x, y })
            currentX += distanceBetweenRows;

        }
    }
}