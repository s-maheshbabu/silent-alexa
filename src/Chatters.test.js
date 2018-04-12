import { chatters, chatterIds } from "./Chatters";

test("that all chatterIds are contained in the map and that all chatters in the map are represented in the chatterIds", () => {
  expect(Object.keys(chatterIds).length).toEqual(
    chatters.keySeq().toArray().length
  );

  Object.values(chatterIds).forEach(function(chatterId) {
    const chatter = chatters.get(chatterId);
    expect(chatter).toBeDefined();
  });
});
