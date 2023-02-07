import React from "react";
import { cleanup, screen } from "@testing-library/react";

import App from "@src/App";
import renderWithProvider from "@utils/renderWithProvider";

function init() {
  renderWithProvider(<App />);
}

describe(App, () => {
  beforeEach(init);
  afterEach(cleanup);

  it.todo("Renew Session service is called");
  it.todo("App/navigation is displayed if user has an active session");

  test("Home Page renders if user does not have an active session", () => {
    screen.getByTestId("home--page");
  });
});
