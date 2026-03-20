import { 
  calcTileType, 
  calcHealthLevel, 
  formatCharacterInfo,
  getMoveRange,
  getAttackRange,
  getAvailableCells
} from '../src/js/utils';
import Bowman from '../src/js/characters/Bowman';
import Swordsman from '../src/js/characters/Swordsman';
import Magician from '../src/js/characters/Magician';
import Vampire from '../src/js/characters/Vampire';
import Undead from '../src/js/characters/Undead';
import Daemon from '../src/js/characters/Daemon';

describe('calcTileType function', () => {
  const boardSize = 8;

  test('should return top-left for index 0', () => {
    expect(calcTileType(0, boardSize)).toBe('top-left');
  });

  test('should return top-right for index 7', () => {
    expect(calcTileType(7, boardSize)).toBe('top-right');
  });

  test('should return bottom-left for index 56', () => {
    expect(calcTileType(56, boardSize)).toBe('bottom-left');
  });

  test('should return bottom-right for index 63', () => {
    expect(calcTileType(63, boardSize)).toBe('bottom-right');
  });

  test('should return top for index 3', () => {
    expect(calcTileType(3, boardSize)).toBe('top');
  });

  test('should return bottom for index 59', () => {
    expect(calcTileType(59, boardSize)).toBe('bottom');
  });

  test('should return left for index 16', () => {
    expect(calcTileType(16, boardSize)).toBe('left');
  });

  test('should return right for index 15', () => {
    expect(calcTileType(15, boardSize)).toBe('right');
  });

  test('should return center for index 27', () => {
    expect(calcTileType(27, boardSize)).toBe('center');
  });
});

describe('calcHealthLevel function', () => {
  test('should return critical for health < 15', () => {
    expect(calcHealthLevel(10)).toBe('critical');
    expect(calcHealthLevel(14)).toBe('critical');
  });

  test('should return normal for health between 15 and 49', () => {
    expect(calcHealthLevel(15)).toBe('normal');
    expect(calcHealthLevel(30)).toBe('normal');
    expect(calcHealthLevel(49)).toBe('normal');
  });

  test('should return high for health >= 50', () => {
    expect(calcHealthLevel(50)).toBe('high');
    expect(calcHealthLevel(75)).toBe('high');
    expect(calcHealthLevel(100)).toBe('high');
  });
});

describe('formatCharacterInfo function', () => {
  test('should format character info correctly', () => {
    const character = new Bowman(2);
    character.health = 75;
    const result = formatCharacterInfo(character);
    expect(result).toBe('🎖2 ⚔30 🛡25 ❤75');
  });

  test('should format character with different values', () => {
    const character = new Bowman(1);
    character.health = 50;
    const result = formatCharacterInfo(character);
    expect(result).toBe('🎖1 ⚔30 🛡25 ❤50');
  });
});

describe('getMoveRange function', () => {
  test('Bowman should have move range 2', () => {
    const bowman = new Bowman(1);
    expect(getMoveRange(bowman)).toBe(2);
  });

  test('Swordsman should have move range 4', () => {
    const swordsman = new Swordsman(1);
    expect(getMoveRange(swordsman)).toBe(4);
  });

  test('Magician should have move range 1', () => {
    const magician = new Magician(1);
    expect(getMoveRange(magician)).toBe(1);
  });

  test('Vampire should have move range 4', () => {
    const vampire = new Vampire(1);
    expect(getMoveRange(vampire)).toBe(4);
  });

  test('Undead should have move range 2', () => {
    const undead = new Undead(1);
    expect(getMoveRange(undead)).toBe(2);
  });

  test('Daemon should have move range 1', () => {
    const daemon = new Daemon(1);
    expect(getMoveRange(daemon)).toBe(1);
  });
});

describe('getAttackRange function', () => {
  test('Bowman should have attack range 2', () => {
    const bowman = new Bowman(1);
    expect(getAttackRange(bowman)).toBe(2);
  });

  test('Swordsman should have attack range 1', () => {
    const swordsman = new Swordsman(1);
    expect(getAttackRange(swordsman)).toBe(1);
  });

  test('Magician should have attack range 4', () => {
    const magician = new Magician(1);
    expect(getAttackRange(magician)).toBe(4);
  });

  test('Vampire should have attack range 1', () => {
    const vampire = new Vampire(1);
    expect(getAttackRange(vampire)).toBe(1);
  });

  test('Undead should have attack range 2', () => {
    const undead = new Undead(1);
    expect(getAttackRange(undead)).toBe(2);
  });

  test('Daemon should have attack range 4', () => {
    const daemon = new Daemon(1);
    expect(getAttackRange(daemon)).toBe(4);
  });
});

describe('getAvailableCells function', () => {
  const boardSize = 8;

  test('should return cells within range 1', () => {
    const cells = getAvailableCells(27, boardSize, 1);
    expect(cells).toContain(18);
    expect(cells).toContain(19);
    expect(cells).toContain(20);
    expect(cells).toContain(26);
    expect(cells).toContain(28);
    expect(cells).toContain(34);
    expect(cells).toContain(35);
    expect(cells).toContain(36);
    expect(cells.length).toBe(8);
  });

  test('should not include current cell', () => {
    const cells = getAvailableCells(27, boardSize, 1);
    expect(cells).not.toContain(27);
  });

  test('should handle edge cells', () => {
    const cells = getAvailableCells(0, boardSize, 1);
    expect(cells).toContain(1);
    expect(cells).toContain(8);
    expect(cells).toContain(9);
    expect(cells.length).toBe(3);
  });

  test('should return cells within range 2', () => {
    const cells = getAvailableCells(27, boardSize, 2);
    expect(cells.length).toBe(24);
  });
});