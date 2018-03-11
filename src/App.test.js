import React from "react";
import { shallow, mount } from "enzyme";
import App from "./App";

let app;
let appInstance;
let originalState;

beforeEach(() => {
     app = shallow(<App />);
     appInstance = app.instance();
     originalState = JSON.parse(JSON.stringify(app.instance().state));
});

it("renders without crashing", () => {
  shallow(<App />);
});

it("snapshot testing that it renders correctly", () => {
  const wrapper = mount(<App />);
  expect(wrapper).toMatchSnapshot();
});

it("should not change state when authorization response (implicit grant) is not defined", () => {
  appInstance.handleAuthenticationInfoUpdate();
  expect(appInstance.state).toEqual(originalState);
});

it("should change state when authorization response (implicit grant) is defined", () => {
  const authResponse = {access_token: "some_access_token", expires_in: 30, state: "user_defined_state"};
  appInstance.handleAuthenticationInfoUpdate(authResponse);
  const finalState = {
    authenticationInfo: {access_token: authResponse.access_token, expires_in: authResponse.expires_in}
  };
  expect(appInstance.state).toEqual(finalState);
});