import Character from '../src/js/Character';
import Bowman from '../src/js/characters/Bowman';
import Swordsman from '../src/js/characters/Swordsman';
import Magician from '../src/js/characters/Magician';
import Vampire from '../src/js/characters/Vampire';
import Undead from '../src/js/characters/Undead';
import Daemon from '../src/js/characters/Daemon';

describe('Character class', () => {
  test('should throw error when trying to create Character directly', () => {
    expect(() => {
      new Character(1);
    }).toThrow('Cannot create Character directly');
  });

  test('should not throw error when creating inherited class', () => {
    expect(() => {
      new Bowman(1);
    }).not.toThrow();
  });
});

describe('Character classes level 1', () => {
  test('Bowman should have correct characteristics', () => {
    const bowman = new Bowman(1);
    expect(bowman.level).toBe(1);
    expect(bowman.attack).toBe(30);
    expect(bowman.defence).toBe(25);
    expect(bowman.health).toBe(50);
    expect(bowman.type).toBe('bowman');
  });

  test('Swordsman should have correct characteristics', () => {
    const swordsman = new Swordsman(1);
    expect(swordsman.level).toBe(1);
    expect(swordsman.attack).toBe(45);
    expect(swordsman.defence).toBe(10);
    expect(swordsman.health).toBe(50);
    expect(swordsman.type).toBe('swordsman');
  });

  test('Magician should have correct characteristics', () => {
    const magician = new Magician(1);
    expect(magician.level).toBe(1);
    expect(magician.attack).toBe(15);
    expect(magician.defence).toBe(40);
    expect(magician.health).toBe(50);
    expect(magician.type).toBe('magician');
  });

  test('Vampire should have correct characteristics', () => {
    const vampire = new Vampire(1);
    expect(vampire.level).toBe(1);
    expect(vampire.attack).toBe(25);
    expect(vampire.defence).toBe(25);
    expect(vampire.health).toBe(50);
    expect(vampire.type).toBe('vampire');
  });

  test('Undead should have correct characteristics', () => {
    const undead = new Undead(1);
    expect(undead.level).toBe(1);
    expect(undead.attack).toBe(40);
    expect(undead.defence).toBe(10);
    expect(undead.health).toBe(50);
    expect(undead.type).toBe('undead');
  });

  test('Daemon should have correct characteristics', () => {
    const daemon = new Daemon(1);
    expect(daemon.level).toBe(1);
    expect(daemon.attack).toBe(10);
    expect(daemon.defence).toBe(10);
    expect(daemon.health).toBe(50);
    expect(daemon.type).toBe('daemon');
  });
});

describe('Character levelUp method', () => {
  test('should increase level and health', () => {
    const bowman = new Bowman(1);
    bowman.health = 30;
    bowman.levelUp();
    expect(bowman.level).toBe(2);
    expect(bowman.health).toBe(100);
  });

  test('should increase attack and defence', () => {
    const swordsman = new Swordsman(1);
    const oldAttack = swordsman.attack;
    const oldDefence = swordsman.defence;
    swordsman.health = 50;
    swordsman.levelUp();
    expect(swordsman.attack).toBeGreaterThanOrEqual(oldAttack);
    expect(swordsman.defence).toBeGreaterThanOrEqual(oldDefence);
  });
});

describe('Character toJSON method', () => {
  test('should serialize character correctly', () => {
    const bowman = new Bowman(2);
    bowman.health = 75;
    const json = bowman.toJSON();
    expect(json).toEqual({
      level: 2,
      attack: 30,
      defence: 25,
      health: 75,
      type: 'bowman'
    });
  });
});

describe('Character fromJSON method', () => {
  test('should restore character from JSON', () => {
    const data = {
      level: 3,
      attack: 30,
      defence: 30,
      health: 80,
      type: 'bowman'
    };
    const restored = Character.fromJSON(data, Bowman);
    expect(restored.level).toBe(3);
    expect(restored.attack).toBe(30);
    expect(restored.defence).toBe(30);
    expect(restored.health).toBe(80);
    expect(restored.type).toBe('bowman');
  });
});