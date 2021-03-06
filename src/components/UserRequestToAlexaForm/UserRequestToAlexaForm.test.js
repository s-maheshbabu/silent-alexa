import React from "react";
import { mount, shallow } from "enzyme";

import ChatWindow from "ChatWindow/ChatWindow";
import UserRequestToAlexaForm from "./UserRequestToAlexaForm";
import TextField from "material-ui/TextField";

import { DEFAULT_PLACEHOLDER_FOR_USER_REQUEST_STRING } from "Constants";

it("renders UserRequestToAlexaForm without crashing", () => {
  const wrapper = shallow(<UserRequestToAlexaForm />);
  expect(wrapper).toMatchSnapshot();
});

it("renders correctly with props (snapshot testing)", () => {
  const wrapper = mount(
    <UserRequestToAlexaForm value={"A dummy user request"} />
  );
  expect(wrapper).toMatchSnapshot();
});

it("displays the right placeholder message", () => {
  const form = shallow(<UserRequestToAlexaForm />);
  expect(form.find("TextField").prop("hintText")).toEqual(
    DEFAULT_PLACEHOLDER_FOR_USER_REQUEST_STRING
  );
});

it("calls the right methods when events get triggered", () => {
  const onChangeSpy = jest.fn();
  const onSubmitSpy = jest.fn();
  const userRequestToAlexa = "dummy user request";

  const wrapper = mount(
    <UserRequestToAlexaForm
      value={userRequestToAlexa}
      onChange={onChangeSpy}
      onSubmit={onSubmitSpy}
    />
  );

  expect(wrapper.find("input").prop("value")).toEqual(userRequestToAlexa);

  wrapper.find("input").simulate("change");
  expect(onChangeSpy).toHaveBeenCalledTimes(1);

  wrapper.find("form").simulate("submit");
  expect(onSubmitSpy).toHaveBeenCalledTimes(1);
});
