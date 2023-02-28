import { AxiosResponse } from "axios";
import axios from "@lib/axios";

import { exercise } from "./index";

type updateExerciseRequest = Partial<Pick<exercise, "muscle_group" | "category" | "name">> &
  Required<Pick<exercise, "id">>;

export async function updateExercise(payload: updateExerciseRequest) {
  const { data }: AxiosResponse<exercise> = await axios.request({
    url: `/exercise/${payload.id}`,
    method: "patch",
    data: payload,
  });

  return data;
}
