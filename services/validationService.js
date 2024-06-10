class ValidatorService {
  containsAllRequiredFields(model, data, optionalFields = []) {
    const check = (key) => {
      if (key === "id" || optionalFields.includes(key)) {
        return true;
      }
      return key in data;
    };

    return Object.keys(model).every(check);
  }

  containsSomeRequiredFields(model, data) {
    const check = (key) => (key === "id" ? false : key in data);

    return Object.keys(model).some(check);
  }

  noExtraFields(model, data) {
    return Object.keys(data).every((key) =>
      key === "id" ? false : key in model
    );
  }

  validateProperties(data, validators) {
    for (let { validator, error } of validators) {
      if (!validator(data)) {
        return error;
      }
    }
  }
}

const validatorService = new ValidatorService();

export { validatorService };
