import React from 'react';
import { shallow } from 'enzyme';
import App from './App';

let app;
let appInstance;
let originalState;

beforeEach(() => {
    app = shallow(<App />);
    appInstance = app.instance();
    originalState = JSON.parse(JSON.stringify(app.instance().state));
});

it('renders without crashing', () => {
  shallow(<App />);
});

it('does not render chatWindow when authorizationValues state has no access_token', () => {
  app.setState({authenticationInfo: {}})
  expect(app.find("LoginWithAmazon").getElements().length).toBe(1)
  expect(app.find("ChatWindow").getElements().length).toBe(0)
});

it('renders chatWindow when authorizationValues state has access_token', () => {
  app.setState({authenticationInfo: {access_token: "some_access_token", expires_in: 30}});
  expect(app.find("LoginWithAmazon").getElements().length).toBe(1)
  expect(app.find("ChatWindow").getElements().length).toBe(1)
});

it('should not change state when authorization response (implicit grant) is not defined', () => {
  appInstance.populateAuthenticationInfo();
  expect(appInstance.state).toEqual(originalState);
});

it('should change state when authorization response (implicit grant) is defined', () => {
  appInstance.populateAuthenticationInfo({access_token: "some_access_token", expires_in: 30, state: "user_defined_state"});
  const finalState = {
    authenticationInfo: {
      access_token: "some_access_token",
      expires_in: 30
    }};
  expect(appInstance.state).toEqual(finalState);
});
