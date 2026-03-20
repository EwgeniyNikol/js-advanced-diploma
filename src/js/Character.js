/**
 * Базовый класс, от которого наследуются классы персонажей
 * @property level - уровень персонажа, от 1 до 4
 * @property attack - показатель атаки
 * @property defence - показатель защиты
 * @property health - здоровье персонажа
 * @property type - строка с одним из допустимых значений:
 * swordsman
 * bowman
 * magician
 * daemon
 * undead
 * vampire
 */
export default class Character {
  constructor(level, type = 'generic') {
    if (new.target.name === 'Character') {
      throw new Error('Cannot create Character directly');
    }
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
  }

  levelUp() {
    this.level++;
    const maxHealth = 100;
    this.health = Math.min(this.health + 80, maxHealth);
    this.attack = Math.max(this.attack, Math.floor(this.attack * (80 + this.health) / 100));
    this.defence = Math.max(this.defence, Math.floor(this.defence * (80 + this.health) / 100));
  }

  toJSON() {
    return {
      level: this.level,
      attack: this.attack,
      defence: this.defence,
      health: this.health,
      type: this.type,
    };
  }

  static fromJSON(data, CharacterClass) {
    const character = new CharacterClass(data.level);
    character.attack = data.attack;
    character.defence = data.defence;
    character.health = data.health;
    return character;
  }
}
