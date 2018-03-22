const { Map } = require("immutable");

const userIds = Object.freeze({
  YOU: "user_id_of_client_interacting_with_alexa",
  ALEXA: "user_id_of_alexa",
  MEDIATOR: "user_id_of_mediator"
});

const users = Map([
  [userIds.YOU, { name: "You" }],
  [userIds.ALEXA, { name: "Alexa" }],
  [userIds.MEDIATOR, { name: "Mediator" }]
]);

module.exports = {
  userIds: userIds,
  users: users
};
