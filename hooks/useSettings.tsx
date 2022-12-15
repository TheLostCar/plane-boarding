import { useReducer } from "react";
import generateSeats from "@components/Seats/generateSeats";
import generatePassengers from "@components/Passengers/generatePassengers";
import { ActionTypes, BoardingMethods, PlaneState, PlaneStateActions, PlayStates } from "@models/PlaneState.types";

export const defaultState: PlaneState = {
    size: 100,
    distanceBetweenCols: 100 * 1.1,
    distanceBetweenRows: 100 * 1.5,
    totalGroups: 3,
    groupsPerCol: 3,
    groupsPerRow: 4,

    largeGroupRatio: .66,
    rows: 6,
    cols: 6,
    passengerList: [],
    seatList: [],
    boardingMethod: BoardingMethods.BACK_TO_FRONT,
    shuffleGroupMembers: true,
    reverse: false,
    playState: PlayStates.IDLE,

    randomStowType: false,
    randomWalkType: false,

    baseWalkSpeed: 5,
    baseStowingTicks: 50,
};

function limitNumberMinMax(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max)
}


const groupValidation = (planeState: PlaneState) => {
    const { boardingMethod, totalGroups, rows, cols, groupsPerCol, groupsPerRow } = planeState
    switch (boardingMethod) {
        case BoardingMethods.BACK_TO_FRONT:
        case BoardingMethods.FRONT_TO_BACK:
        case BoardingMethods.ROTATING_ZONE:
            return limitNumberMinMax(totalGroups, 1, rows);

        case BoardingMethods.WILMA_STRAIGHT:
            return cols / 2

        case BoardingMethods.RANDOM:
            return limitNumberMinMax(totalGroups, 1, cols * rows)

        case BoardingMethods.REVERSE_PYRAMID: {
            const n = (rows * cols) / 2 - (Math.ceil(rows * .66) * 2) + 2
            return limitNumberMinMax(totalGroups, 3, n > 3 ? n : 3);
        }
        case BoardingMethods.STEFFEN_MODIFIED:
        case BoardingMethods.STEFFEN_PERFECT:
            return rows * cols;

        case BoardingMethods.WILMA_BLOCK:
            return groupsPerCol * groupsPerRow;
    }
}


function reducer(state: PlaneState, action: PlaneStateActions) {
    switch (action.type) {
        case ActionTypes.CHANGE_SIZE:
            return changeStateResetPassengers(state, {
                size: action.value,
                distanceBetweenCols: action.value * 1.1,
                distanceBetweenRows: action.value * 1.5,
            })

        case ActionTypes.CHANGE_BASE_WALK_SPEED:
            return changeStateResetPassengers(state, { baseWalkSpeed: action.value })

        case ActionTypes.CHANGE_BASE_STOWING_TICKS:
            return changeStateResetPassengers(state, { baseStowingTicks: action.value })

        case ActionTypes.CHANGE_COLS:
            return changeStateResetAll(state, { cols: action.value });

        case ActionTypes.CHANGE_ROWS:
            return changeStateResetAll(state, { rows: action.value });
        case ActionTypes.CHANGE_BOARDING_METHOD:
            return changeStateResetAll(state, { boardingMethod: action.value });

        case ActionTypes.CHANGE_TOTAL_GROUPS:
            if (action.value === state.totalGroups) return state;
            return changeStateResetAll(state, { totalGroups: action.value })

        case ActionTypes.CHANGE_LARGE_GROUP_RATIO:
            if (action.value === state.largeGroupRatio) return state;
            return changeStateResetAll(state, { largeGroupRatio: action.value });

        case ActionTypes.CHANGE_SHUFFLE_GROUP_MEMBERS:
            return changeStateResetPassengers(state, { shuffleGroupMembers: action.value });

        case ActionTypes.CHANGE_REVERSE:
            return changeStateResetPassengers(state, { reverse: action.value });

        case ActionTypes.CHANGE_GROUPS_PER_COL:
            if (state.boardingMethod !== BoardingMethods.WILMA_BLOCK) return state;
            return changeStateResetAll(state, { groupsPerCol: action.value, totalGroups: action.value + state.groupsPerRow })

        case ActionTypes.CHANGE_GROUPS_PER_ROW:
            if (state.boardingMethod !== BoardingMethods.WILMA_BLOCK) return state;
            return changeStateResetAll(state, { groupsPerRow: action.value, totalGroups: action.value + state.groupsPerCol })

        case ActionTypes.CHANGE_RANDOM_STOW_TYPE:
            return changeStateResetPassengers(state, { randomStowType: action.value });

        case ActionTypes.CHANGE_RANDOM_WALK_TYPE:
            return changeStateResetPassengers(state, { randomWalkType: action.value })

        case ActionTypes.CHANGE_PLAY_STATE:
            return {
                ...state,
                playState: action.value
            }


    }
}

function changeStateResetAll(prevState: PlaneState, changes: Partial<PlaneState>) {
    changes.totalGroups = groupValidation({ ...prevState, ...changes })
    changes.seatList = generateSeats({ ...prevState, ...changes })
    changes.passengerList = generatePassengers({ ...prevState, ...changes })
    return {
        ...prevState,
        ...changes
    }
}
function changeStateResetPassengers(prevState: PlaneState, changes: Partial<PlaneState>) {
    changes.passengerList = generatePassengers({ ...prevState, ...changes });
    return {
        ...prevState,
        ...changes
    }
}

const useSettings = () => {
    const [planeState, dispatch] = useReducer(reducer, defaultState)

    return { planeState, dispatch }

}

export default useSettings;