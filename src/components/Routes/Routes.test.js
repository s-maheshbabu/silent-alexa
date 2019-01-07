import React from "react";
import { shallow, mount } from "enzyme";
import Routes from "./Routes";
import { MemoryRouter, Router } from "react-router-dom";

beforeEach(() => {
  jest.resetAllMocks();
});

it("redirects to / if path is /authresponse", () => {
  const wrapper = mount(
    <MemoryRouter initialEntries={["/authresponse"]}>
      <Routes />
    </MemoryRouter>
  );
  expect(wrapper.find(Router).props("history").history.entries).toHaveLength(2);
  expect(
    wrapper.find(Router).props("history").history.entries[1].pathname
  ).toBe("/");
  wrapper.unmount();
});

it("redirects to / if path is not /authresponse", () => {
  const wrapper = mount(
    <MemoryRouter initialEntries={["/anyOther"]}>
      <Routes />
    </MemoryRouter>
  );
  expect(wrapper.find(Router).props("history").history.entries).toHaveLength(2);
  expect(
    wrapper.find(Router).props("history").history.entries[1].pathname
  ).toBe("/");
  wrapper.unmount();
});
