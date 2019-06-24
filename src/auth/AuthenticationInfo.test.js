import AuthenticationInfo from "AuthenticationInfo";
import Cookies from "js-cookie";
import IllegalArgumentError from "errors/IllegalArgumentError";
import { AMAZON_LOGIN_COOKIE } from "AuthenticationInfo";

jest.mock("js-cookie");

it("verifes that cookie is stored if lwaResponse has all the required fields", () => {
  const lwaResponse = {
    access_token: "some_access_token",
    expires_in: "30"
  };

  AuthenticationInfo.persist(lwaResponse);

  expect(Cookies.set).toHaveBeenCalledWith(
    AMAZON_LOGIN_COOKIE,
    lwaResponse.access_token,
    {
      expires: 30 / 86400,
      secure: false
    }
  );
});

it("verifes that the access token can be retrieved from the AuthenticationInfo object", () => {
  const lwaResponse = {
    access_token: "some_access_token",
    expires_in: "30"
  };
  const getCookieMock = jest.spyOn(Cookies, "get");
  getCookieMock.mockImplementation(() => lwaResponse.access_token);

  AuthenticationInfo.persist(lwaResponse);
  const access_token = AuthenticationInfo.getAccessToken();

  expect(Cookies.get).toHaveBeenCalledWith(AMAZON_LOGIN_COOKIE);
  expect(access_token).toEqual(lwaResponse.access_token);
});

it("verifes that the persisted access tokens are deleted", () => {
  const lwaResponse = {
    access_token: "some_access_token",
    expires_in: "30"
  };

  AuthenticationInfo.clear(lwaResponse);

  expect(Cookies.remove).toHaveBeenCalledWith(AMAZON_LOGIN_COOKIE);
});

it("verifes that isPresent returns true when authentication storing cookie is present", () => {
  const lwaResponse = {
    access_token: "some_access_token",
    expires_in: "30"
  };
  const getCookieMock = jest.spyOn(Cookies, "get");
  getCookieMock.mockImplementation(() => lwaResponse.access_token);

  const isPresent = AuthenticationInfo.isPresent();

  expect(isPresent).toBe(true);
});

it("verifes that isPresent returns true when authentication storing cookie is absent", () => {
  const lwaResponse = {
    access_token: "some_access_token",
    expires_in: "30"
  };
  const getCookieMock = jest.spyOn(Cookies, "get");
  getCookieMock.mockImplementation(() => undefined);

  const isPresent = AuthenticationInfo.isPresent();

  expect(isPresent).toBe(false);
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
      AuthenticationInfo.persist(invalidLWAResponseObjects[i]);
    }).toThrow(IllegalArgumentError);
  }
});
