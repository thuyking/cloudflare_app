import {
  Button,
  Card,
  Descriptions,
  Result,
  Space,
  Typography,
  message,
} from "antd";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getWorkoutById } from "../../api";
import { AppLoading } from "../../components/common";
import type { Workout } from "../../types";
import { getErrorMessage } from "../../utils";

const { Title } = Typography;

function parseWorkoutId(id: string | undefined) {
  if (!id) {
    return null;
  }

  const workoutId = Number(id);
  return Number.isInteger(workoutId) && workoutId > 0 ? workoutId : null;
}

function renderNullable(value: number | string | null) {
  return value ?? "-";
}

export default function WorkoutDetailPage() {
  const { id } = useParams();
  const workoutId = useMemo(() => parseWorkoutId(id), [id]);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(false);
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
        const data = await getWorkoutById(validWorkoutId);

        if (isMounted) {
          setWorkout(data);
        }
      } catch (err: unknown) {
        if (!isMounted) {
          return;
        }

        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setErrorStatus("not-found");
          setWorkout(null);
          messageApi.error("Workout does not exist.");
          return;
        }

        setErrorStatus("error");
        setWorkout(null);
        messageApi.error(
          getErrorMessage(err, "Cannot load workout. Please try again."),
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
          Workout Detail
        </Title>
        <Space wrap>
          <Button>
            <Link to="/workouts">Back to list</Link>
          </Button>
          <Button type="primary">
            <Link to={`/workouts/${workoutId}/edit`}>Edit workout</Link>
          </Button>
        </Space>
      </div>

      <AppLoading spinning={loading} tip="Loading workout...">
        {workout && (
          <div className="overflow-x-auto">
            <Descriptions bordered column={{ xs: 1, md: 2 }}>
              <Descriptions.Item label="ID">{workout.id}</Descriptions.Item>
              <Descriptions.Item label="User ID">
                {workout.user_id}
              </Descriptions.Item>
              <Descriptions.Item label="Title">
                {workout.title}
              </Descriptions.Item>
              <Descriptions.Item label="Exercise Type">
                {workout.exercise_type}
              </Descriptions.Item>
              <Descriptions.Item label="Duration">
                {renderNullable(workout.duration)}
              </Descriptions.Item>
              <Descriptions.Item label="Duration Unit">
                {renderNullable(workout.duration_unit)}
              </Descriptions.Item>
              <Descriptions.Item label="Sets">
                {renderNullable(workout.sets)}
              </Descriptions.Item>
              <Descriptions.Item label="Reps">
                {renderNullable(workout.reps)}
              </Descriptions.Item>
              <Descriptions.Item label="Calories Burned">
                {workout.calories_burned}
              </Descriptions.Item>
              <Descriptions.Item label="Workout Date">
                {workout.workout_date}
              </Descriptions.Item>
              <Descriptions.Item label="Notes" span={2}>
                {renderNullable(workout.notes)}
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {workout.created_at}
              </Descriptions.Item>
              <Descriptions.Item label="Updated At">
                {workout.updated_at}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </AppLoading>
    </Card>
  );
}
