import React, { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "react-query";
import Cookies from "js-cookie";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";

import { createWorkout } from "@services/workout";
import { WorkoutForm } from "./_forms/WorkoutForm";

export default function Workout() {
  const [isActive, setIsActive] = useState(false);
  const queryClient = useQueryClient();
  const userID = Cookies.get("user_id");

  const createWorkoutReq = useMutation(createWorkout, {
    onSuccess(data) {
      queryClient.setQueryData("active-workout", data);
      setIsActive(true);
    },
  });

  const getActiveWorkout = useQuery("active-workout", () => createWorkoutReq.data, {
    enabled: false,
  });

  const initNewWorkout = async () => {
    if (userID) {
      await createWorkoutReq.mutateAsync({ userID, start_time: Date.now() });
    }
  };

  const setActiveState = () => {
    setIsActive(!isActive);
  };

  return (
    <div data-testid='workoutPage'>
      <p className='text-center text-3xl p-2 font-bold'>Mog Mode</p>
      <div data-testid='templatesContainer'>
        <p className='text-left text-xl p-2'>Templates</p>
      </div>
      <Button
        label={getActiveWorkout.data?.id ? "Resume workout" : "start from scratch"}
        onClick={getActiveWorkout.data?.id ? setActiveState : initNewWorkout}
      />
      <Sidebar visible={isActive} onHide={setActiveState} fullScreen={true}>
        <WorkoutForm />
      </Sidebar>
    </div>
  );
}
