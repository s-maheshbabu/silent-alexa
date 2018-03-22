import React from "react";
import {mount} from "enzyme";

import ChatWindow from "./ChatWindow";
import UserRequestToAlexaForm from "./UserRequestToAlexaForm";
import TextField from "material-ui/TextField";

const DEFAULT_PLACEHOLDER_VALUE = require("./Constants");

it("renders UserRequestToAlexaForm without crashing", () => {
  mount(<UserRequestToAlexaForm />);
});

it("renders correctly without any props (snapshot testing)", () => {
  const wrapper = mount(<UserRequestToAlexaForm />);
  expect(wrapper).toMatchSnapshot();
});

it("renders correctly with props (snapshot testing)", () => {
  const wrapper = mount(
    <UserRequestToAlexaForm value={"A dummy user request"} />
  );
  expect(wrapper).toMatchSnapshot();
});

it("displays the right placeholder message", () => {
  const form = mount(<UserRequestToAlexaForm />);
  expect(form.find("TextField").prop("hintText")).toEqual(
    DEFAULT_PLACEHOLDER_VALUE
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
  expect(onChangeSpy.mock.calls.length).toBe(1);

  wrapper.find("form").simulate("submit");
  expect(onSubmitSpy.mock.calls.length).toBe(1);
});
