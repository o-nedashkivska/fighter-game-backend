import { Router } from "express";
import { userService } from "../services/userService.js";
import {
  createUserValid,
  updateUserValid,
} from "../middlewares/user.validation.middleware.js";
import { responseMiddleware } from "../middlewares/response.middleware.js";

const router = Router();

router.get(
  "/",
  (req, res, next) => {
    try {
      const users = userService.getUsers();

      res.data = users;
    } catch (err) {
      res.err = err;
    } finally {
      next();
    }
  },
  responseMiddleware
);

router.get(
  "/:id",
  (req, res, next) => {
    try {
      const { id } = req.params;
      const user = userService.getUserById(id);

      if (user) {
        res.data = user;
        res.status(200);
      } else {
        res.err = "User not found";
        res.status(404);
      }
    } catch (err) {
      res.err = err;
    } finally {
      next();
    }
  },
  responseMiddleware
);

router.post(
  "/",
  createUserValid,
  (req, res, next) => {
    try {
      if (!res.err) {
        const data = req.body;
        const user = userService.addUser(data);

        res.data = user;
        res.status(200);
      }
    } catch (err) {
      res.err = err;
    } finally {
      next();
    }
  },
  responseMiddleware
);

router.patch(
  "/:id",
  updateUserValid,
  (req, res, next) => {
    try {
      if (!res.err) {
        const { id } = req.params;
        const data = req.body;
        const user = userService.updateUserById(id, data);

        if (user) {
          res.data = user;
          res.status(200);
        } else {
          res.err = "User not found";
          res.status(404);
        }
      }
    } catch (err) {
      res.err = err;
    } finally {
      next();
    }
  },
  responseMiddleware
);

router.delete(
  "/:id",
  (req, res, next) => {
    try {
      const { id } = req.params;
      const user = userService.deleteUserById(id);

      if (user) {
        res.data = user;
        res.status(200);
      } else {
        res.err = "User not found";
        res.status(404);
      }
    } catch (err) {
      res.err = err;
    } finally {
      next();
    }
  },
  responseMiddleware
);

export { router };
