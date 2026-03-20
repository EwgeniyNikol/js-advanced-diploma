import themes, { getThemeByLevel } from './themes';
import { generateTeam } from './generators';
import Bowman from './characters/Bowman';
import Swordsman from './characters/Swordsman';
import Magician from './characters/Magician';
import Vampire from './characters/Vampire';
import Undead from './characters/Undead';
import Daemon from './characters/Daemon';
import PositionedCharacter from './PositionedCharacter';
import {
  formatCharacterInfo, getMoveRange, getAttackRange, getAvailableCells,
} from './utils';
import GameState from './GameState';
import GamePlay from './GamePlay';
import cursors from './cursors';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.gameState = new GameState();
    this.positions = [];
  }

  init() {
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addNewGameListener(this.onNewGame.bind(this));
    this.gamePlay.addSaveGameListener(this.onSaveGame.bind(this));
    this.gamePlay.addLoadGameListener(this.onLoadGame.bind(this));

    if (!this.loadGame()) {
      this.gamePlay.drawUi(themes.prairie);
      this.generateTeams();
      this.placeCharacters();
    }
  }

  generateTeams() {
    const playerTypes = [Bowman, Swordsman, Magician];
    const enemyTypes = [Vampire, Undead, Daemon];

    let count;
    if (this.gameState.level === 1) count = 2;
    else if (this.gameState.level === 2) count = 4;
    else count = 6;

    this.playerTeam = generateTeam(playerTypes, this.gameState.level, count);
    this.enemyTeam = generateTeam(enemyTypes, this.gameState.level, count);
  }

  placeCharacters() {
    const positions = [];
    const boardSize = 8;

    this.positions = [];

    const playerRows = [1, 2, 3, 4, 5, 6];
    const shuffledPlayerRows = [...playerRows].sort(() => Math.random() - 0.5);

    this.playerTeam.characters.forEach((character, index) => {
      const row = shuffledPlayerRows[index % shuffledPlayerRows.length];
      const col = index % 2;
      const position = row * boardSize + col;
      positions.push(new PositionedCharacter(character, position));
      this.positions[position] = character;
    });

    const enemyRows = [1, 2, 3, 4, 5, 6];
    const shuffledEnemyRows = [...enemyRows].sort(() => Math.random() - 0.5);

    this.enemyTeam.characters.forEach((character, index) => {
      const row = shuffledEnemyRows[index % shuffledEnemyRows.length];
      const col = 6 + (index % 2);
      const position = row * boardSize + col;
      positions.push(new PositionedCharacter(character, position));
      this.positions[position] = character;
    });

    this.gamePlay.redrawPositions(positions);
  }

  redrawPositions() {
    const positions = [];
    for (let i = 0; i < 64; i++) {
      if (this.positions[i]) {
        positions.push(new PositionedCharacter(this.positions[i], i));
      }
    }
    this.gamePlay.redrawPositions(positions);
  }

  clearHighlights() {
    for (let i = 0; i < 64; i++) {
      this.gamePlay.deselectCell(i);
    }
    this.gamePlay.setCursor(cursors.pointer);
  }

  handleMove(fromIndex, toIndex) {
    const character = this.positions[fromIndex];
    if (!character) return false;

    const moveRange = getMoveRange(character);
    const availableCells = getAvailableCells(fromIndex, 8, moveRange);

    if (!availableCells.includes(toIndex)) {
      GamePlay.showError('Нельзя переместиться на эту клетку');
      return false;
    }

    if (this.positions[toIndex]) {
      GamePlay.showError('Клетка занята');
      return false;
    }

    this.positions[toIndex] = character;
    delete this.positions[fromIndex];
    this.gameState.selectedCharacter = toIndex;
    this.redrawPositions();
    this.clearHighlights();

    return true;
  }

  async handleAttack(attackerIndex, targetIndex) {
    const attacker = this.positions[attackerIndex];
    const target = this.positions[targetIndex];

    if (!attacker || !target) return false;

    const attackRange = getAttackRange(attacker);
    const availableCells = getAvailableCells(attackerIndex, 8, attackRange);

    if (!availableCells.includes(targetIndex)) {
      GamePlay.showError('Слишком далеко для атаки');
      return false;
    }

    const damage = Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
    target.health -= damage;

    await this.gamePlay.showDamage(targetIndex, damage);

    if (target.health <= 0) {
      delete this.positions[targetIndex];
      this.gameState.score += 10;
      if (this.gameState.score > this.gameState.maxScore) {
        this.gameState.maxScore = this.gameState.score;
        this.saveGame();
      }
    }

    this.redrawPositions();
    this.clearHighlights();

    return true;
  }

  async computerTurn() {
    const enemies = [];
    for (let i = 0; i < 64; i++) {
      const char = this.positions[i];
      if (char && ['vampire', 'undead', 'daemon'].includes(char.type)) {
        enemies.push({ position: i, character: char });
      }
    }

    if (enemies.length === 0) {
      this.nextLevel();
      return;
    }

    const players = [];
    for (let i = 0; i < 64; i++) {
      const char = this.positions[i];
      if (char && ['bowman', 'swordsman', 'magician'].includes(char.type)) {
        players.push({ position: i, character: char });
      }
    }

    const weakestPlayer = players.sort((a, b) => a.character.health - b.character.health)[0];

    for (const enemy of enemies) {
      const attackRange = getAttackRange(enemy.character);
      const attackCells = getAvailableCells(enemy.position, 8, attackRange);

      if (attackCells.includes(weakestPlayer.position)) {
        await this.handleAttack(enemy.position, weakestPlayer.position);
        this.gameState.currentTurn = 'player';
        this.clearHighlights();
        if (this.checkGameOver()) return;
        return;
      }
    }

    for (const enemy of enemies) {
      const attackRange = getAttackRange(enemy.character);
      const attackCells = getAvailableCells(enemy.position, 8, attackRange);

      for (const cell of attackCells) {
        const target = this.positions[cell];
        if (target && ['bowman', 'swordsman', 'magician'].includes(target.type)) {
          await this.handleAttack(enemy.position, cell);
          this.gameState.currentTurn = 'player';
          this.clearHighlights();
          if (this.checkGameOver()) return;
          return;
        }
      }
    }

    for (const enemy of enemies) {
      const moveRange = getMoveRange(enemy.character);
      const moveCells = getAvailableCells(enemy.position, 8, moveRange);

      let bestCell = null;
      let bestDistance = Infinity;

      for (const cell of moveCells) {
        if (!this.positions[cell]) {
          const targetRow = Math.floor(weakestPlayer.position / 8);
          const targetCol = weakestPlayer.position % 8;
          const cellRow = Math.floor(cell / 8);
          const cellCol = cell % 8;
          const distance = Math.abs(cellRow - targetRow) + Math.abs(cellCol - targetCol);

          if (distance < bestDistance) {
            bestDistance = distance;
            bestCell = cell;
          }
        }
      }

      if (bestCell !== null) {
        this.positions[bestCell] = enemy.character;
        delete this.positions[enemy.position];
        this.redrawPositions();
        this.gameState.currentTurn = 'player';
        this.clearHighlights();
        if (this.checkGameOver()) return;
        return;
      }
    }

    this.gameState.currentTurn = 'player';
    this.clearHighlights();
    this.checkGameOver();
  }

  levelUpSurvivors() {
    for (let i = 0; i < 64; i++) {
      const character = this.positions[i];
      if (character && ['bowman', 'swordsman', 'magician'].includes(character.type)) {
        character.levelUp();
      }
    }
  }

  checkGameOver() {
    let hasPlayerCharacters = false;
    for (let i = 0; i < 64; i++) {
      const character = this.positions[i];
      if (character && ['bowman', 'swordsman', 'magician'].includes(character.type)) {
        hasPlayerCharacters = true;
        break;
      }
    }

    if (!hasPlayerCharacters) {
      const message = `Игра окончена!\nОчки: ${this.gameState.score}\nРекорд: ${this.gameState.maxScore}`;
      GamePlay.showMessage(message, false);
      return true;
    }
    return false;
  }

  nextLevel() {
    this.levelUpSurvivors();
    this.gameState.level++;
    this.gameState.score += 100;
    if (this.gameState.score > this.gameState.maxScore) {
      this.gameState.maxScore = this.gameState.score;
      this.saveGame();
    }

    const themeLevel = ((this.gameState.level - 1) % 4) + 1;
    const theme = getThemeByLevel(themeLevel);
    this.gamePlay.drawUi(theme);

    let enemyCount;
    if (this.gameState.level === 1) enemyCount = 2;
    else if (this.gameState.level === 2) enemyCount = 4;
    else enemyCount = 6;

    const enemyTypes = [Vampire, Undead, Daemon];
    this.enemyTeam = generateTeam(enemyTypes, this.gameState.level, enemyCount);

    this.generateTeams();
    this.placeCharacters();
    this.gameState.currentTurn = 'player';
    this.clearHighlights();
  }

  onNewGame() {
    const savedMaxScore = this.gameState.maxScore || 0;
    this.gameState = new GameState();
    this.gameState.maxScore = savedMaxScore;
    this.gameState.score = 0;
    this.generateTeams();
    this.positions = [];
    this.gamePlay.drawUi(themes.prairie);
    this.placeCharacters();
    this.clearHighlights();
    this.gameState.selectedCharacter = null;
    this.saveGame();
  }

  onSaveGame() {
    this.saveGame();
    GamePlay.showMessage('Игра сохранена');
  }

  onLoadGame() {
    if (this.loadGame()) {
      GamePlay.showMessage('Игра загружена');
      this.clearHighlights();
      this.gameState.selectedCharacter = null;
    } else {
      GamePlay.showError('Нет сохраненной игры');
    }
  }

  getClassByType(type) {
    const classes = {
      bowman: Bowman,
      swordsman: Swordsman,
      magician: Magician,
      vampire: Vampire,
      undead: Undead,
      daemon: Daemon,
    };
    return classes[type];
  }

  saveGame() {
    const positions = {};
    for (let i = 0; i < 64; i++) {
      if (this.positions[i]) {
        positions[i] = this.positions[i].toJSON();
      }
    }
    const state = {
      positions,
      gameState: this.gameState,
      level: this.gameState.level,
      currentTurn: this.gameState.currentTurn,
      selectedCharacter: this.gameState.selectedCharacter,
      score: this.gameState.score,
      maxScore: this.gameState.maxScore,
    };
    this.stateService.save(state);
  }

  loadGame() {
    try {
      const saved = this.stateService.load();
      this.positions = [];
      for (const [index, charData] of Object.entries(saved.positions)) {
        const CharacterClass = this.getClassByType(charData.type);
        const character = new CharacterClass(charData.level);
        character.health = charData.health;
        character.attack = charData.attack;
        character.defence = charData.defence;
        this.positions[parseInt(index)] = character;
      }
      this.gameState = GameState.from(saved);
      this.gameState.score = saved.score || 0;
      this.gameState.maxScore = saved.maxScore || 0;

      const theme = getThemeByLevel(this.gameState.level);
      this.gamePlay.drawUi(theme);
      this.redrawPositions();

      if (this.gameState.selectedCharacter !== null) {
        this.gamePlay.selectCell(this.gameState.selectedCharacter);
      }

      return true;
    } catch (e) {
      return false;
    }
  }

  onCellEnter(index) {
    const character = this.positions[index];
    if (character) {
      const info = formatCharacterInfo(character);
      this.gamePlay.showCellTooltip(info, index);
    } else {
      this.gamePlay.hideCellTooltip(index);
    }

    if (this.gameState.currentTurn === 'player') {
      this.clearHighlights();
      this.highlightAvailableCells(index);
    }
  }

  onCellLeave(index) {
    this.gamePlay.hideCellTooltip(index);
  }

  async onCellClick(index) {
    const character = this.positions[index];
    const playerTypes = ['bowman', 'swordsman', 'magician'];

    if (character && playerTypes.includes(character.type)) {
      if (this.gameState.selectedCharacter !== null) {
        this.gamePlay.deselectCell(this.gameState.selectedCharacter);
      }
      this.clearHighlights();
      this.gamePlay.selectCell(index);
      this.gameState.selectedCharacter = index;
      return;
    }

    if (this.gameState.selectedCharacter !== null && this.gameState.currentTurn === 'player') {
      const targetChar = this.positions[index];

      if (targetChar && ['vampire', 'undead', 'daemon'].includes(targetChar.type)) {
        await this.handleAttack(this.gameState.selectedCharacter, index);
        this.gamePlay.deselectCell(this.gameState.selectedCharacter);
        this.gameState.selectedCharacter = null;
        this.gameState.currentTurn = 'computer';
        await this.computerTurn();
      } else if (!targetChar) {
        const success = this.handleMove(this.gameState.selectedCharacter, index);
        if (success) {
          this.gamePlay.deselectCell(this.gameState.selectedCharacter);
          this.gameState.selectedCharacter = null;
          this.gameState.currentTurn = 'computer';
          await this.computerTurn();
        }
      } else {
        GamePlay.showError('Нельзя выполнить это действие');
      }
    }
  }

  highlightAvailableCells(index) {
    if (this.gameState.selectedCharacter === null) return;
    if (this.gameState.currentTurn !== 'player') return;

    const selectedCharacter = this.positions[this.gameState.selectedCharacter];
    if (selectedCharacter) {
      const moveRange = getMoveRange(selectedCharacter);
      const attackRange = getAttackRange(selectedCharacter);

      const moveCells = getAvailableCells(this.gameState.selectedCharacter, 8, moveRange);
      const attackCells = getAvailableCells(this.gameState.selectedCharacter, 8, attackRange);

      const characterAtCell = this.positions[index];

      if (attackCells.includes(index) && characterAtCell
          && ['vampire', 'undead', 'daemon'].includes(characterAtCell.type)) {
        this.gamePlay.setCursor(cursors.crosshair);
        this.gamePlay.selectCell(index, 'red');
      } else if (moveCells.includes(index) && !characterAtCell) {
        this.gamePlay.setCursor(cursors.pointer);
        this.gamePlay.selectCell(index, 'green');
      } else if (index === this.gameState.selectedCharacter) {
        this.gamePlay.setCursor(cursors.pointer);
        this.gamePlay.selectCell(index, 'yellow');
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
        this.gamePlay.deselectCell(index);
      }
    }
  }
}
