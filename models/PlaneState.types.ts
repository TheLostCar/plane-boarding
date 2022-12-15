import { PassengerClass } from "./Passenger.types";
import Seat from "./Seat.types";

export enum ActionTypes {
    CHANGE_SIZE = 'CHANGE_SIZE',
    CHANGE_BASE_STOWING_TICKS = 'CHANGE_BASE_STOWING_TICKS',
    CHANGE_BASE_WALK_SPEED = 'CHANGE_BASE_WALK_SPEED',

    CHANGE_ROWS = 'CHANGE_ROWS',
    CHANGE_COLS = 'CHANGE_COLS',

    CHANGE_BOARDING_METHOD = 'CHANGE_BOARDING_METHOD',
    CHANGE_TOTAL_GROUPS = 'CHANGE_TOTAL_GROUPS',
    CHANGE_LARGE_GROUP_RATIO = 'CHANGE_LARGE_GROUP_RATIO',

    CHANGE_SHUFFLE_GROUP_MEMBERS = 'CHANGE_SHUFFLE_GROUP_MEMBERS',
    CHANGE_REVERSE = 'CHANGE_REVERSE',

    CHANGE_PLAY_STATE = 'CHANGE_PLAY_STATE',

    CHANGE_GROUPS_PER_ROW = 'CHANGE_GROUPS_PER_ROW',
    CHANGE_GROUPS_PER_COL = 'CHANGE_GROUPS_PER_COL',

    CHANGE_RANDOM_STOW_TYPE = 'CHANGE_RANDOM_STOW_TYPE',
    CHANGE_RANDOM_WALK_TYPE = 'CHANGE_RANDOM_WALK_TYPE',
}

export enum BoardingMethods {
    RANDOM = 'RANDOM',
    BACK_TO_FRONT = 'BACK_TO_FRONT',
    FRONT_TO_BACK = 'FRONT_TO_BACK',

    ROTATING_ZONE = 'ROTATING_ZONE',
    WILMA_STRAIGHT = 'WILMA_STRAIGHT',
    WILMA_BLOCK = 'WILMA_BLOCK',

    STEFFEN_PERFECT = 'STEFFEN_PERFECT',
    STEFFEN_MODIFIED = 'STEFFEN_MODIFIED',
    REVERSE_PYRAMID = 'REVERSE_PYRAMID',


}

export enum PlayStates {
    IDLE = 'IDLE',
    PLAY = 'PLAY',
    PAUSED = 'PAUSED',
}

export type PlaneState = {
    size: number;
    distanceBetweenCols: number;
    distanceBetweenRows: number;
    largeGroupRatio: number; // Reverse Pyramid
    totalGroups: number;
    groupsPerCol: number, // WILMA Block
    groupsPerRow: number, // WILMA Block

    rows: number,
    cols: number,

    passengerList: PassengerClass[],
    seatList: Seat[],
    boardingMethod: BoardingMethods

    shuffleGroupMembers: boolean
    reverse: boolean
    playState: PlayStates;

    randomWalkType: boolean;
    randomStowType: boolean;

    baseWalkSpeed: number;
    baseStowingTicks: number;
}

export type PlaneStateActions =
    | { type: ActionTypes.CHANGE_PLAY_STATE, value: PlayStates }
    | { type: ActionTypes.CHANGE_BOARDING_METHOD, value: BoardingMethods }
    | {
        type:
        | ActionTypes.CHANGE_SHUFFLE_GROUP_MEMBERS
        | ActionTypes.CHANGE_REVERSE
        | ActionTypes.CHANGE_RANDOM_STOW_TYPE
        | ActionTypes.CHANGE_RANDOM_WALK_TYPE

        value: boolean
    }
    | {
        type:
        | ActionTypes.CHANGE_SIZE
        | ActionTypes.CHANGE_BASE_WALK_SPEED
        | ActionTypes.CHANGE_BASE_STOWING_TICKS
        | ActionTypes.CHANGE_ROWS
        | ActionTypes.CHANGE_COLS
        | ActionTypes.CHANGE_TOTAL_GROUPS
        | ActionTypes.CHANGE_LARGE_GROUP_RATIO
        | ActionTypes.CHANGE_GROUPS_PER_ROW
        | ActionTypes.CHANGE_GROUPS_PER_COL

        value: number
    }