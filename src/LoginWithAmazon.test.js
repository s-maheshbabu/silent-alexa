import React from 'react';
import {shallow, mount} from 'enzyme';
import LoginWithAmazon from './LoginWithAmazon';

let loginWithAmazon;
let loginWithAmazonInstance;
let mockSetAuthorization;
let amazonAuthorizationSpy;

beforeEach(() => {
    mockSetAuthorization = jest.fn();
    loginWithAmazon = mount(<LoginWithAmazon setAuthorization={mockSetAuthorization}/>);
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
    expect(global.console.log).toHaveBeenCalledWith('Response is undefined')
});

it('logs error message when authorization request encounters an error', () => {
    global.console = {
      log: jest.fn()
    }

    let response={error: 'some_error'}
    loginWithAmazonInstance.handleResponse(response)

    // Verify error message has been logged to console
    expect(global.console.log).toHaveBeenCalledWith('Encountered an error on login: some_error')
});

it('calls setAuthorization when authorization request is success', () => {
    let response={access_token: 'some_access_token', expires_in: 3600}
    loginWithAmazonInstance.handleResponse(response)

    // Verify setAuthorization is called with the authorization response argument
    expect(mockSetAuthorization).toHaveBeenCalledWith(response)
});
