class IllegalArgumentError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = "IllegalArgumentError";
  }
}

export default IllegalArgumentError;
