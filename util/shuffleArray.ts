// Fisher Yates Shuffle
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function shuffleArray(array: any[]) {
    for (let current = array.length; current !== 0;) {
        const random = Math.floor(Math.random() * current);
        current--;
        [array[current], array[random]] = [array[random], array[current]];
    }
    return array;
}