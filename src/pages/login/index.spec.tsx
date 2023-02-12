import React from "react";
import { cleanup, fireEvent, screen, waitFor } from "@testing-library/react";
import * as service from "@services/auth/login";

import renderWithProvider from "@utils/renderWithProvider";
import Login from ".";

function init() {
  renderWithProvider(<Login />);
}

describe(Login, () => {
  const email = "test@gmail.com";
  const password = "strongPassword";
  let emailInput: HTMLInputElement;
  let passwordInput: HTMLInputElement;
  let submitBtn: HTMLButtonElement;
  let form: HTMLFormElement;

  beforeEach(() => {
    jest.resetAllMocks();
    init();
    emailInput = screen.getByTestId("email--input");
    passwordInput = screen.getByTestId("password--input");
    submitBtn = screen.getByTestId("loginSubmitBtn");
    form = screen.getByTestId("login--form");
  });

  afterEach(cleanup);

  test("Login page renders", () => {
    screen.getByTestId("login--form");
  });

  describe("Form events", () => {
    test("User can enter text into email input field", () => {
      fireEvent.change(emailInput, { target: { value: email } });
      expect(emailInput.value).toBe(email);
    });

    test("User can enter text into password input field", () => {
      fireEvent.change(passwordInput, { target: { value: password } });
      expect(passwordInput.value).toBe(password);
    });

    test("User can submit the form", () => {
      form.onsubmit = jest.fn();
      fireEvent.click(submitBtn);
      expect(form.onsubmit).toHaveBeenCalledTimes(1);
    });

    test("Error indicator is presented to the user when they submit the login form without a password", async () => {
      fireEvent.change(emailInput, { target: { value: email } });
      fireEvent.click(submitBtn);
      await waitFor(() => {
        expect(screen.getByText("Password is required")).toBeInTheDocument();
      });
    });

    test("Error indicator is presented to the user when they submit the login form without an email", async () => {
      fireEvent.change(passwordInput, { target: { value: password } });
      fireEvent.click(submitBtn);
      await waitFor(() => {
        expect(screen.getByText("Email is required")).toBeInTheDocument();
      });
    });
  });

  describe("Services", () => {
    let loginSpy: jest.SpyInstance<
      Promise<service.loginResponse>,
      [credentials: service.loginRequest],
      unknown
    >;

    beforeEach(jest.resetAllMocks);

    test("User makes a request to the /login api when both email/password fields are filled", async () => {
      loginSpy = jest.spyOn(service, "userLogin");
      loginSpy.mockResolvedValue({
        user: { email, password_changed_at: "", start_date: "", user_id: "" },
      } as service.loginResponse);

      fireEvent.change(emailInput, { target: { value: email } });
      fireEvent.change(passwordInput, { target: { value: password } });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(loginSpy).toHaveBeenCalledTimes(1);
        expect(loginSpy).toHaveBeenCalledWith({ email, password });
      });
    });

    test("/login api does not receive a request when the form is incomplete", async () => {
      loginSpy = jest.spyOn(service, "userLogin");

      fireEvent.change(emailInput, { target: { value: email } });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(loginSpy).toHaveBeenCalledTimes(0);
      });
    });
  });
});
