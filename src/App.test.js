import React from 'react';
import { shallow } from 'enzyme';
import App from './App';

it('renders without crashing', () => {
  shallow(<App />);
});

it('chatWindow not rendered when no access_token in state', () => {
  let mountedApp = shallow(<App />);
  expect(mountedApp.find("LoginWithAmazon").getElements().length).toBe(1)
  expect(mountedApp.find("ChatWindow").getElements().length).toBe(0)
});

it('chatWindow rendered when access_token set', () => {
  let mountedApp = shallow(<App />).setState({access_token: "some_access_token"});
  expect(mountedApp.find("LoginWithAmazon").getElements().length).toBe(1)
  expect(mountedApp.find("ChatWindow").getElements().length).toBe(1)
});
