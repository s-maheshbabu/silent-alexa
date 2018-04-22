const cannedResponses = Object.freeze({
  /* Message to be delivered when Alexa responds with an empty message. This is a valid scenario,
   for example, when user says "stop talking" to Alexa.*/
  EMPTY_RESPONSE_FROM_ALEXA:
    "a canned response when Alexa repsonds with an empty message."
});

module.exports = {
  cannedResponses: cannedResponses
};
