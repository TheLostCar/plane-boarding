import { Vector2D } from "./Vector2d.types";
import { PlaneState, BoardingMethods } from "./PlaneState.types";


export default class Seat {
    pos: Vector2D
    color: string
    group: number

    constructor(group: number, color: string) {
        this.pos = { x: 0, y: 0 };
        this.color = color;//'#3491FF';
        this.group = group;
    }

    update(pos?: Vector2D, color?: string, group?: number) {
        this.pos = pos || this.pos;
        this.color = color || this.color;
        this.group = group || this.group;
    }
}

export type generateSeatParams = PlaneState | { rows: number, cols: number, totalGroups: number, boardingMethod: BoardingMethods, largeGroupRatio: number, groupsPerCol: number, groupsPerRow: number }