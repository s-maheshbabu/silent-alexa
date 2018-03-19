const { Map } = require("immutable");
import IllegalArgumentError from "./errors/IllegalArgumentError";

const userIds = Object.freeze({
  YOU: 0,
  ALEXA: 1,
  MEDIATOR: 2
});

class User {
  constructor(id, name) {
    if (id === undefined || typeof id !== "number" || id < 0)
      throw new IllegalArgumentError(
        "Id should be a non-negative number. Id: " + id
      );
    if (!name || typeof name !== "string")
      throw new IllegalArgumentError(
        "Name should be a valid string. Name: " + name
      );

    this.id = id;
    this.name = name;
  }
}

const users = Map([
  [0, new User(0, "You")],
  [1, new User(1, "Alexa")],
  [2, new User(2, "Mediator")]
]);

module.exports = {
  userIds: userIds,
  users: users,
  User: User
};
