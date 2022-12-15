// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function reverseSubArrays(array: any[][]) {
    for (let i = 0; i < array.length; i++) {
        array[i].reverse()
    }
}