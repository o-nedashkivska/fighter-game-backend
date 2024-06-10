import { USER } from "../models/user.js";
import { userService } from "../services/userService.js";

const noExtraFields = (model, data) =>
  Object.keys(data).every((key) => (key === "id" ? false : key in model));

const containsRequiredFields = (model, data, allRequired = true) => {
  const check = (key) => (key === "id" ? allRequired : key in data);

  if (allRequired) {
    return Object.keys(model).every(check);
  } else {
    return Object.keys(model).some(check);
  }
};

const emailIsUnique = ({ id, email }) => {
  if (email) {
    const users = userService.getUsers();
    const userWithTheSameEmail = users.find((user) => {
      const emailEquals = user.email === email;

      if (id) {
        return emailEquals && user.id !== id;
      }
      return emailEquals;
    });

    return !userWithTheSameEmail;
  }
  return true;
};

const phoneNumberIsUnique = ({ id, phoneNumber }) => {
  if (phoneNumber) {
    const users = userService.getUsers();
    const userWithTheSamePhoneNumber = users.find((user) => {
      const phoneNumberEquals = user.phoneNumber === phoneNumber;

      if (id) {
        return phoneNumberEquals && user.id !== id;
      }
      return phoneNumberEquals;
    });

    return !userWithTheSamePhoneNumber;
  }
  return true;
};

const validators = [
  {
    validator: emailIsUnique,
    error: "User with the same email already exists",
  },
  {
    validator: phoneNumberIsUnique,
    error: "User with the same phone number already exists",
  },
  {
    validator: (data) => {
      const emailRegex = /^[a-zA-Z]+\w*@gmail\.com$/;
      return "email" in data ? emailRegex.test(data.email) : true;
    },
    error: "Email property is invalid",
  },
  {
    validator: (data) => {
      const phoneRegex = /^\+380\d{9}$/;
      return "phoneNumber" in data ? phoneRegex.test(data.phoneNumber) : true;
    },
    error: "Phone number property is invalid",
  },
  {
    validator: (data) =>
      "password" in data ? data.password.length >= 3 : true,
    error: "Password property is invalid",
  },
];

const validateProperties = (data) => {
  for (let { validator, error } of validators) {
    if (!validator(data)) {
      return error;
    }
  }
};

const createUserValid = (req, res, next) => {
  const data = req.body;
  const errorMessage = "User entity to create isn’t valid";

  if (!noExtraFields(USER, data)) {
    res.err = errorMessage + ": there are extra properties";
  } else if (!containsRequiredFields(USER, data)) {
    res.err = errorMessage + ": some required properties are missing";
  } else {
    const error = validateProperties(data);
    if (error) {
      res.err = `${errorMessage}: ${error}`;
    }
  }

  next();
};

const updateUserValid = (req, res, next) => {
  const { id } = req.params;
  const data = req.body;
  const errorMessage = "User entity to update isn’t valid";

  if (!noExtraFields(USER, data)) {
    res.err = errorMessage + ": there are extra properties";
  } else if (!containsRequiredFields(USER, data, false)) {
    res.err = errorMessage + ": some required properties are missing";
  } else {
    const error = validateProperties({ ...data, id });
    if (error) {
      res.err = `${errorMessage}: ${error}`;
    }
  }

  next();
};

export { createUserValid, updateUserValid };
