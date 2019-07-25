import React from "react";
import { shallow, mount } from "enzyme";
import Body from "./Body";
import MyAuthContext, { AuthContext } from "auth/AuthContext";

// jest.mock("AuthContext");

beforeEach(() => {
  jest.resetAllMocks();
});

it("renders Body when AuthenticationInfo is present", () => {
  //const getAccessTokenMock = jest.spyOn(AuthContext, "getAccessToken");
  //getAccessTokenMock.mockImplementation(() => true);
  //const testContext = { isAuthenticated: true };

  const wrapper = shallow(
    <MyAuthContext>
      <Body />
    </MyAuthContext>
  );

  /*
  const wrapper = shallow(<Body />, {
    wrappingComponent: MyAuthContext
  });
  */
  expect(wrapper.find("Body").dive()).toMatchSnapshot();
  //expect(wrapper).toMatchSnapshot();

  wrapper.unmount();
});

it("renders Body when AuthenticationInfo is not present", () => {
  const isPresentMock = jest.spyOn(AuthenticationInfo, "isPresent");
  isPresentMock.mockImplementation(() => false);

  const wrapper = shallow(<Body />);
  expect(wrapper).toMatchSnapshot();

  wrapper.unmount();
});
