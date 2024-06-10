import { USER } from "../models/user.js";
import { userService } from "../services/userService.js";
import { validatorService } from "../services/validationService.js";

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
    validator: (data) =>
      "firstName" in data
        ? typeof data.firstName === "string" && data.firstName.length > 0
        : true,
    error: "First name property is invalid",
  },
  {
    validator: (data) =>
      "lastName" in data
        ? typeof data.lastName === "string" && data.lastName.length > 0
        : true,
    error: "Last name property is invalid",
  },
  {
    validator: (data) => {
      const emailRegex = /^[a-zA-Z]+\w*@gmail\.com$/;
      return "email" in data
        ? typeof data.email === "string" && emailRegex.test(data.email)
        : true;
    },
    error: "Email property is invalid",
  },
  {
    validator: (data) => {
      const phoneRegex = /^\+380\d{9}$/;
      return "phoneNumber" in data
        ? typeof data.phoneNumber === "string" &&
            phoneRegex.test(data.phoneNumber)
        : true;
    },
    error: "Phone number property is invalid",
  },
  {
    validator: (data) =>
      "password" in data
        ? typeof data.password === "string" && data.password.length >= 3
        : true,
    error: "Password property is invalid",
  },
];

const createUserValid = (req, res, next) => {
  const data = req.body;
  const errorMessage = "User entity to create isn’t valid";

  if (!validatorService.noExtraFields(USER, data)) {
    res.err = errorMessage + ": there are extra properties";
  } else if (!validatorService.containsAllRequiredFields(USER, data)) {
    res.err = errorMessage + ": some required properties are missing";
  } else {
    const error = validatorService.validateProperties(data, validators);
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

  if (!validatorService.noExtraFields(USER, data)) {
    res.err = errorMessage + ": there are extra properties";
  } else if (!validatorService.containsSomeRequiredFields(USER, data, false)) {
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

export { createUserValid, updateUserValid };
