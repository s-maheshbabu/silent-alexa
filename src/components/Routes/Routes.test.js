import React from "react";
import { shallow, mount } from "enzyme";
import Routes from "./Routes";
import { MemoryRouter, Router } from "react-router-dom";
import LoginHandler from "LoginHandler/LoginHandler";
import DefaultRedirect from "../DefaultRedirect/DefaultRedirect";
import { wrap } from "module";

let loginHandler;
let loginHandlerInstance;
const mockUpdateAuthenticationInfo = jest.fn();

beforeEach(() => {
  jest.resetAllMocks();
});

it("renders Routes with 2 redirects if path is /authresponse", () => {
  const wrapper = mount(
    <MemoryRouter initialEntries={["/authresponse"]}>
      <Routes />
    </MemoryRouter>
  );
  expect(wrapper.find(DefaultRedirect)).toHaveLength(1);
  expect(
    wrapper.find(DefaultRedirect).props("history").history.entries
  ).toHaveLength(3);
  wrapper.unmount();
});

it("renders Routes with 1 redirect if path is not /authresponse", () => {
  const wrapper = mount(
    <MemoryRouter initialEntries={["/anyOther"]}>
      <Routes />
    </MemoryRouter>
  );
  expect(wrapper.find(DefaultRedirect)).toHaveLength(1);
  expect(
    wrapper.find(DefaultRedirect).props("history").history.entries
  ).toHaveLength(2);
  wrapper.unmount();
});
