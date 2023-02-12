import axios from "@lib/axios/";
import { AxiosResponse } from "axios";

type loginRequest = {
  email: string;
  password: string;
};

type loginResponse = {
  user: {
    user_id: string;
    email: string;
    password_changed_at: string;
    start_date: string;
  };
  session: {
    access_token: string;
    access_token_expires_at: string;
    refresh_token: string;
    refresh_token_expires_at: string;
    session_id: string;
  };
};

export async function userLogin(credentials: loginRequest) {
  const { data }: AxiosResponse<loginResponse> = await axios.request({
    url: "/login",
    method: "POST",
    data: credentials,
  });
  return data;
}
