import shuffleArray from "./shuffleArray";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function shuffleSubArrays(array: any[][]) {
    for (let i = 0; i < array.length; i++) {
        array[i] = shuffleArray(array[i])
    }
} 