export default class GameStateService {
  constructor(storage) {
    this.storage = storage;
  }

  save(state) {
    this.storage.setItem('gameState', JSON.stringify(state));
  }

  load() {
    try {
      const state = JSON.parse(this.storage.getItem('gameState'));
      if (!state) {
        throw new Error('No saved game');
      }
      return state;
    } catch (e) {
      throw new Error('Invalid saved game');
    }
  }
}
