class WrongParameterError extends Error {
  constructor(message) {
    super(message);
    this.status = 422;
    this.name = "WrongParameterError";
  }
}

module.exports = WrongParameterError;
