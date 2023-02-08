import React from "react";
import { act, cleanup, screen, waitFor } from "@testing-library/react";

import App from "@src/App";
import axios from "@lib/axios";
import * as renewToken from "@services/auth/renewToken";
import renderWithProvider from "@utils/renderWithProvider";

function init() {
  renderWithProvider(<App />);
}

describe(App, () => {
  beforeEach(jest.restoreAllMocks);
  afterEach(cleanup);

  test("App/navigation is displayed during active session", async () => {
    const renewSpy = jest.spyOn(renewToken, "default");
    renewSpy.mockResolvedValueOnce({
      access_token: "eyJhbGciOiJIUzI",
      access_token_expires_at: `${new Date().getTime() + 5000}`,
      user_id: "0001-0001-0001-0001",
    });

    act(init);

    await waitFor(() => {
      screen.getByTestId("navigation--container");
    });
  });

  test("Renew Session service is called to see if user has existing session", () => {
    const axiosSpy = jest.spyOn(axios, "request");
    act(init);

    expect(axiosSpy).toHaveBeenCalledTimes(1);
    expect(axiosSpy).toHaveBeenCalledWith({
      method: "post",
      url: "/token/renew",
    });
  });

  test("Home Page renders if user does not have an active session", () => {
    act(init);
    screen.getByTestId("home--page");
  });
});
