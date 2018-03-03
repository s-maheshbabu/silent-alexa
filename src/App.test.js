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

it('chatWindow not rendered when no access_token in state', () => {
  app.setState({authorization: {}})
  expect(app.find("LoginWithAmazon").getElements().length).toBe(1)
  expect(app.find("ChatWindow").getElements().length).toBe(0)
});

it('chatWindow rendered when access_token set', () => {
  app.setState({authorization: {access_token: "some_access_token", expires_in: 30}});
  expect(app.find("LoginWithAmazon").getElements().length).toBe(1)
  expect(app.find("ChatWindow").getElements().length).toBe(1)
});
