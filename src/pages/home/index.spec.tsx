import React from "react";
import { fireEvent, screen, waitFor } from "@testing-library/react";

import Home from "./index";
import renderWithProvider from "@utils/renderWithProvider";

const redirectSpy = jest.fn();

function init() {
  renderWithProvider(<Home navigate={redirectSpy} />);
}

describe(Home, () => {
  beforeEach(init);
  afterEach(jest.resetAllMocks);

  test("Home page renders with login and register buttons", () => {
    screen.getByTestId("registerBtn");
    screen.getByTestId("loginBtn");
  });

  test("Login button is clickable", async () => {
    const loginBtn = screen.getByTestId("loginBtn");
    fireEvent.click(loginBtn);
    await waitFor(() => expect(redirectSpy).toHaveBeenCalledTimes(1));
  });

  test("Login button is called with correct route", async () => {
    const loginBtn = screen.getByTestId("loginBtn");
    fireEvent.click(loginBtn);
    await waitFor(() => expect(redirectSpy).toHaveBeenCalledWith("/login"));
  });

  test("Register button is clickable", async () => {
    const registerBtn = screen.getByTestId("registerBtn");
    fireEvent.click(registerBtn);
    await waitFor(() => expect(redirectSpy).toHaveBeenCalledTimes(1));
  });

  test("Register button is called with correct route", async () => {
    const registerBtn = screen.getByTestId("registerBtn");
    fireEvent.click(registerBtn);
    await waitFor(() => expect(redirectSpy).toHaveBeenCalledWith("/register"));
  });
});
