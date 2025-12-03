class ValidationError extends Error {
  constructor(message, details) {
    super(message);
    this.statusCode = 400;
    if (details) {
      this.details = details;
    }
  }
}

module.exports = ValidationError;
