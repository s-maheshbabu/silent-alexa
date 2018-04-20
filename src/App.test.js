import React from "react";
import { shallow } from "enzyme";
import App from "App";
import AuthenticationInfo from "AuthenticationInfo";

let app;
let appInstance;
let originalState;
let updateAuthenticationInfoSpy;
let clearAuthenticationInfoSpy;
let isAuthenticationInfoValidSpy;

beforeEach(() => {
  app = shallow(<App />);
  appInstance = app.instance();
  originalState = appInstance.state;

  updateAuthenticationInfoSpy = jest.spyOn(
    appInstance,
    "updateAuthenticationInfo"
  );
  clearAuthenticationInfoSpy = jest.spyOn(
    appInstance,
    "clearAuthenticationInfo"
  );
  isAuthenticationInfoValidSpy = jest.spyOn(
    appInstance,
    "isAuthenticationInfoValid"
  );
});

it("renders correctly without crashing", () => {
  expect(app).toMatchSnapshot();
});

it("verifies that props are passed to Body component", () => {
  // Verify that Body recieves desired number of props
  expect(Object.keys(app.find("Body").props()).length).toBe(3);

  // Verify that Body recieves authenticationInfo prop
  expect(app.find("Body").prop("authenticationInfo")).toBe(
    originalState.authenticationInfo
  );

  // Verify that Body receives clearAuthenticationInfo prop
  const clearAuthenticationInfoProp = app
    .find("Body")
    .prop("clearAuthenticationInfo");

  // Verify that calling Body's clearAuthenticationInfo prop calls clearAuthenticationInfo
  clearAuthenticationInfoProp();
  expect(clearAuthenticationInfoSpy).toHaveBeenCalledTimes(1);

  // Verify that Body receives isAuthenticationInfoValid prop
  const isAuthenticationInfoValidProp = app
    .find("Body")
    .prop("isAuthenticationInfoValid");

  // Verify that calling Body's isAuthenticationInfoValid prop calls isAuthenticationInfoValid
  isAuthenticationInfoValidProp();
  expect(isAuthenticationInfoValidSpy).toHaveBeenCalledTimes(1);
});

it("verifies that props are passed to Header component", () => {
  //Verify that Header receives desired number of props
  expect(Object.keys(app.find("Header").props()).length).toBe(3);

  // Verify that Header receives updateAuthenticationInfo prop
  const updateAuthenticationInfoProp = app
    .find("Header")
    .prop("updateAuthenticationInfo");

  // Verify that calling header's updateAuthenticationInfo prop calls updateAuthenticationInfo
  const dummyArgument = "dummyArgument";
  updateAuthenticationInfoProp(dummyArgument);
  expect(updateAuthenticationInfoSpy).toHaveBeenCalledWith(dummyArgument);

  // Verify that Header receives clearAuthenticationInfo prop
  const clearAuthenticationInfoProp = app
    .find("Header")
    .prop("clearAuthenticationInfo");

  // Verify that calling header's clearAuthenticationInfo prop calls clearAuthenticationInfo
  clearAuthenticationInfoProp();
  expect(clearAuthenticationInfoSpy).toHaveBeenCalledTimes(1);

  // Verify that Header receives isAuthenticationInfoValid prop
  const isAuthenticationInfoValidProp = app
    .find("Header")
    .prop("isAuthenticationInfoValid");

  // Verify that calling header's isAuthenticationInfoValid prop calls isAuthenticationInfoValid
  isAuthenticationInfoValidProp();
  expect(isAuthenticationInfoValidSpy).toHaveBeenCalledTimes(1);
});

it("should not change state's authenticationInfo prop when authenticationInfo instance (implicit grant) is not valid", () => {
  const notAuthenticationInfoObject = { SomeObject: "not_authentication_info" };
  let undefinedAuthenticationInfo;

  const invalidAuthenticationInfoObjects = [
    notAuthenticationInfoObject,
    undefinedAuthenticationInfo
  ];

  const expectedState = appInstance.state;

  for (let i = 0; i < invalidAuthenticationInfoObjects.length; i++) {
    appInstance.updateAuthenticationInfo(invalidAuthenticationInfoObjects[i]);

    expect(appInstance.state).toEqual(expectedState);
    expect(appInstance.isAuthenticationInfoValid()).toBeFalsy();
  }
});

it("should change state when authenticationInfo instance (implicit grant) is defined and valid", () => {
  const lwaResponse = {
    access_token: "some_access_token",
    expires_in: 30
  };
  const expectedAuthenticationInfo = new AuthenticationInfo(lwaResponse);

  appInstance.updateAuthenticationInfo(expectedAuthenticationInfo);

  expect(appInstance.state.authenticationInfo).toBe(expectedAuthenticationInfo);
  expect(appInstance.isAuthenticationInfoValid()).toBeTruthy();
});

it("should reset authenticationInfo prop in state to undefined when clearAuthenticationInfo is called", () => {
  appInstance.setState({ authenticationInfo: "anyAuthenticationInfo" });
  expect(appInstance.state.authenticationInfo).toBeDefined();

  appInstance.clearAuthenticationInfo();

  expect(appInstance.state.authenticationInfo).toBeUndefined();
});

it("verifies isAuthenticationInfoValid returns false when authenticationInfo is not an instance of AuthenticationInfo", () => {
  appInstance.setState({ authenticationInfo: "anyAuthenticationInfo" });

  expect(appInstance.state.authenticationInfo).toBeDefined();
  expect(appInstance.isAuthenticationInfoValid()).toBeFalsy();
});

afterEach(() => {
  app.unmount();
});
