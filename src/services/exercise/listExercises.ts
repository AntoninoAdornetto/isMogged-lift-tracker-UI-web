import axios from "@lib/axios";
import { AxiosResponse } from "axios";

type listExercisesRequest = {
  page: number;
  pageSize: number;
};

export type listExercisesResponse = {
  id: number;
  name: string;
  muscle_group: string;
  category: string;
};

export async function listExercises(query: listExercisesRequest) {
  const { data }: AxiosResponse<listExercisesResponse[]> = await axios.request({
    url: "/exercise",
    params: {
      page_size: query.pageSize,
      page_id: query.page,
    },
  });
  return data;
}
