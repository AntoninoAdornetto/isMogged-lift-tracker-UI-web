import { AxiosResponse } from "axios";
import axios from "@lib/axios";

type category = {
  id: number;
  name: string;
};

export async function listCategories() {
  const { data }: AxiosResponse<category[]> = await axios.request({
    url: "/category",
    method: "get",
  });

  return data;
}
