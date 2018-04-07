import AuthenticationInfo from "./AuthenticationInfo";
const util = require("util");

it("verifes that isValid returns true if authResponse has all the required fields", () => {
  const authResponse = {
    access_token: "some_access_token",
    expires_in: "30"
  };
  var authenticationInfo = new AuthenticationInfo(authResponse);
  expect(authenticationInfo.getAccessToken()).toBe(authResponse.access_token);
  expect(authenticationInfo.isValid()).toBe(true);
});

it("verifes that isValid returns false if authRepsonse is not valid", () => {
  const authResponseWithEmptyAccessToken = {
    access_token: "",
    expires_in: "30"
  };
  const authResponseWithMissingExpiresIn = {
    access_token: "some_access_token"
  };
  const authReponseWithError = {
    error: "some_error_code",
    error_description: "description about error as string"
  };
  const invalidAuthResponseObjects = [
    authResponseWithEmptyAccessToken,
    authResponseWithMissingExpiresIn,
    authReponseWithError
  ];

  for (let i = 0; i < invalidAuthResponseObjects.length; i++) {
    global.console = {
      log: jest.fn()
    };
    const authResponse = invalidAuthResponseObjects[i];
    var authenticationInfo = new AuthenticationInfo(authResponse);
    expect(authenticationInfo.getAccessToken()).toBe(undefined);
    expect(authenticationInfo.isValid()).toBe(false);
    // Verify error message has been logged to console
    expect(global.console.log).toHaveBeenCalledWith(
      "Encountered an error on login: " +
        util.inspect(authResponse, { showHidden: true, depth: null })
    );
  }
});

it("verifies that isValid returns false if authResponse is undefined", () => {
  var authenticationInfo = new AuthenticationInfo();
  expect(authenticationInfo.getAccessToken()).toBe(undefined);
});
