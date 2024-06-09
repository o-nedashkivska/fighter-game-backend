import { fighterRepository } from "../repositories/fighterRepository.js";

class FighterService {
  getFighters() {
    return fighterRepository.getAll();
  }

  getFighterById(id) {
    const search = (fighter) => fighter.id === id;
    const item = fighterRepository.getOne(search);

    if (!item) {
      return null;
    }
    return item;
  }

  addFighter(data) {
    if (!data.health) {
      data.health = 85;
    }

    const item = fighterRepository.create(data);

    if (!item) {
      return null;
    }
    return item;
  }

  updateFighterById(id, data) {
    const item = this.getFighterById(id);

    if (!item) {
      return null;
    }
    return fighterRepository.update(id, data);
  }

  deleteFighterById(id) {
    const item = fighterRepository.delete(id);

    if (!item) {
      return null;
    }
    return item[0];
  }
}

const fighterService = new FighterService();

export { fighterService };
