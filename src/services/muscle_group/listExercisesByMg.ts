import { AxiosResponse } from "axios";
import axios from "@lib/axios";

import { exercise } from "@services/exercise";

export async function listExercisesBy(muscleGroup: string) {
  const { data }: AxiosResponse<exercise[]> = await axios.request({
    url: `/exercise/group/${muscleGroup}`,
  });
  return data;
}
