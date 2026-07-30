import { Button, Card, Result, Space, Typography, message } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getWorkoutById, updateWorkout } from "../../api";
import { AppLoading } from "../../components/common";
import { WorkoutForm } from "../../components/workout";
import type { WorkoutFormValues } from "../../components/workout";
import type { CreateWorkoutPayload, Workout } from "../../types";
import { getErrorMessage } from "../../utils";

const { Title } = Typography;

function parseWorkoutId(id: string | undefined) {
  if (!id) {
    return null;
  }

  const workoutId = Number(id);
  return Number.isInteger(workoutId) && workoutId > 0 ? workoutId : null;
}

function toWorkoutFormValues(workout: Workout): WorkoutFormValues {
  return {
    title: workout.title,
    exercise_type: workout.exercise_type,
    duration: workout.duration ?? undefined,
    duration_unit: workout.duration_unit ?? undefined,
    sets: workout.sets ?? undefined,
    reps: workout.reps ?? undefined,
    calories_burned: workout.calories_burned,
    workout_date: dayjs(workout.workout_date),
    notes: workout.notes ?? undefined,
  };
}

export default function WorkoutEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const workoutId = useMemo(() => parseWorkoutId(id), [id]);
  const [initialValues, setInitialValues] =
    useState<WorkoutFormValues | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorStatus, setErrorStatus] = useState<"not-found" | "error" | null>(
    null,
  );
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (workoutId === null) {
      return;
    }

    const validWorkoutId = workoutId;
    let isMounted = true;

    async function loadWorkout() {
      try {
        setLoading(true);
        setErrorStatus(null);
        const workout = await getWorkoutById(validWorkoutId);

        if (isMounted) {
          setInitialValues(toWorkoutFormValues(workout));
        }
      } catch (error: unknown) {
        if (!isMounted) {
          return;
        }

        setInitialValues(null);

        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setErrorStatus("not-found");
          messageApi.error("Workout does not exist.");
          return;
        }

        setErrorStatus("error");
        messageApi.error(
          getErrorMessage(error, "Cannot load workout. Please try again."),
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadWorkout();

    return () => {
      isMounted = false;
    };
  }, [messageApi, workoutId]);

  async function handleSubmit(payload: CreateWorkoutPayload) {
    if (workoutId === null) {
      return;
    }

    try {
      setSubmitting(true);
      const updatedWorkout = await updateWorkout(workoutId, payload);
      messageApi.success("Workout updated successfully.");
      navigate(`/workouts/${updatedWorkout.id}`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setErrorStatus("not-found");
        messageApi.error("Workout does not exist.");
        return;
      }

      messageApi.error(
        getErrorMessage(error, "Cannot update workout. Please try again."),
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (workoutId === null) {
    return (
      <Result
        extra={
          <Button type="primary">
            <Link to="/workouts">Back to list</Link>
          </Button>
        }
        status="warning"
        subTitle="Please check the workout id in the URL."
        title="Invalid workout id"
      />
    );
  }

  if (errorStatus === "not-found") {
    return (
      <Result
        extra={
          <Button type="primary">
            <Link to="/workouts">Back to list</Link>
          </Button>
        }
        status="404"
        subTitle="The workout may have been deleted or belongs to another account."
        title="Workout does not exist"
      />
    );
  }

  if (errorStatus === "error") {
    return (
      <Result
        extra={
          <Button type="primary">
            <Link to="/workouts">Back to list</Link>
          </Button>
        }
        status="error"
        subTitle="Cannot load workout. Please try again."
        title="Something went wrong"
      />
    );
  }

  return (
    <Card>
      {contextHolder}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Title className="mb-0" level={2}>
          Edit Workout
        </Title>
        <Space wrap>
          <Button>
            <Link to={`/workouts/${workoutId}`}>Cancel</Link>
          </Button>
        </Space>
      </div>

      <AppLoading spinning={loading} tip="Loading workout...">
        {initialValues && (
          <WorkoutForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            submitText="Update workout"
            submitting={submitting}
          />
        )}
      </AppLoading>
    </Card>
  );
}
