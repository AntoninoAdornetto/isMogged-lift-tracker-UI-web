import { AxiosResponse } from "axios";
import axios from "@lib/axios";

export type getAccountResponse = {
  id: string;
  name: string;
  email: string;
  weight: number;
  body_fat: number;
  start_date: string;
};

export async function getAccount(id: string) {
  const { data }: AxiosResponse<getAccountResponse> = await axios.request({
    url: `/getAccount/${id}`,
    method: "get",
  });

  return data;
}
