import AuthenticationInfo from "./AuthenticationInfo";
import IllegalArgumentError from "./errors/IllegalArgumentError";

it("verifes that instance is created if lwaResponse has all the required fields", () => {
  const lwaResponse = {
    access_token: "some_access_token",
    expires_in: "30"
  };

  const authenticationInfo = new AuthenticationInfo(lwaResponse);

  expect(authenticationInfo.getAccessToken()).toBe(lwaResponse.access_token);
});

it("verifes that error is thrown if lwaResponse is not valid", () => {
  const lwaResponseWithEmptyAccessToken = {
    access_token: "",
    expires_in: "30"
  };
  const lwaResponseWithMissingAccessToken = {
    expires_in: "30"
  };
  const lwaResponseWithEmptyExpiresIn = {
    access_token: "some_access_token",
    expires_in: ""
  };
  const lwaResponseWithMissingExpiresIn = {
    access_token: "some_access_token"
  };
  const authReponseWithError = {
    error: "some_error_code",
    error_description: "description about error as string"
  };
  let lwaResponseUndefined;

  const invalidLWAResponseObjects = [
    lwaResponseWithEmptyAccessToken,
    lwaResponseWithMissingAccessToken,
    lwaResponseWithEmptyExpiresIn,
    lwaResponseWithMissingExpiresIn,
    authReponseWithError,
    lwaResponseUndefined
  ];

  for (let i = 0; i < invalidLWAResponseObjects.length; i++) {
    expect(() => {
      new AuthenticationInfo(invalidLWAResponseObjects[i]);
    }).toThrow(IllegalArgumentError);
  }
});
