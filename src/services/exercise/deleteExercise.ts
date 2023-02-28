import axios from "@lib/axios";

export async function deleteExercise(id: number) {
  return await axios.request({
    url: `/exercise/${id}`,
    method: "delete",
  });
}
