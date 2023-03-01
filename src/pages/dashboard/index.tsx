import React from "react";
import Cookies from "js-cookie";
import { useMutation } from "react-query";
import { Navigate } from "react-router-dom";
import { Button } from "primereact/button";

import { createWorkout } from "@services/workout";

export default function Dashboard() {
  const userID = Cookies.get("user_id");

  const createWorkoutReq = useMutation("createWorkout", createWorkout);

  const handleNewWorkoutClick = async () => {
    if (userID) {
      await createWorkoutReq.mutateAsync({ userID, start_time: Date.now() });
    }
  };

  if (createWorkoutReq.isSuccess) {
    return <Navigate to={`/workout/${createWorkoutReq.data.id}`} replace={true} />;
  }

  return (
    <>
      <Button
        className='p-button-info'
        type='button'
        label='Mog Now'
        onClick={handleNewWorkoutClick}
      />
    </>
  );
}
