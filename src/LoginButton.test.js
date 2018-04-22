import React from "react";
import { shallow } from "enzyme";
import LoginButton from "LoginButton";

it("renders LoginButton without crashing", () => {
  const wrapper = shallow(<LoginButton />);
  expect(wrapper).toMatchSnapshot();

  wrapper.unmount();
});

it("verifies that the image for the button has right dimensions", () => {
  const image = shallow(<LoginButton />)
    .find("button")
    .find("img");
  expect(image.prop("src")).toBe(
    "https://images-na.ssl-images-amazon.com/images/G/01/lwa/btnLWA_gold_156x32.png"
  );
  expect(image.prop("height")).toBe("20");
  expect(image.prop("width")).toBe("106");
});

it("verifies that the onClickProp function is called when login button is clicked", () => {
  const mockOnClickProp = jest.fn();
  const button = shallow(<LoginButton onClick={mockOnClickProp} />).find(
    "button"
  );
  expect(button).toBeDefined();
  button.simulate("click");

  expect(mockOnClickProp).toHaveBeenCalledTimes(1);
});
