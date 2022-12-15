export function easeOutQuint(x: number) {
    return 1 - ((1 - x) ** 5)
}

export function easeInExpo(x: number) {
    if (x === 0) return 0;
    return 2 ** ((x - 1) * 10);
}

export function easeOutQuad(x: number) {
    return 1 - ((1 - x) ** 2)
}