import { Button, Card, Space, Typography, message } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createWorkout } from "../../api";
import { WorkoutForm } from "../../components/workout";
import type { CreateWorkoutPayload } from "../../types";
import { getErrorMessage } from "../../utils";

const { Title } = Typography;

export default function WorkoutCreatePage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(payload: CreateWorkoutPayload) {
    try {
      setSubmitting(true);
      await createWorkout(payload);
      messageApi.success("Workout created successfully.");
      navigate("/workouts");
    } catch (error: unknown) {
      messageApi.error(
        getErrorMessage(error, "Cannot create workout. Please try again."),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      {contextHolder}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Title className="mb-0" level={2}>
          Create Workout
        </Title>
        <Space wrap>
          <Button>
            <Link to="/workouts">Cancel</Link>
          </Button>
        </Space>
      </div>

      <WorkoutForm
        onSubmit={handleSubmit}
        submitText="Create workout"
        submitting={submitting}
      />
    </Card>
  );
}
