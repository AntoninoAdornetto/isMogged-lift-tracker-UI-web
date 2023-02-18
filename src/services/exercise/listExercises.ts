import axios from "@lib/axios";
import { AxiosResponse } from "axios";

import { exercise } from "./createExercise";

type listExercisesRequest = {
  page: number;
  pageSize: number;
};

export async function listExercises(query: listExercisesRequest) {
  const { data }: AxiosResponse<exercise[]> = await axios.request({
    url: "/exercise",
    params: {
      page_size: query.pageSize,
      page_id: query.page,
    },
  });
  return data;
}
