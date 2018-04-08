const { Map } = require("immutable");

const chatterIds = Object.freeze({
  USER: 0,
  ALEXA: 1
});

const chatters = Map([
  [chatterIds.USER, { name: "You" }],
  [chatterIds.ALEXA, { name: "Alexa" }]
]);

module.exports = {
  chatterIds: chatterIds,
  chatters: chatters
};
