import { AxiosResponse } from "axios";
import axios from "@lib/axios";

type muscleGroup = {
  id: number;
  name: string;
};

export async function listMuscleGroups() {
  const { data }: AxiosResponse<muscleGroup[]> = await axios.request({
    url: "/muscle_group",
    method: "get",
  });

  return data;
}
