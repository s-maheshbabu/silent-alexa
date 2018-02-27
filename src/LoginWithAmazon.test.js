import React from 'react';
import {shallow, mount} from 'enzyme';
import LoginWithAmazon from './LoginWithAmazon';
const util = require('util')

let loginWithAmazon;
let loginWithAmazonInstance;
let mockPopulateAuthenticationInfo;
let amazonAuthorizationSpy;

beforeEach(() => {
    mockPopulateAuthenticationInfo = jest.fn();
    loginWithAmazon = mount(<LoginWithAmazon populateAuthenticationInfo={mockPopulateAuthenticationInfo}/>);
    loginWithAmazonInstance = loginWithAmazon.instance();
    amazonAuthorizationSpy = jest.fn();

    Object.defineProperty(window, 'amazon', {
        value: { Login: { authorize: amazonAuthorizationSpy } },
        writable: true
    });
});

afterEach(() => {
    loginWithAmazon.unmount();
});

it('renders without crashing', () => {
    const wrapper = shallow(<LoginWithAmazon />);
    wrapper.unmount();
});

it('verify amazon authorization called when login button is clicked', () => {
    mount(<LoginWithAmazon />).find('button').simulate('click');

    // Verify authorize called once
    expect(amazonAuthorizationSpy.mock.calls.length).toBe(1);
});

it('logs error message when response is undefined', () => {
    global.console = {
      log: jest.fn()
    }

    let response;
    loginWithAmazonInstance.handleResponse(response)

    // Verify error message has been logged to console
    expect(global.console.log).toHaveBeenCalledWith('Encountered an error on login: undefined')
});

it('logs error message when authorization request encounters an error', () => {
    global.console = {
      log: jest.fn()
    };

    const response = {
      error: 'some_error_code',
      error_description: 'description about error as string',
      state: {page: 'http://somePage'}
    }
    loginWithAmazonInstance.handleResponse(response)

    // Verify error message has been logged to console
    expect(global.console.log)
      .toHaveBeenCalledWith('Encountered an error on login: ' + util.inspect(response, { showHidden: true, depth: null }))
});

it('calls populateAuthenticationInfo when authorization request is success', () => {
    const response={access_token: 'some_access_token', expires_in: 3600}
    loginWithAmazonInstance.handleResponse(response)

    // Verify populateAuthenticationInfo is called with the authorization response argument
    expect(mockPopulateAuthenticationInfo).toHaveBeenCalledWith(response)
});
