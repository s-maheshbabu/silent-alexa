import { User } from "./ConversingUsers";
import IllegalArgumentError from "./errors/IllegalArgumentError";

test("that we throw an error if the name value is invalid.", () => {
  const userId = "mock user Id";
  let userName;

  expect(() => {
    new User(userId, userName);
  }).toThrow(IllegalArgumentError);

  userName = "";
  expect(() => {
    new User(userId, userName);
  }).toThrow(IllegalArgumentError);

  userName = 1234; // username should be a string
  expect(() => {
    new User(userId, userName);
  }).toThrow(IllegalArgumentError);
});

test("that we throw an error if the id value is invalid.", () => {
  let userId;
  const userName = "mock user name";

  expect(() => {
    new User(userId, userName);
  }).toThrow(IllegalArgumentError);

  userId = "some string"; // userId can only be a number
  expect(() => {
    new User(userId, userName);
  }).toThrow(IllegalArgumentError);

  userId = -1; // userId can only be a non-negative number
  expect(() => {
    new User(userId, userName);
  }).toThrow(IllegalArgumentError);
});

test("that we can create a user in happy case", () => {
  const userId = 1234;
  const userName = "mock user name";

  const user = new User(userId, userName);

  expect(user.id).toBe(userId);
  expect(user.name).toBe(userName);
});

test("that we can create a user in happy case", () => {
  const userId = 1234;
  const userName = "mock user name";

  const user = new User(userId, userName);

  expect(user.id).toBe(userId);
  expect(user.name).toBe(userName);
});
