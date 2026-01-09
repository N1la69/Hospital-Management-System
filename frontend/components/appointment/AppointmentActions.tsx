"use client";

import {
  cancelAppointment,
  checkInAppointment,
  completeAppointment,
  markNoShow,
  startAppointment,
} from "@/lib/api/appointment.api";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  canCancel,
  canCheckIn,
  canComplete,
  canNoShow,
  canStart,
} from "@/lib/utils/appointmentActions";
import { AppointmentResponse } from "@/types/appointment";
import { useState } from "react";

interface Props {
  appointment: AppointmentResponse;
  onUpdated: () => void;
}

const AppointmentActions = ({ appointment, onUpdated }: Props) => {
  const { roles } = useAuth();
  const [confirm, setConfirm] = useState<null | (() => Promise<void>)>(null);

  const run = async (action: () => Promise<void>) => {
    await action();
    setConfirm(null);
    onUpdated();
  };

  return (
    <>
      <div className="flex gap-2">
        {canCheckIn(roles, appointment.status) && (
          <button onClick={() => run(() => checkInAppointment(appointment.id))}>
            Check-In
          </button>
        )}

        {canStart(roles, appointment.status) && (
          <button onClick={() => run(() => startAppointment(appointment.id))}>
            Start
          </button>
        )}

        {canComplete(roles, appointment.status) && (
          <button
            onClick={() => run(() => completeAppointment(appointment.id))}
          >
            Complete
          </button>
        )}

        {canCancel(roles, appointment.status) && (
          <button
            onClick={() =>
              setConfirm(
                () => () =>
                  cancelAppointment(appointment.id, "Cancelled by user")
              )
            }
          >
            Cancel
          </button>
        )}

        {canNoShow(roles, appointment.status) && (
          <button
            onClick={() => setConfirm(() => () => markNoShow(appointment.id))}
          >
            No-Show
          </button>
        )}
      </div>
    </>
  );
};

export default AppointmentActions;
