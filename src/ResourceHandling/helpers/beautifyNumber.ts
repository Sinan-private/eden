const addThousandSeparator = (
  number: number,
  thousand_separator = '.'
): string => {
  return number
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, thousand_separator)
}

export const beautifyNumber = (
  number: number,
  thousand_separator = '.'
): string => addThousandSeparator(Math.floor(number), thousand_separator);
