export function setColor(baseExp) {
  const color = [
    "#bebb98",
    "#cbcbcb",
    "rgb(78, 233, 78)",
    "#667af8",
    "#a749f0",
    "rgb(255, 140, 39)",
    "#ec5f58",
    "#303638",
  ];

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

export function drawPokemon(ballType, baseExp) {
  const randomNum = Math.random() * 100;
  if (ballType === "masterball") return true;
  if (baseExp < 44) {
    if (ballType === "pokeball") {
      if (randomNum <= 80) return true;
      else return false;
    } else {
      return true;
    }
  } else if (baseExp < 88) {
    if (ballType === "pokeball") {
      if (randomNum <= 70) return true;
      else return false;
    } else {
      return true;
    }
  } else if (baseExp < 132) {
    if (ballType === "pokeball") {
      if (randomNum <= 50) return true;
      else false;
    } else if (ballType === "greatball") {
      if (randomNum <= 75) return true;
      else return false;
    } else {
      return true;
    }
  } else if (baseExp < 176) {
    if (ballType === "pokeball") {
      if (randomNum <= 40) return true;
      else return false;
    } else if (ballType === "greatball") {
      if (randomNum <= 60) return true;
      else return false;
    } else {
      if (randomNum <= 80) return true;
      else return false;
    }
  } else if (baseExp < 220) {
    if (ballType === "pokeball") {
      if (randomNum <= 30) return true;
      else return false;
    } else if (ballType === "greatball") {
      if (randomNum <= 45) return true;
      else return false;
    } else {
      if (randomNum <= 60) return true;
      else return false;
    }
  } else if (baseExp < 264) {
    if (ballType === "pokeball") {
      if (randomNum <= 20) return true;
      else return false;
    } else if (ballType === "greatball") {
      if (randomNum <= 30) return true;
      else return false;
    } else {
      if (randomNum <= 40) return true;
      else return false;
    }
  } else if (baseExp < 308) {
    if (ballType === "pokeball") {
      if (randomNum <= 12) return true;
      else return false;
    } else if (ballType === "greatball") {
      if (randomNum <= 18) return true;
      else return false;
    } else {
      if (randomNum <= 24) return true;
      else return false;
    }
  } else {
    if (ballType === "pokeball") {
      if (randomNum <= 8) return true;
      else return false;
    } else if (ballType === "greatball") {
      if (randomNum <= 12) return true;
      else return false;
    } else {
      if (randomNum <= 16) return true;
      else return false;
    }
  }
}

export function styleType (type, style) {
  switch (type) {
    case 'dragon':
      if (style === 'background') return "#408a95"
      else return "#61cad9"
    case 'ice':
      if (style === 'background') return "#d8f0fa"
      else return "#88d3f5"
    case 'electric':
      if (style === 'background') return "#f5f877"
      else return "#e3e232"
    case 'dark':
      if (style === 'background') return "#5b5978"
      else return "#060909"
    case 'bug':
      if (style === 'background') return "#3d994e"
      else return "#1f4f2b"
    case 'fairy':
      if (style === 'background') return "#ea1269"
      else return "#971a45"
    case 'fighting':
      if (style === 'background') return "#ed6238"
      else return "#a14427"
    case 'fire':
      if (style === 'background') return "#f94c5b"
      else return "#aa1f23"
    case 'flying':
      if (style === 'background') return "#93b2c7"
      else return "#4a687e"
    case 'ghost':
      if (style === 'background') return "#805a7e"
      else return "#363268"
    case 'grass':
      if (style === 'background') return "#29c94f"
      else return "#16863e"
    case 'ground':
      if (style === 'background') return "#51361b"
      else return "#aa722f"
    case 'normal':
      if (style === 'background') return "#ca98a7"
      else return "#7e5963"
    case 'poison':
      if (style === 'background') return "#9b69d9"
      else return "#6b3f92"
    case 'psychic':
      if (style === 'background') return "#f31f92"
      else return "#ac286f"
    case 'rock':
      if (style === 'background') return "#8b3e21"
      else return "#48170c"
    case 'steel':
      if (style === 'background') return "#41bd94"
      else return "#5e766d"
    case 'water':
      if (style === 'background') return "#86a8fc"
      else return "#1552e3"
    default:
      break;
  } 
}