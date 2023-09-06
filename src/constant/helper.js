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

export function styleType(type, style) {
  switch (type) {
    case "dragon":
      if (style === "background") return "#408a95";
      else return "#61cad9";
    case "ice":
      if (style === "background") return "#d8f0fa";
      else return "#88d3f5";
    case "electric":
      if (style === "background") return "#f5f877";
      else return "#e3e232";
    case "dark":
      if (style === "background") return "#5b5978";
      else return "#060909";
    case "bug":
      if (style === "background") return "#3d994e";
      else return "#1f4f2b";
    case "fairy":
      if (style === "background") return "#ea1269";
      else return "#971a45";
    case "fighting":
      if (style === "background") return "#ed6238";
      else return "#a14427";
    case "fire":
      if (style === "background") return "#f94c5b";
      else return "#aa1f23";
    case "flying":
      if (style === "background") return "#93b2c7";
      else return "#4a687e";
    case "ghost":
      if (style === "background") return "#805a7e";
      else return "#363268";
    case "grass":
      if (style === "background") return "#29c94f";
      else return "#16863e";
    case "ground":
      if (style === "background") return "#51361b";
      else return "#aa722f";
    case "normal":
      if (style === "background") return "#ca98a7";
      else return "#7e5963";
    case "poison":
      if (style === "background") return "#9b69d9";
      else return "#6b3f92";
    case "psychic":
      if (style === "background") return "#f31f92";
      else return "#ac286f";
    case "rock":
      if (style === "background") return "#8b3e21";
      else return "#48170c";
    case "steel":
      if (style === "background") return "#41bd94";
      else return "#5e766d";
    case "water":
      if (style === "background") return "#86a8fc";
      else return "#1552e3";
    default:
      break;
  }
}

export function damageDealt(
  attack,
  defense,
  basePower,
  enemyAttr,
  attackerAttr
) {
  const modifier = Math.random() * (0.15) + 0.85;
  let status = "Normal";
  let damage =
    (((2 / 5 + 2) * (attack / defense) * (basePower / 2)) / 50 + 2) * modifier;

  // is Immune ?
  for (let i = 0; i < attackerAttr.elements.length; i++) {
    for (let j = 0; j < enemyAttr.immune.length; j++) {
      if (attackerAttr.elements[i] === enemyAttr.immune[j])
        return { damage: 0, status: "immune" };
    }
  }

  // Hit Effectiveness
  attackerAttr.elements.forEach((attackerEl) => {
    enemyAttr.weakness.forEach((enemyEl) => {
      if (attackerEl === enemyEl) {
        damage *= 2;
        status = "Effective";
      }
    });
  });

  // Defense Effectiveness
  attackerAttr.weakness.forEach((attackerEl) => {
    enemyAttr.elements.forEach((enemyEl) => {
      if (attackerEl === enemyEl) {
        damage /= 2;
        status = "Ineffective";
      }
    });
  });

  return { damage: Math.ceil(damage), status };
}

export function calculateMaximumStat(totalStat, typeStat) {
  const maxAttack = 190
  const maxHP = 255
  const maxDef = 230

  if (typeStat === 'attack') return (totalStat / maxAttack) * 100 + '%'
  else if (typeStat === 'hp') return (totalStat / maxHP) * 100 + '%'
  else if (typeStat === 'def') return (totalStat / maxDef) * 100 + '%'
}

export function setRoleAndPercentage(stat) {
  const maxAttack = 190
  const maxHP = 255
  const maxDef = 230

  const result = {
    percentage: {},
    role: ''
  }

  let highest = 0

  for (const key in stat) {
    const countPercentage = (type) => {
      if (type === 'attack') return (stat[key] / maxAttack) * 100
      if (type === 'def') return (stat[key] / maxHP) * 100
      if (type === 'hp') return (stat[key] / maxDef) * 100
    }

    const percentage = countPercentage(key)

    if (percentage > highest) {
      highest = percentage
      if (key === 'attack') result.role = 'Combat'
      else if (key === 'hp') result.role = 'Support'
      else if (key === 'def') result.role = 'Tanker'
    }

    result.percentage[key] = percentage
  }

  return result
}

export const skillAndItem = [
  {
    role: 'Tanker',
    ability: [
      { name: 'Hard Skin', description: 'Reduces damage taken', type: 'passive' },
      { name: 'Taunt', description: 'Taunting enemy for one round', type: 'active' },
    ],
    item: [
      { name: 'Dopping', ammount: 1, description: 'Convert some def to attack for 2 rounds' },
      { name: 'Focus Sash', ammount: 1, description: 'Pokémon will never perish and will retain 1 HP for a single round' }
    ]
  },
  {
    role: 'Combat',
    ability: [
      { name: 'Critical', description: 'increase effective damage', type: 'passive' },
      { name: 'Charge', description: 'Deal 250% damage for the next turn', type: 'active' },
    ],
    item: [
      { name: 'Smoke Bomb', ammount: 1, description: 'Increase the dodge chance for 1 round' },
      { name: 'Eject Button', ammount: 1, description: 'Obtain an additional turn' }
    ]
  },
  {
    role: 'Support',
    ability: [
      { name: 'Self Recover', description: 'self-regenerate small amount hp', type: 'passive' },
      { name: 'Heal', description: 'Heal a teammate', type: 'active' },
    ],
    item: [
      { name: 'Bottle Potion', ammount: 1, description: 'Heal all teammates' },
      { name: "Guardian's Elixir", ammount: 1, description: 'Provide all teammates with a barrier' }
    ]
  }
]


export function getBarrier(def, hp, tanker = false) {
  const percentage = 15
  if (tanker) percentage + 10
  return Math.ceil((def * percentage / 100) + (hp * percentage / 100))
}

//? Item

export function GuardiansElixir(myDeck) {
  let barrier = []
  myDeck.forEach(el => barrier.push(getBarrier(el.def, el.hp, el.role)))
  return barrier
}

export function heal(hp) {
  return Math.floor(hp * (12 / 100))
}