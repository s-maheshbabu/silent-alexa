import AuthenticationInfo from "./AuthenticationInfo";

it("verifes that isValid returns true if authResponse has all the required fields", () => {
  const authResponse = {
    access_token: "some_access_token",
    expires_in: "30"
  };
  const authenticationInfo = new AuthenticationInfo(authResponse);
  expect(authenticationInfo.getAccessToken()).toBe(authResponse.access_token);
  expect(authenticationInfo.isValid()).toBe(true);
});

it("verifes that isValid returns false if authResponse is not valid", () => {
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
  let authResponseUndefined;
  const invalidAuthResponseObjects = [
    authResponseWithEmptyAccessToken,
    authResponseWithMissingExpiresIn,
    authReponseWithError,
    authResponseUndefined
  ];

  for (let i = 0; i < invalidAuthResponseObjects.length; i++) {
    const authenticationInfo = new AuthenticationInfo(
      invalidAuthResponseObjects[i]
    );
    // Test the exact error message
    expect(authenticationInfo.getAccessToken()).toBeUndefined();
    expect(authenticationInfo.isValid()).toBe(false);
  }
});
