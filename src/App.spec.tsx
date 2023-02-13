import React from "react";
import { act, cleanup, screen, waitFor } from "@testing-library/react";
import Cookies from "js-cookie";

import App from "@src/App";
import axios from "@lib/axios";
import * as service from "@services/auth/renewToken";
import renderWithProvider from "@utils/renderWithProvider";

jest.mock("js-cookie", () => ({
  default: {
    get: jest.fn(),
  },
}));

const cookieSpy = jest.spyOn(Cookies, "get");

function init() {
  renderWithProvider(<App />);
}

describe(App, () => {
  afterEach(cleanup);

  describe("Active Session", () => {
    test("App/navigation is displayed during active session", async () => {
      cookieSpy.mockReturnValue({ session_id: "1", user_id: "1" });
      const renewSpy = jest.spyOn(service, "renewToken");
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
      cookieSpy.mockReturnValue({ session_id: "1", user_id: "1" });
      const axiosSpy = jest.spyOn(axios, "request");
      act(init);

      expect(axiosSpy).toHaveBeenCalledTimes(1);
      expect(axiosSpy).toHaveBeenCalledWith({
        method: "post",
        url: "/token/renew",
      });
    });
  });

  it.todo("User is directed back to home page if session or userid does not exist in cookie");
});
