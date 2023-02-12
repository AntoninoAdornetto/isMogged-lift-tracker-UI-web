import { APIError } from "@lib/axios";

export function handleHttpException(error: unknown): string {
  const httpError = error as APIError;

  if (httpError?.response?.data?.error) {
    return httpError.response.data.error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected error";
}
