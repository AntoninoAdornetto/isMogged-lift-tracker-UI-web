import { AxiosResponse } from "axios";
import axios from "@lib/axios";

export type getWorkoutResponse = {
  id: string;
  start_time: string;
  finish_time: string;
  user_id: string;
};

export async function getWorkout(id: string) {
  const { data }: AxiosResponse<getWorkoutResponse> = await axios.request({
    url: `/getWorkout/${id}`,
    method: "get",
  });

  return data;
}
