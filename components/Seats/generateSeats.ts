import { BoardingMethods } from "@models/PlaneState.types";
import { generateSeatParams } from "@models/Seat.types";
import Seat from "@models/Seat.types";
import randomIntInclusive from "util/randomIntInclusive";


export default function generateSeats(planeState: generateSeatParams): Seat[] {
    const { boardingMethod, rows, cols, largeGroupRatio, totalGroups } = planeState;

    const colors: string[] = [];
    for (let i = 0, h = randomIntInclusive(0, 360); i < totalGroups; i++) {
        const s = 60//randomIntInclusive(30, 100);
        const l = 65//randomIntInclusive(30, 60);

        colors.push(`hsl(${h}, ${s}%, ${l}%)`)
        h += Math.round(360 / totalGroups)
        // h = randomIntInclusive(0, 360)
    }


    const result: Seat[] = []

    let seatsPerGroup, remainder: number[], remainderMemo: number[]
    switch (boardingMethod) {
        case BoardingMethods.RANDOM: {
            const fullGroups = Math.floor((cols * rows) / totalGroups);
            remainder = new Array((cols * rows) % totalGroups).fill(0).map((_, i) => i + 1);

            // creates array with numbers from 1 - totalGroups once for every fullGroup
            const groupList = new Array(fullGroups).fill(new Array(totalGroups).fill(0).map((_, i) => i + 1)).flat()
            groupList.push(...remainder);

            for (let col = 0; col < cols; col++) {
                for (let row = 0, group: number; row < rows; row++) {
                    const randomIndex = Math.random() * groupList.length;
                    group = groupList.splice(randomIndex, 1)[0]
                    result.push(new Seat(group, colors[group - 1]))

                }
            }
            break;
        }

        case BoardingMethods.BACK_TO_FRONT: {
            seatsPerGroup = Math.floor(rows / totalGroups)
            remainder = new Array(rows % totalGroups).fill(0).map((_, i) => i + 1);
            for (let col = 0; col < cols; col++) {
                for (let row = 0, group = totalGroups, groupCount = 0; row < rows; row++) {
                    result.push(new Seat(group, colors[group - 1]));
                    groupCount++;

                    if (groupCount < seatsPerGroup) continue;
                    if (group === remainder[group - 1] && groupCount === seatsPerGroup) continue;
                    group--
                    groupCount = 0
                }
            }
            break;
        }

        case BoardingMethods.FRONT_TO_BACK: {
            seatsPerGroup = Math.floor(rows / totalGroups)
            remainderMemo = new Array(rows % totalGroups).fill(0).map((_, i) => i + 1);
            for (let col = 0; col < cols; col++) {
                remainder = remainderMemo
                for (let row = 0, group = 1, groupCount = 0; row < rows; row++) {
                    result.push(new Seat(group, colors[group - 1]));
                    groupCount++;

                    if (groupCount < seatsPerGroup) continue;
                    if (group === remainder[group - 1] && groupCount === seatsPerGroup) { continue; }
                    group++;
                    groupCount = 0
                }
            }
            break;
        }

        case BoardingMethods.ROTATING_ZONE: {
            seatsPerGroup = Math.floor(rows / totalGroups);
            remainderMemo = new Array(rows % totalGroups).fill(0).map((_, i) => i + 1);

            for (let col = 0; col < cols; col++) {
                remainder = [...remainderMemo];
                for (let row = 0, group = 2, groupCount = 0, groupDelta = 2; row < rows; row++) {
                    if (group > totalGroups) {
                        groupDelta = -2;
                        group += groupDelta;
                        group += totalGroups % 2 === 0 ? -1 : 1;
                    }

                    result.push(new Seat(group, colors[group - 1]));
                    groupCount++;

                    if (groupCount < seatsPerGroup) continue;
                    if (group === remainder[group - 1] && groupCount === seatsPerGroup) continue;

                    group += groupDelta;
                    groupCount = 0;
                }
            }

            break;
        }

        case BoardingMethods.WILMA_STRAIGHT:
            for (let col = 0; col < cols; col++) {
                for (let row = 0; row < rows; row++) {
                    const group = col < cols / 2 && col + 1 || cols - col
                    result.push(new Seat(group, colors[group - 1]))
                }
            }
            break;

        case BoardingMethods.WILMA_BLOCK: {
            const { groupsPerCol, groupsPerRow } = planeState


            const seatsPerRowGroup = Math.floor(rows / groupsPerRow);
            const rowRemainder = new Array(rows % groupsPerRow).fill(0).map((_, i) => i + 1);

            const seatsPerColGroup = Math.floor((cols / 2) / groupsPerCol);
            const colRemainder = new Array((cols / 2) % groupsPerCol).fill(0).map((_, i) => i + 1);

            //On every loop get starting position subtract groups per col in ROW loop
            for (let col = 0, gcd = -1, gc = groupsPerCol, colGroupCount = 0; col < cols; col++) {
                const startingGroup = groupsPerCol * groupsPerRow - gc + 1;

                for (let row = 0, g = groupsPerRow, rowGroup = startingGroup, rowGroupCount = 0; row < rows; row++) {
                    result.push(new Seat(rowGroup, colors[rowGroup - 1]));
                    rowGroupCount++;
                    if (rowGroupCount < seatsPerRowGroup) continue;
                    if (g === rowRemainder[g - 1] && rowGroupCount === seatsPerRowGroup) continue;

                    rowGroup -= groupsPerCol
                    rowGroupCount = 0
                    g--
                }
                colGroupCount++

                if (gc === colRemainder[gc - 1] && colGroupCount === seatsPerColGroup) continue;
                if (colGroupCount < seatsPerColGroup && col + 1 !== cols / 2) continue;

                colGroupCount = 0
                if (col + 1 === cols / 2) { gcd = 1; continue }

                gc += gcd
            }
            break;
        }
        case BoardingMethods.STEFFEN_PERFECT: {
            // number of groups equals rows * cols '
            let startingGroup = rows * 2;
            let oddOffset = 0
            if (rows % 2 !== 0) { oddOffset = 1 }
            for (let col = 0, startGroupDelta = rows * 2; col < cols; col++) {
                for (let row = 0, group, group1 = startingGroup, group2 = startingGroup - rows; row < rows; row++) {
                    if (row % 2 === 0) { group = group1; group1--; }
                    else { group = group2 - oddOffset; group2--; }

                    result.push(new Seat(group, colors[group - 1]));
                }
                if (col + 1 !== cols / 2) { startingGroup += startGroupDelta; continue; }
                startGroupDelta *= -1;
                oddOffset = 0;
                startingGroup -= Math.round(rows / 2);
            }
            break;
        }
        case BoardingMethods.STEFFEN_MODIFIED: {
            const groupSize = Math.floor(rows / 2)
            const rowEvenRemainder = rows % 2;
            const halfCols = cols / 2;
            const base1 = (groupSize + rowEvenRemainder) * halfCols
            const base2 = (base1 * 3) - (halfCols * rowEvenRemainder);

            for (let col = 0, group1Offset = 0, group2Offset = 0, groupDelta = cols / 2, group1 = Math.ceil(cols + col + 1), group2 = group1 + rows; col < cols; col++) {
                group1 = base1 - halfCols + col + 1;
                group2 = base2 - halfCols + col + 1

                if (col + 1 > cols / 2) {
                    group1 = base1 + halfCols - col
                    group2 = base2 + halfCols - col
                }

                for (let row = 0, group; row < rows; row++) {
                    group = group2 + group2Offset;
                    if (row % 2 === 0) group = group1 + group1Offset;
                    result.push(new Seat(group, colors[group - 1]));

                    if (row % 2 === 0) { group1 -= groupDelta }
                    else { group2 -= groupDelta }
                }
                if (col + 1 === cols / 2) {
                    group1Offset = Math.ceil((groupSize + rowEvenRemainder) * halfCols)
                    group2Offset = Math.ceil((groupSize) * halfCols)
                }
            }
            break;
        }

        case BoardingMethods.REVERSE_PYRAMID: {
            const halfTotalSeats = (rows * cols) / 2;
            const largeGroupSize = Math.ceil(rows * largeGroupRatio);
            const spaceForSmallGroups = halfTotalSeats - (largeGroupSize * 2);
            const smallGroupsSize = Math.floor(spaceForSmallGroups / (totalGroups - 2));

            let remainderNum = spaceForSmallGroups % (smallGroupsSize * (totalGroups - 2))

            const groupCount = new Array(totalGroups).fill(0).map((v, i) => {
                if (i === 0 || i === totalGroups - 1) return largeGroupSize;

                let remainderAmount = 0;
                if (remainderNum > 0 && (remainderNum > totalGroups - 2)) remainderAmount = 2;
                else if (remainderNum > 0) remainderAmount = 1
                remainderNum -= remainderAmount

                return smallGroupsSize + remainderAmount
            })

            const upperHalf = [];
            const lowerHalf = [];
            for (let col = 0, group = 1, upperArr, lowerArr; col < cols / 2; col++) {
                upperArr = [];
                lowerArr = [];

                for (let row = 0; row < rows; row++) {
                    upperArr.unshift(new Seat(group, colors[group - 1]));
                    lowerArr.unshift(new Seat(group, colors[group - 1]));
                    groupCount[group - 1]--

                    if (groupCount[group - 1] === 0) group++;
                }
                upperHalf.push(...upperArr);
                lowerHalf.unshift(...lowerArr);
            }
            result.push(...upperHalf, ...lowerHalf)

            break;
        }



    }
    return result
}