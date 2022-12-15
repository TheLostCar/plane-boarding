import Seat from "@models/Seat.types";
import { PassengerClass, PassengerStates, PassengerStateObject, PassengerStowSpeeds, PassengerWalkSpeeds, PassengerOptions, stateMachine, PassengerActions } from "@models/Passenger.types";
import { PlaneState } from "@models/PlaneState.types";
import { Vector2D } from "@models/Vector2d.types";
import { easeInExpo, easeOutQuad, easeOutQuint } from "util/easingFunctions";

export default class Passenger implements PassengerClass {
    assignSeat: Seat;
    color: string;
    pos: Vector2D;
    luggagePos: Vector2D;
    luggageOffset: Vector2D;

    facing: 'Left' | 'Right';

    state: PassengerStateObject;
    walkType: PassengerWalkSpeeds;
    stowType: PassengerStowSpeeds;

    baseWalkSpeed: number;
    baseStowingTicks: number;
    luggageRotation: number;
    luggageOpacity: number;

    walkSpeed: number;
    stowingTicks: number;
    totalTicks: number;

    verticalOffset: number;

    constructor(color: string, assignedSeat: Seat, options: PassengerOptions) {
        this.color = color;
        this.assignSeat = assignedSeat;

        this.baseStowingTicks = options.baseStowingTicks;
        this.baseWalkSpeed = options.baseWalkSpeed;

        this.walkType = options.walkType || PassengerWalkSpeeds.NORMAL;
        this.stowType = options.stowType || PassengerStowSpeeds.NORMAL;
        this.facing = 'Right'

        this.state = { 'state': PassengerStates.INLINE, INLINE: true };

        this.luggageOpacity = 1;
        this.luggageRotation = 0; //degrees
        this.luggageOffset = {
            x: 0,
            y: 0
        }

        this.luggagePos = {
            x: 0,
            y: 0
        }

        this.pos = {
            x: 0,
            y: 0
        }

        this.walkSpeed = 0;
        this.totalTicks = 0;
        this.stowingTicks = 0;
        this.verticalOffset = 0;
        this.setWalkSpeed(options.walkType);
        this.setStowingSpeed(options.stowType);

    }
    reset() {
        this.setWalkSpeed(this.walkType);
        this.setStowingSpeed(this.stowType);
        this.luggageRotation = 0;
        this.facing = 'Right';
        this.luggageOpacity = 1;

    }
    setWalkSpeed(walkType?: PassengerWalkSpeeds) {
        switch (walkType) {
            case PassengerWalkSpeeds.FAST:
                this.walkSpeed = this.baseWalkSpeed * 2;
                break;
            case PassengerWalkSpeeds.SLOW:
                this.walkSpeed = Math.round(this.baseWalkSpeed / 2);
                break;
            default:// PassengerWalkSpeeds.NORMAL:
                this.walkSpeed = this.baseWalkSpeed;
                break;
        }
    }

    setStowingSpeed(stowType?: PassengerStowSpeeds) {
        let ticks;
        switch (stowType) {
            case PassengerStowSpeeds.SLOW:
                ticks = this.baseStowingTicks * 2;
                break;
            case PassengerStowSpeeds.VERY_SLOW:
                ticks = this.baseStowingTicks * 4
                break
            case PassengerStowSpeeds.FAST:
                ticks = Math.round(this.baseStowingTicks / 2);
                break;
            case PassengerStowSpeeds.VERY_FAST:
                ticks = Math.round(this.baseStowingTicks / 4);
                break;
            default: // PassengerStowSpeeds.NORMAL:
                ticks = this.baseStowingTicks;
        }
        this.stowingTicks = ticks
        this.totalTicks = ticks
    }

    nextState(action: PassengerActions) {
        const nextState = stateMachine[this.state.state][action] || this.state.state
        this.state = {
            state: nextState,
            [nextState]: true
        }
    }

    updateLuggagePos(size: number) {
        const coef = this.facing === 'Right' ? 1 : -1
        this.luggagePos.x = this.pos.x - size / 2.3 * coef;
        this.luggagePos.y = this.pos.y + size / 3.5
    }

    update(frontNeighbor: Passenger | null, planeState: PlaneState): Passenger | null {
        const { size } = planeState
        let moveAmount: number;
        this.updateLuggagePos(size)
        switch (this.state.state) {
            case PassengerStates.IDLE:
                this.nextState(PassengerActions.START)
                return this

            case PassengerStates.SEATED:
                return frontNeighbor;

            case PassengerStates.WAITING:
                if (!frontNeighbor?.state.STOWING) this.nextState(PassengerActions.CONTINUE);
                return this;

            case PassengerStates.INLINE: {
                let distFromFrontNeighbor = Infinity;

                const distFromSeatX = this.assignSeat.pos.x - this.pos.x;

                if (frontNeighbor !== null) distFromFrontNeighbor = (frontNeighbor.pos.x - size * 1.5) - this.pos.x;

                moveAmount = Math.min(distFromSeatX, distFromFrontNeighbor, this.walkSpeed);
                this.pos.x += moveAmount;

                if (this.pos.x >= this.assignSeat.pos.x) {
                    this.pos.x = this.assignSeat.pos.x;
                    this.nextState(PassengerActions.BEGIN_STOWING);
                }
                else if (moveAmount === distFromFrontNeighbor && frontNeighbor?.state.STOWING) this.nextState(PassengerActions.WAIT);
                this.updateLuggagePos(size);

                return this;
            }

            case PassengerStates.STOWING: {
                this.stowingTicks--;
                const timeFraction = (this.totalTicks - this.stowingTicks) / this.totalTicks
                this.updateLuggagePos(size)
                this.luggagePos.y += (-size * .8) * easeOutQuad(timeFraction);

                let totalRotation = 180;
                if (this.stowType === PassengerStowSpeeds.VERY_SLOW) totalRotation = 540//1980;

                this.luggageRotation = totalRotation * easeOutQuint(timeFraction);
                this.luggageOpacity = 1 - easeInExpo(timeFraction);

                if (this.stowingTicks === 0) {
                    this.facing = 'Left'
                    this.nextState(PassengerActions.GO_TO_SEAT)
                }
                return this;
            }

            case PassengerStates.INROW: {
                const upCoef = this.assignSeat.pos.y < this.pos.y ? -1 : 1
                const distFromSeatY = this.assignSeat.pos.y - this.pos.y
                moveAmount = Math.min(Math.abs(distFromSeatY), 2) * upCoef;
                this.verticalOffset += Math.abs(moveAmount)
                this.pos.y += moveAmount;


                if (moveAmount === distFromSeatY) {
                    this.nextState(PassengerActions.SIT);
                    this.pos.y = this.assignSeat.pos.y
                }

                if (this.verticalOffset < planeState.size) return this;
                return frontNeighbor;
            }


            case PassengerStates.CHECKING_ROW:
                // intended for checking if passengers are obstructing path to seat
                return frontNeighbor;
        }
    }
}