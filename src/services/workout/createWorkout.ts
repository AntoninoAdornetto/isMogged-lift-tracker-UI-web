import { AxiosResponse } from "axios";
import axios from "@lib/axios";
import { getWorkoutResponse } from "./getWorkout";

export type createWorkoutRequest = {
  userID: string;
  start_time: number; // ms
};

export async function createWorkout(payload: createWorkoutRequest) {
  const { data }: AxiosResponse<getWorkoutResponse> = await axios.request({
    url: `/createWorkout/${payload.userID}`,
    method: "post",
    data: {
      start_time: payload.start_time,
    },
  });

  return data;
}
