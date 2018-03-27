const { Map } = require("immutable");

const userIds = Object.freeze({
  YOU: 0,
  ALEXA: 1
});

const users = Map([
  [userIds.YOU, { name: "You" }],
  [userIds.ALEXA, { name: "Alexa" }]
]);

module.exports = {
  userIds: userIds,
  users: users
};
