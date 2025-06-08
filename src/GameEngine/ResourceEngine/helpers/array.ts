export const unique = <K>(value: K, index: number, array: K[]) => array.indexOf(value) === index;
export const ascending = (a: number, b: number) => a - b;