export function setColor(baseExp) {
    const color = ['#bebb98', '#cbcbcb', 'rgb(78, 233, 78)','#667af8', '#a749f0', 'rgb(255, 140, 39)', '#ec5f58', '#303638']

  if (baseExp < 44) {
    return color[0];
  } else if (baseExp < 88) {
    return color[1];
  } else if (baseExp < 132) {
    return color[2];
  } else if (baseExp < 176) {
    return color[3];
  } else if (baseExp < 220) {
    return color[4];
  } else if (baseExp < 264) {
    return color[5];
  } else if (baseExp < 308) {
    return color[6];
  } else {
    return color[7];
  }
}
