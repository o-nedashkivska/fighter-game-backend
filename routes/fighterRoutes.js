import { Router } from "express";
import { fighterService } from "../services/fighterService.js";
import { responseMiddleware } from "../middlewares/response.middleware.js";
import {
  createFighterValid,
  updateFighterValid,
} from "../middlewares/fighter.validation.middleware.js";

const router = Router();

router.get(
  "/",
  (req, res, next) => {
    try {
      const fighters = fighterService.getFighters();

      res.data = fighters;
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
      const fighter = fighterService.getFighterById(id);

      if (fighter) {
        res.data = fighter;
        res.status(200);
      } else {
        res.err = "Fighter not found";
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
  createFighterValid,
  (req, res, next) => {
    try {
      if (!res.err) {
        const data = req.body;
        const fighter = fighterService.addFighter(data);

        res.data = fighter;
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
  updateFighterValid,
  (req, res, next) => {
    try {
      if (!res.err) {
        const { id } = req.params;
        const data = req.body;
        const fighter = fighterService.updateFighterById(id, data);

        if (fighter) {
          res.data = fighter;
          res.status(200);
        } else {
          res.err = "Fighter not found";
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
      const fighter = fighterService.deleteFighterById(id);

      if (fighter) {
        res.data = fighter;
        res.status(200);
      } else {
        res.err = "Fighter not found";
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
