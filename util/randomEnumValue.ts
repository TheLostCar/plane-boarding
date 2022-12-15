import randomIntInclusive from "./randomIntInclusive";

export default function randomEnumValue<T extends Record<string, T[keyof T]>>(anEnum: T): T[keyof T] {
    const enumValues = Object.values(anEnum);
    return enumValues[randomIntInclusive(0, enumValues.length - 1)]
}