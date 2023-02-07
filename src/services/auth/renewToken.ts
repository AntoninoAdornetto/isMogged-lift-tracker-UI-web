import axios from "@lib/axios";
import { AxiosResponse } from "axios";

type renewResponse = {
  access_token: string;
  access_token_expires_at: string;
  user_id: string;
};

export default async function renewToken() {
  const { data }: AxiosResponse<renewResponse> = await axios.request({
    url: "/token/renew",
    method: "post",
  });
  return data;
}
