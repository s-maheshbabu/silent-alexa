import React from 'react';
import TestUtils from 'react';
import { shallow, mount } from 'enzyme';
import LoginWithAmazon from './LoginWithAmazon';

let loginWithAmazon;
let loginWithAmazonInstance;
let mockSetAccessToken;
let authorize;

beforeEach(() => {
    mockSetAccessToken = jest.fn();
    loginWithAmazon = shallow(<LoginWithAmazon setAccessToken={mockSetAccessToken}/>);
    loginWithAmazonInstance = loginWithAmazon.instance();
    authorize = jest.fn();

    Object.defineProperty(window, 'amazon', {
        value: { Login: { authorize: authorize } },
        configurable: true
    });
});

it('renders without crashing', () => {
    loginWithAmazon.find('button').simulate('click');

    // Verify authorize called once
    expect(authorize.mock.calls.length).toBe(1);
});

it('request access code errors out', () => {
    global.console = {
      log: jest.fn()
    }

    let response={error: 'some_error'}
    loginWithAmazonInstance.handleResponse(response)

    // Verify error message has been logged to console
    expect(global.console.log).toHaveBeenCalledWith('Encountered an error on login: some_error')
});

it('request access code calls setAccessToken', () => {
    let response={access_token: 'some_access_token', expires_in: 3600}
    loginWithAmazonInstance.handleResponse(response)

    // Verify setAccessToken is called with the access_token argument
    expect(mockSetAccessToken).toHaveBeenCalledWith('some_access_token')
});
