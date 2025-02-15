// const addThousandSeparator = (
//   number: number,
//   thousand_separator = '.'
// ): string => {
//   return number
//     .toString()
//     .replace(/\B(?=(\d{3})+(?!\d))/g, thousand_separator)
// }

export const beautifyNumber = (
  number: number,
  digits = 1,
  // thousand_separator = '.'
): string => number < 1000
  ? number.toFixed()
  : nFormatter(number, digits)


function nFormatter(num: number, digits: number) {
  const lookup = [
    {value: 1, symbol: ""},
    {value: 1e3, symbol: "k"},
    {value: 1e6, symbol: "M"},
    {value: 1e9, symbol: "G"},
    {value: 1e12, symbol: "T"},
    {value: 1e15, symbol: "P"},
    {value: 1e18, symbol: "E"}
  ];
  const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
  const item = lookup.findLast(item => num >= item.value);
  return item ? (num / item.value).toFixed(digits).replace(regexp, "").concat(item.symbol) : "0";
}
