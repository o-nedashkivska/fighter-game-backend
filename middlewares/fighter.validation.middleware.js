import { FIGHTER } from "../models/fighter.js";
import { fighterService } from "../services/fighterService.js";
import { validatorService } from "../services/validationService.js";

const nameIsUnique = ({ id, name }) => {
  if (name) {
    const fighters = fighterService.getFighters();
    const fighterWithTheSameName = fighters.find((fighter) => {
      const nameEquals = fighter.name.toLowerCase() === name.toLowerCase();

      if (id) {
        return nameEquals && fighter.id !== id;
      }
      return nameEquals;
    });

    return !fighterWithTheSameName;
  }
  return true;
};

const validators = [
  {
    validator: nameIsUnique,
    error: "Fighter with the same name already exists",
  },
  {
    validator: (data) =>
      "name" in data
        ? typeof data.name === "string" && data.name.length > 0
        : true,
    error: "Name property is invalid",
  },
  {
    validator: (data) =>
      "power" in data
        ? typeof data.power === "number" && data.power >= 1 && data.power <= 100
        : true,
    error: "Power property is invalid",
  },
  {
    validator: (data) =>
      "defense" in data
        ? typeof data.defense === "number" &&
          data.defense >= 1 &&
          data.defense <= 10
        : true,
    error: "Defense property is invalid",
  },
  {
    validator: (data) =>
      "health" in data
        ? typeof data.health === "number" &&
          data.health >= 80 &&
          data.health <= 120
        : true,
    error: "Health property is invalid",
  },
];

const createFighterValid = (req, res, next) => {
  const data = req.body;
  const errorMessage = "Fighter entity to create isn’t valid";

  if (!validatorService.noExtraFields(FIGHTER, data)) {
    res.err = errorMessage + ": there are extra properties";
  } else if (
    !validatorService.containsAllRequiredFields(FIGHTER, data, ["health"])
  ) {
    res.err = errorMessage + ": some required properties are missing";
  } else {
    const error = validatorService.validateProperties(data, validators);
    if (error) {
      res.err = `${errorMessage}: ${error}`;
    }
  }

  next();
};

const updateFighterValid = (req, res, next) => {
  const { id } = req.params;
  const data = req.body;
  const errorMessage = "Fighter entity to update isn’t valid";

  if (!validatorService.noExtraFields(FIGHTER, data)) {
    res.err = errorMessage + ": there are extra properties";
  } else if (
    !validatorService.containsSomeRequiredFields(FIGHTER, data, false)
  ) {
    res.err = errorMessage + ": some required properties are missing";
  } else {
    const error = validatorService.validateProperties(
      { ...data, id },
      validators
    );
    if (error) {
      res.err = `${errorMessage}: ${error}`;
    }
  }

  next();
};

export { createFighterValid, updateFighterValid };
