import React from "react";
import Cookies from "js-cookie";
import { screen } from "@testing-library/react";

import renderWithProvider from "@utils/renderWithProvider";
import Dashboard from ".";

jest.mock("js-cookie", () => ({
  default: {
    get: jest.fn().mockImplementation(() => "mockUserId"),
  },
}));

const cookieSpy = jest.spyOn(Cookies, "get");

function init() {
  renderWithProvider(<Dashboard />);
}

describe("Dashboard page", () => {
  beforeEach(jest.resetAllMocks);

  test("Dashboard page renders", () => {
    init();
    screen.getByTestId("dashboardPage");
  });

  test("user_id cookie is retrieved", () => {
    init();
    expect(cookieSpy).toHaveBeenCalledTimes(1);
  });
});
