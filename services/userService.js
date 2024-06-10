import { userRepository } from "../repositories/userRepository.js";

class UserService {
  getUsers() {
    return userRepository.getAll();
  }

  search(search) {
    const item = userRepository.getOne(search);
    if (!item) {
      return null;
    }
    return item;
  }

  getUserById(id) {
    const search = (user) => user.id === id;
    const item = this.search(search);

    if (!item) {
      return null;
    }
    return item;
  }

  getUserByProperties(properties) {
    const search = (user) =>
      Object.entries(properties).every(([key, value]) => user[key] === value);
    const item = this.search(search);

    if (!item) {
      return null;
    }
    return item;
  }

  addUser(data) {
    const item = userRepository.create(data);

    if (!item) {
      return null;
    }
    return item;
  }

  updateUserById(id, data) {
    const item = this.getUserById(id);

    if (!item) {
      return null;
    }
    return userRepository.update(id, data);
  }

  deleteUserById(id) {
    const item = userRepository.delete(id);

    if (!item) {
      return null;
    }
    return item[0];
  }
}

const userService = new UserService();

export { userService };
