/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * bottom
 * right
 * left
 * center
 *
 * @example
 * ```js
 * calcTileType(0, 8); // 'top-left'
 * calcTileType(1, 8); // 'top'
 * calcTileType(63, 8); // 'bottom-right'
 * calcTileType(7, 7); // 'left'
 * ```
 * */
export function calcTileType(index, boardSize) {
  const isTop = index < boardSize;
  const isBottom = index >= boardSize * (boardSize - 1);
  const isLeft = index % boardSize === 0;
  const isRight = index % boardSize === boardSize - 1;

  if (isTop) {
    if (isLeft) return 'top-left';
    if (isRight) return 'top-right';
    return 'top';
  }

  if (isBottom) {
    if (isLeft) return 'bottom-left';
    if (isRight) return 'bottom-right';
    return 'bottom';
  }

  if (isLeft) return 'left';
  if (isRight) return 'right';

  return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}

export function formatCharacterInfo(character) {
  return `🎖${character.level} ⚔${character.attack} 🛡${character.defence} ❤${character.health}`;
}

const moveDistances = {
  swordsman: 4,
  bowman: 2,
  magician: 1,
  vampire: 4,
  undead: 2,
  daemon: 1,
};

const attackDistances = {
  swordsman: 1,
  bowman: 2,
  magician: 4,
  vampire: 1,
  undead: 2,
  daemon: 4,
};

export function getMoveRange(character) {
  return moveDistances[character.type] || 1;
}

export function getAttackRange(character) {
  return attackDistances[character.type] || 1;
}

export function getAvailableCells(currentIndex, boardSize, range) {
  const availableCells = [];
  const row = Math.floor(currentIndex / boardSize);
  const col = currentIndex % boardSize;

  for (let i = 0; i < boardSize * boardSize; i++) {
    const targetRow = Math.floor(i / boardSize);
    const targetCol = i % boardSize;
    const dx = Math.abs(targetRow - row);
    const dy = Math.abs(targetCol - col);
    const distance = Math.max(dx, dy);

    if (distance <= range && distance > 0) {
      availableCells.push(i);
    }
  }

  return availableCells;
}
