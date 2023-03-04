import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

import { WorkoutForm } from "./forms/WorkoutForm";

export default function Workout() {
  const [isActive, setIsActive] = useState(false);

  const handleNewWorkoutClick = async () => {
    setIsActive(true);
  };

  const handleHide = () => {
    setIsActive(false);
  };

  return (
    <div data-testid='workoutPage'>
      <div>Start workout from template?</div>
      <div>
        <Button label='Start from scratch' onClick={handleNewWorkoutClick} />
      </div>
      <Dialog onHide={handleHide} visible={isActive} position='top'>
        <WorkoutForm />
      </Dialog>
    </div>
  );
}
