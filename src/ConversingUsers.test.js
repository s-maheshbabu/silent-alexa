import { users, userIds } from "./ConversingUsers";

test("that all userIds are contained in the map and that all users in the map are represented in the userIds", () => {
  expect(Object.keys(userIds).length).toEqual(users.keySeq().toArray().length);

  Object.values(userIds).forEach(function (userId) {
    const user = users.get(userId);
    expect(user).toBeDefined();
  });
});
