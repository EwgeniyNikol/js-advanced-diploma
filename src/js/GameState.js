export default class GameState {
  constructor() {
    this.currentTurn = 'player';
    this.selectedCharacter = null;
    this.level = 1;
    this.score = 0;
    this.maxScore = 0;
  }

  static from(object) {
    const state = new GameState();
    state.currentTurn = object.currentTurn || 'player';
    state.selectedCharacter = object.selectedCharacter || null;
    state.level = object.level || 1;
    state.score = object.score || 0;
    state.maxScore = object.maxScore || 0;
    return state;
  }
}
