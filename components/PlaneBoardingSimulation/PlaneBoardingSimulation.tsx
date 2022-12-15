import PassengersToStartingPosition from "@components/Passengers/passengersToStartingPositions";
import PassengerCanvas from "@components/Passengers/PassengerCanvas";
import SeatCanvas from "@components/Seats/SeatCanvas";
import { DrawAssetsType } from "@hooks/usePassengerAssets";
import { PlaneState, PlayStates } from "@models/PlaneState.types";
import { useEffect } from "react";

type Props = {
    planeState: PlaneState,
    drawAsset: DrawAssetsType
}
const PlaneBoardingSimulation = ({ planeState, drawAsset }: Props) => {
    const { seatList, passengerList, playState } = planeState

    useEffect(() => {
        PassengersToStartingPosition(document.documentElement.clientHeight, planeState)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [seatList, passengerList])

    useEffect(() => {
        if (playState === PlayStates.IDLE) PassengersToStartingPosition(document.documentElement.clientHeight, planeState);
    }, [playState, planeState])

    return (
        <>
            <SeatCanvas seatList={seatList} drawAsset={drawAsset} planeState={planeState} />
            <PassengerCanvas passengerList={passengerList} drawAsset={drawAsset} planeState={planeState} />
        </>
    );
}

export default PlaneBoardingSimulation;