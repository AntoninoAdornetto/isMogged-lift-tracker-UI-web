import { AxiosResponse } from "axios";
import axios from "@lib/axios";
import { getAccountResponse } from "./getAccount";

export type createAccountRequest = {
  name: string;
  email: string;
  password: string;
  weight?: number;
  body_fat?: number;
};

export async function createAccount(credentials: createAccountRequest) {
  const { data }: AxiosResponse<getAccountResponse> = await axios.request({
    url: "/accounts",
    method: "post",
    data: credentials,
  });

  return data;
}
