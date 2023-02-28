import axios from "@lib/axios";
import { AxiosResponse } from "axios";

export type exercise = {
  id: number;
  name: string;
  muscle_group: string;
  category: string;
};

type createExerciseRequest = {
  name: string;
  muscle_group: string;
  category: string;
};

export async function createExercise(payload: createExerciseRequest) {
  const { data }: AxiosResponse<exercise> = await axios.request({
    url: "/exercise",
    method: "post",
    data: payload,
  });

  return data;
}
