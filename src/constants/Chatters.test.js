import React from "react";
import { chatters, chatterIds } from "Chatters";
import AlexaRingIcon from "Icons/AlexaRingIcon";

test("that there are only two chatters.", () => {
  expect(Object.keys(chatterIds).length).toEqual(2);
});

test("that all chatterIds are contained in the map and that all chatters in the map are represented in the chatterIds", () => {
  expect(Object.keys(chatterIds).length).toEqual(
    chatters.keySeq().toArray().length
  );

  Object.values(chatterIds).forEach(function(chatterId) {
    const chatter = chatters.get(chatterId);
    expect(chatter).toBeDefined();
  });
});

test("that USER is configured correctly", () => {
  const user = chatters.get(chatterIds.USER);
  expect(user.name).toBe("You");
  expect(user.avatar).toBeUndefined();
});

test("that ALEXA is configured correctly", () => {
  const alexa = chatters.get(chatterIds.ALEXA);
  expect(alexa.name).toBeUndefined();
  expect(alexa.avatar).toEqual(<AlexaRingIcon />);
});
