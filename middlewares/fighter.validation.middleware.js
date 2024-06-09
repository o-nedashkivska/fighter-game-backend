import { FIGHTER } from "../models/fighter.js";
import { fighterService } from "../services/fighterService.js";

const noExtraFields = (model, data) =>
  Object.keys(data).every((key) => (key === "id" ? false : key in model));

const containsRequiredFields = (model, data, allRequired = true) => {
  const check = (key) => {
    if (key === "id" || (key === "health" && allRequired)) {
      return allRequired;
    }

    return key in data;
  };

  if (allRequired) {
    return Object.keys(model).every(check);
  } else {
    return Object.keys(model).some(check);
  }
};

const nameIsValid = ({ name }) => {
  if (name) {
    const fighters = fighterService.getFighters();
    const fighterWithTheSameName = fighters.find(
      (fighter) => fighter.name.toLowerCase() === name.toLowerCase()
    );

    return !fighterWithTheSameName;
  }
  return true;
};

const validators = [
  {
    validator: nameIsValid,
    error: "Fighter with the same name already exists",
  },
  {
    validator: (data) =>
      "power" in data ? data.power >= 1 && data.power <= 100 : true,
    error: "Power property is invalid",
  },
  {
    validator: (data) =>
      "defense" in data ? data.defense >= 1 && data.defense <= 10 : true,
    error: "Defense property is invalid",
  },
  {
    validator: (data) =>
      "health" in data ? data.health >= 80 && data.health <= 120 : true,
    error: "Health property is invalid",
  },
];

const validateProperties = (data) => {
  for (let { validator, error } of validators) {
    if (!validator(data)) {
      return error;
    }
  }
};

const createFighterValid = (req, res, next) => {
  const data = req.body;
  const errorMessage = "Fighter entity to create isn’t valid";

  if (!noExtraFields(FIGHTER, data)) {
    res.err = errorMessage + ": there are extra properties";
  } else if (!containsRequiredFields(FIGHTER, data)) {
    res.err = errorMessage + ": some required properties are missing";
  } else {
    const error = validateProperties(data);
    if (error) {
      res.err = `${errorMessage}: ${error}`;
    }
  }

  next();
};

const updateFighterValid = (req, res, next) => {
  const data = req.body;
  const errorMessage = "Fighter entity to update isn’t valid";

  if (!noExtraFields(FIGHTER, data)) {
    res.err = errorMessage + ": there are extra properties";
  } else if (!containsRequiredFields(FIGHTER, data, false)) {
    res.err = errorMessage + ": some required properties are missing";
  } else {
    const error = validateProperties(data);
    if (error) {
      res.err = `${errorMessage}: ${error}`;
    }
  }

  next();
};

export { createFighterValid, updateFighterValid };
