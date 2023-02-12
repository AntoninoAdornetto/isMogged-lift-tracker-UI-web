import { APIError } from "@src/lib/axios";
import { handleHttpException } from "./handleHttpException";

describe(handleHttpException, () => {
  test("Returns message attribute value if the error is an instance of the Error object", () => {
    const errMessage = "Whoa! Something went terribly wrong";
    const newError = Error(errMessage);
    expect(handleHttpException(newError)).toBe(errMessage);
  });

  test("Returns error attribute value from http req to the isMogged API", () => {
    const errMessage = "Invalid token";
    const errResponse = { response: { data: { error: errMessage } } } as APIError;
    expect(handleHttpException(errResponse)).toEqual(errMessage);
  });

  test("When the error is not an instance of the Error object or an axios error, it should return the default string", () => {
    const unknownError = ["invalid", "abort"];
    expect(handleHttpException(unknownError)).toEqual("Unexpected error");
  });
});
