import { Router } from "express";
import { authService } from "../services/authService.js";
import { responseMiddleware } from "../middlewares/response.middleware.js";

const router = Router();

router.post(
  "/login",
  (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = userService.getUserByProperties({ email, password });

      if (user) {
        res.data = user;
        res.status(200);
      } else {
        res.err = "User with the same email and password does not exist";
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
