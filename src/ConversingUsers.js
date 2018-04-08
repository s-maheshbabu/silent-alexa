// TODO: Rename this file to Chatters.js
// Will do it in its own commit so as to not complicate the CRs.
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
