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

it('chatWindow not rendered when authorizationValues state has no access_token', () => {
  app.setState({authenticationValues: {}})
  expect(app.find("LoginWithAmazon").getElements().length).toBe(1)
  expect(app.find("ChatWindow").getElements().length).toBe(0)
});

it('chatWindow rendered when authorizationValues state has access_token', () => {
  app.setState({authenticationValues: {access_token: "some_access_token", expires_in: 30}});
  expect(app.find("LoginWithAmazon").getElements().length).toBe(1)
  expect(app.find("ChatWindow").getElements().length).toBe(1)
});
