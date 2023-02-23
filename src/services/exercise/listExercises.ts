import axios from "@lib/axios";
import { AxiosResponse } from "axios";

import { exercise } from "./createExercise";

export async function listExercises() {
  const { data }: AxiosResponse<exercise[]> = await axios.request({
    url: "/exercise",
  });
  return data;
}
