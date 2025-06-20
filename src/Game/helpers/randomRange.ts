export const randomRange = (from: number, to: number) => {
  if (from === to) {
    return from;
  }
  if (to < from) {
    console.warn('to is lower then from here')
    return to;
  }
  const delta = to - from;

  return Math.round(Math.random() * delta + from)
};