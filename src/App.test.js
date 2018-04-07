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
  const authenticationInfoProp = wrapper
    .find("Body")
    .prop("authenticationInfo");
  expect(authenticationInfoProp).toBe(originalAuthenticationInfo);
});

it("verifies that updateAuthenticationInfo function is passed to Header component", () => {
  const updateAuthenticationInfoSpy = jest.spyOn(
    appInstance,
    "updateAuthenticationInfo"
  );

  // Verify that Header is passed on updateAuthenticationInfo property
  const headerUpdateAuthenticationInfoProp = app
    .find("Header")
    .prop("updateAuthenticationInfo");
  expect(headerUpdateAuthenticationInfoProp.length).toBe(1);

  // Verify that calling prop function passed to header calls updateAuthenticationInfo
  headerUpdateAuthenticationInfoProp();
  expect(updateAuthenticationInfoSpy).toHaveBeenCalled();
});

it("should not change state when authorizationInfo instance (implicit grant) is not valid", () => {
  const invalidAuthenticationInfo = new AuthenticationInfo();
  let undefinedAuthenticationInfo;
  const invalidAuthenticationInfoObjects = [
    invalidAuthenticationInfo,
    undefinedAuthenticationInfo
  ];
  for (let i = 0; i < invalidAuthenticationInfoObjects.length; i++) {
    appInstance.updateAuthenticationInfo(invalidAuthenticationInfoObjects[i]);
    expect(appInstance.state).toBe(originalState);
  }
});

it("should change state when authorizationInfo instance (implicit grant) is defined and valid", () => {
  const authResponse = {
    access_token: "some_access_token",
    expires_in: 30
  };
  const authInfo = new AuthenticationInfo(authResponse);
  const expectedState = {
    authenticationInfo: authInfo
  };
  appInstance.updateAuthenticationInfo(authInfo);
  expect(appInstance.state).toEqual(expectedState);
});
