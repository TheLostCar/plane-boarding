import { PassengerStowSpeeds, PassengerWalkSpeeds } from "@models/Passenger.types";
import { PlaneState } from "@models/PlaneState.types";
import randomEnumValue from "util/randomEnumValue";
import reverseSubArrays from "util/reverseSubArrays";
import shuffleSubArrays from "util/shuffleSubArrays";
import Passenger from "./Passenger";

export default function generatePassengers(planeState: PlaneState) {
    const { seatList, totalGroups, shuffleGroupMembers, reverse, randomStowType, randomWalkType } = planeState
    const result: Passenger[][] = new Array(totalGroups).fill(0).map(() => [])

    for (let i = 0, newPassenger; i < seatList.length; i++) {
        newPassenger = new Passenger(
            seatList[i].color,
            seatList[i],
            {
                baseStowingTicks: planeState.baseStowingTicks,
                baseWalkSpeed: planeState.baseWalkSpeed,
            });

        if (randomWalkType) newPassenger.walkType = randomEnumValue(PassengerWalkSpeeds);
        if (randomStowType) newPassenger.stowType = randomEnumValue(PassengerStowSpeeds);

        result[seatList[i].group - 1].push(newPassenger)

    }
    if (shuffleGroupMembers) shuffleSubArrays(result);
    if (!reverse) reverseSubArrays(result);

    return result.flat()

}

