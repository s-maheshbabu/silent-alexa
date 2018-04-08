import { chatters, chatterIds } from "./Chatters";

test("that all userIds are contained in the map and that all users in the map are represented in the userIds", () => {
  expect(Object.keys(chatterIds).length).toEqual(
    chatters.keySeq().toArray().length
  );

  Object.values(chatterIds).forEach(function(userId) {
    const user = chatters.get(userId);
    expect(user).toBeDefined();
  });
});
