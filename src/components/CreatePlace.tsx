import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { AddPlaceStep1 } from "@/components/AddPlaceStep1";
import { AddPlaceStep2 } from "@/components/AddPlaceStep2";
import type { Place } from "@/lib/zod/schemas";

export function CreatePlace() {
  const navigate = useNavigate();
  const [step, setStep] = React.useState<1 | 2>(1);
  const [placeId, setPlaceId] = React.useState<string | null>(null);

  // Handle completion of Step 1
  const handleStep1Success = (place: Place) => {
    setPlaceId(place.id);
    setStep(2);
  };

  // Handle cancel at any step
  const handleCancel = () => {
    navigate({ to: "/places" });
  };

  // Handle completion of Step 2 (final step)
  const handleStep2Complete = () => {
    navigate({ to: "/places" });
  };

  return (
    <>
      {step === 1 && (
        <AddPlaceStep1
          onCancel={handleCancel}
          onSuccess={handleStep1Success}
        />
      )}
      {step === 2 && placeId && (
        <AddPlaceStep2
          placeId={placeId}
          onComplete={handleStep2Complete}
        />
      )}
    </>
  );
}
