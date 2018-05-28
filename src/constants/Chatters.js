/*
TODO: Improve Chatters tests. Current tests don't fail if the properties
of a chatter (like their name or avatar) are changed.
*/
import React from "react";
import { Map } from "immutable";
import AlexaRingIcon from "Icons/AlexaRingIcon";

const chatterIds = Object.freeze({
  USER: 0,
  ALEXA: 1
});

const chatters = Map([
  [chatterIds.USER, { name: "You", avatar: undefined }],
  [
    chatterIds.ALEXA,
    {
      avatar: <AlexaRingIcon />
    }
  ]
]);

export { chatterIds, chatters };
