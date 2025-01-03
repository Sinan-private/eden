import styled from "styled-components";

const beveledCorners = (percentage = 10) => {
  const p = `${percentage}%`;
  const np = `${100 - percentage}%`;
  return `
  clip-path: polygon(
    ${p} 0, ${np} 0, 100% ${p}, 100% ${np}, 
    ${np} 100%, ${p} 100%, 0 ${np}, 0 ${p}
    );
  `
}
export const BeveledBox = styled('div')<{ $bevel?: number }>`
    ${props => beveledCorners(props.$bevel || 10)}
`
