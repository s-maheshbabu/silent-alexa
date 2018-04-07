import React from "react";
import { shallow } from "enzyme";
import App from "./App";
import AuthenticationInfo from "./AuthenticationInfo";

let app;
let appInstance;
let originalState;

beforeEach(() => {
  app = shallow(<App />);
  appInstance = app.instance();
  originalState = appInstance.state;
});

it("renders correctly without crashing", () => {
  const wrapper = shallow(<App />);
  expect(wrapper).toMatchSnapshot();
  wrapper.unmount();
});

it("verifies that authenticationInfo is passed to Body component", () => {
  const wrapper = shallow(<App />);
  const originalAuthenticationInfo = wrapper.instance().state
    .authenticationInfo;

  // Verify that Body recieves authenticationInfo property
  expect(Object.keys(wrapper.find("Body").props()).length).toBe(1);
  expect(wrapper.find("Body").prop("authenticationInfo")).toBe(
    originalAuthenticationInfo
  );
});

it("verifies that props are passed to Header component", () => {
  const updateAuthenticationInfoSpy = jest.spyOn(
    appInstance,
    "updateAuthenticationInfo"
  );
  const clearAuthenticationInfoSpy = jest.spyOn(
    appInstance,
    "clearAuthenticationInfo"
  );
  const isAuthenticationInfoValidSpy = jest.spyOn(
    appInstance,
    "isAuthenticationInfoValid"
  );

  //Verify that Header is passed desired number of properties
  expect(Object.keys(app.find("Header").props()).length).toBe(3);

  // Verify that Header is passed on updateAuthenticationInfo property
  const updateAuthenticationInfoProp = app
    .find("Header")
    .prop("updateAuthenticationInfo");

  // Verify that calling prop function passed to header calls updateAuthenticationInfo
  const dummyArgument = "dummyArgument";
  updateAuthenticationInfoProp(dummyArgument);
  expect(updateAuthenticationInfoSpy).toHaveBeenCalledWith(dummyArgument);

  // Verify that Header is passed on clearAuthenticationInfo property
  const clearAuthenticationInfoProp = app
    .find("Header")
    .prop("clearAuthenticationInfo");

  // Verify that calling prop function passed to header calls clearAuthenticationInfo
  clearAuthenticationInfoProp();
  expect(clearAuthenticationInfoSpy).toHaveBeenCalled();

  // Verify that Header is passed on isAuthenticationInfoValid property
  const isAuthenticationInfoValidProp = app
    .find("Header")
    .prop("isAuthenticationInfoValid");

  // Verify that calling prop function passed to header calls isAuthenticationInfoValid
  isAuthenticationInfoValidProp();
  expect(isAuthenticationInfoValidSpy).toHaveBeenCalled();
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

it("should return false when isAuthenticationInfoValid called when authenticationInfo is not instance of AuthenticationInfo", () => {
  appInstance.setState({ authenticationInfo: "anyAuthenticationInfo" });

  expect(appInstance.state.authenticationInfo).toBeDefined();
  expect(appInstance.isAuthenticationInfoValid()).toBeFalsy();
});
