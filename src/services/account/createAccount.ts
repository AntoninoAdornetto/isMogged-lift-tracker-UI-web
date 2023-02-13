import { AxiosResponse } from "axios";
import axios from "@lib/axios";

export type createAccountRequest = {
  name: string;
  email: string;
  password: string;
  weight?: number;
  body_fat?: number;
};

export type createAccountResponse = {
  id: string;
  name: string;
  email: string;
  weight: number;
  body_fat: number;
  start_date: string;
};

export async function createAccount(credentials: createAccountRequest) {
  const { data }: AxiosResponse<createAccountResponse> = await axios.request({
    url: "/accounts",
    method: "post",
    data: credentials,
  });

  return data;
}
