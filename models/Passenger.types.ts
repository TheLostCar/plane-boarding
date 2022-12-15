import { PlaneState } from "./PlaneState.types";
import Seat from "./Seat.types";
import { Vector2D } from "./Vector2d.types";

export interface PassengerOptions {
    baseWalkSpeed: number,
    baseStowingTicks: number,
    walkType?: PassengerWalkSpeeds,
    stowType?: PassengerStowSpeeds,
}

export enum PassengerStates { IDLE = 'IDLE', INLINE = 'INLINE', WAITING = 'WAITING', CHECKING_ROW = 'CHECKING_ROW', STOWING = 'STOWING', INROW = 'INROW', SEATED = 'SEATED' }
export enum PassengerActions { RESET = 'RESET', START = 'START', WAIT = 'WAIT', CONTINUE = 'CONTINUE', CHECK_ROW = 'CHECK_ROW', BEGIN_STOWING = 'BEGIN_STOWING', GO_TO_SEAT = 'GO_TO_SEAT', SIT = 'SIT' }
export enum PassengerWalkSpeeds { NORMAL = 'NORMAL', FAST = 'FAST', VERY_FAST = 'VERY_FAST', SLOW = 'SLOW', VERY_SLOW = 'VERY_SLOW' }
export enum PassengerStowSpeeds { NORMAL = 'NORMAL', FAST = 'FAST', VERY_FAST = 'VERY_FAST', SLOW = 'SLOW', VERY_SLOW = 'VERY_SLOW' }

export type PassengerStateObject = {
    [key in PassengerStates]?: true;
} & { state: PassengerStates; }


export interface PassengerClass {
    assignSeat: Seat,
    color: string,
    pos: Vector2D,
    state: PassengerStateObject

    baseWalkSpeed: number;
    baseStowingTicks: number;

    walkSpeed: number
    stowingTicks: number
    totalTicks: number

    facing: 'Left' | 'Right'

    luggageOpacity: number;
    luggageRotation: number // degrees
    luggagePos: Vector2D
    luggageOffset: Vector2D

    walkType: PassengerWalkSpeeds,
    stowType: PassengerStowSpeeds,

    verticalOffset: number,

    updateLuggagePos: (size: number) => void,
    nextState: (action: PassengerActions) => void,
    update: (latestStowingPassenger: PassengerClass | null, planeState: PlaneState) => PassengerClass | null,
    setStowingSpeed: (stowType?: PassengerStowSpeeds) => void;
    setWalkSpeed: (walkType?: PassengerWalkSpeeds) => void;
    reset: () => void;

}



type PassengerStateMachineType = {
    readonly [K in PassengerStates]: {
        readonly [key in PassengerActions]?: PassengerStates;
    }
}

export const stateMachine: PassengerStateMachineType = {
    IDLE: {
        START: PassengerStates.INLINE,
        RESET: PassengerStates.IDLE
    },
    INLINE: {
        BEGIN_STOWING: PassengerStates.STOWING,
        WAIT: PassengerStates.WAITING,
        RESET: PassengerStates.IDLE,
    },
    WAITING: {
        CONTINUE: PassengerStates.INLINE,
        RESET: PassengerStates.IDLE
    },
    CHECKING_ROW: {
        BEGIN_STOWING: PassengerStates.STOWING,
        RESET: PassengerStates.IDLE
    },
    STOWING: {
        GO_TO_SEAT: PassengerStates.INROW,
        RESET: PassengerStates.IDLE

    },
    INROW: {
        SIT: PassengerStates.SEATED,
        RESET: PassengerStates.IDLE
    },
    SEATED: {
        RESET: PassengerStates.IDLE
    },
} as const;