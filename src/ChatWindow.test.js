import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount, render } from 'enzyme';
import ReactTestUtils from 'react-dom/test-utils';

import ChatWindow from './ChatWindow';
import { Message } from 'react-chat-ui';

const users = require('./ConversingUsers');

it('renders without crashing', () => {
    mount(<ChatWindow />);
});

it('pushMessage persists a given message in state', () => {
    const chatWindow = shallow(<ChatWindow />);
    const chatWindowInstance = chatWindow.instance();

    const numberOfMessagesAlreadyInState = 2;
    const originalState = JSON.parse(JSON.stringify(chatWindow.instance().state));
    expect(originalState.messages.length).toBe(numberOfMessagesAlreadyInState);

    const userid = 1;
    const message = 'test message';
    const expectedMessage = new Message({ id: userid, message, senderName: users[userid] });

    chatWindow.instance().pushMessage(userid, message);
    const finalState = chatWindow.instance().state;

    const finalMessages = finalState.messages;
    expect(finalMessages.length).toBe(numberOfMessagesAlreadyInState + 1);
    expect(finalMessages[numberOfMessagesAlreadyInState]).toEqual(expectedMessage);
});

it('handles gracefully when pushMessage is called with an unknown user', () => {
    const chatWindow = shallow(<ChatWindow />);
    const chatWindowInstance = chatWindow.instance();
    const originalState = JSON.parse(JSON.stringify(chatWindow.instance().state));

    const invalidUserid = 1000; // valid values are just 0 and 1

    chatWindow.instance().pushMessage(invalidUserid, 'test message');
    const finalState = chatWindow.instance().state;

    // Nothing about the state should have changed.
    expect(finalState).toEqual(originalState);
});

it('handles gracefully when pushMessage is called with an empty or null message', () => {
    const chatWindow = shallow(<ChatWindow />);
    const chatWindowInstance = chatWindow.instance();
    const originalState = JSON.parse(JSON.stringify(chatWindow.instance().state));

    const userid = 1;
    const emptyMessage = '';

    chatWindow.instance().pushMessage(userid, emptyMessage);
    let finalState = chatWindow.instance().state;

    // Nothing about the state should have changed.
    expect(finalState).toEqual(originalState);

    let nullMessage;

    chatWindow.instance().pushMessage(userid, nullMessage);
    finalState = chatWindow.instance().state;

    // Nothing about the state should have changed.
    expect(finalState).toEqual(originalState);
});

it('handles the user\'s form submission with request to Alexa properly', () => {
    const chatWindow = mount(<ChatWindow />);
    const requestToAlexaForm = chatWindow.find('form').get(0);
    const chatWindowInstance = chatWindow.instance();

    const originalState = JSON.parse(JSON.stringify(chatWindowInstance.state));
    const numberOfMessagesAlreadyInState = originalState.messages.length;

    const mockRequestToAlexa = 'mock request';
    const userid = 1;
    chatWindowInstance.setState({
        requestToAlexa: mockRequestToAlexa,
        curr_user: userid
    });

    const preventDefaultSpy = jest.fn();
    chatWindow.find('form').simulate('submit', { preventDefault: preventDefaultSpy });

    // Verify that preventDefault() is being called.
    expect(preventDefaultSpy.mock.calls.length).toBe(1);

    const finalState = chatWindowInstance.state;

    const expectedMessage = new Message({ id: userid, message: mockRequestToAlexa, senderName: users[userid] });
    const finalMessages = finalState.messages;
    expect(finalMessages.length).toBe(numberOfMessagesAlreadyInState + 1);
    expect(finalMessages[numberOfMessagesAlreadyInState]).toEqual(expectedMessage);

    expect(chatWindowInstance.state.requestToAlexa).toEqual('');
});

it('handles gracefully when the input form is submitted with a null or empty request string', () => {
    const chatWindow = shallow(<ChatWindow />);
    const chatWindowInstance = chatWindow.instance();
    const originalState = JSON.parse(JSON.stringify(chatWindow.instance().state));
    const numberOfMessagesAlreadyInState = originalState.messages.length;

    const requestToAlexaForm = chatWindow.find('form').get(0);

    let nullRequestToAlexa;
    chatWindowInstance.setState({
        requestToAlexa: nullRequestToAlexa
    });

    chatWindow.find('form').simulate('submit', { preventDefault: jest.fn() });

    const finalState = chatWindowInstance.state;

    // Nothing about the state should have changed.
    expect(finalState).toEqual(originalState);
});
