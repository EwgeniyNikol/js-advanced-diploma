import Bowman from '../src/js/characters/Bowman';
import Swordsman from '../src/js/characters/Swordsman';
import Magician from '../src/js/characters/Magician';
import Vampire from '../src/js/characters/Vampire';
import Undead from '../src/js/characters/Undead';
import Daemon from '../src/js/characters/Daemon';
import { getMoveRange, getAttackRange, getAvailableCells } from '../src/js/utils';

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

describe('getMoveRange fallback', () => {
  test('should return 1 for unknown character type', () => {
    const unknown = { type: 'unknown' };
    expect(getMoveRange(unknown)).toBe(1);
  });
});

describe('getAttackRange fallback', () => {
  test('should return 1 for unknown character type', () => {
    const unknown = { type: 'unknown' };
    expect(getAttackRange(unknown)).toBe(1);
  });
});