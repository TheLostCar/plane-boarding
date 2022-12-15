import { PlaneState } from "@models/PlaneState.types";
import { PassengerActions } from "@models/Passenger.types";

export default function PassengersToStartingPosition(height: number, planeState: PlaneState) {
    const { size, passengerList } = planeState;
    let currentX = size / 2
    for (let i = 0; i < passengerList.length; i++) {
        passengerList[i].nextState(PassengerActions.RESET);
        passengerList[i].reset()

        passengerList[i].pos.x = currentX;
        passengerList[i].pos.y = height / 2
        passengerList[i].updateLuggagePos(size);
        currentX -= size * 1.5
    }
}