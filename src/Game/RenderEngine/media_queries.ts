export const BACKGROUND_IMAGE_WIDTH = {
  "2xl": 571,
  xl: 571,
  lg: 457,
  md: 343,
  sm: 343,
}
export const mediaQuery = {
  "2xl": 1536,
  xl: 1280,
  lg: 1024,
  md: 768,
  sm: 640,
}
export type MediaQueryKey = keyof typeof mediaQuery

export const getScreenSize = (screen_width: number): MediaQueryKey => {
  const matched = (Object.entries(mediaQuery) as [MediaQueryKey, number][])
    .filter(([_, minWidth]) => screen_width >= minWidth)
    .sort((a, b) => b[1] - a[1])[0]?.[0] ;
  return matched || 'sm'
}

export const getGajaSize = (screen_width: number) => {
  const mediaQuery = getScreenSize(screen_width)
  return BACKGROUND_IMAGE_WIDTH[mediaQuery]
}