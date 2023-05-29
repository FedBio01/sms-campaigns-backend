class MissingParameterError extends Error {
  constructor(message) {
    super(message);
    this.name = "MissingParameterError";
    this.status = 422;
  }
}

module.exports = MissingParameterError;
