import {
  Button,
  Card,
  Checkbox,
  DatePicker,
  Empty,
  Form,
  Input,
  InputNumber,
  List,
  Modal,
  Popconfirm,
  Space,
  Tag,
  Typography,
  message,
} from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import type { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import {
  createWorkoutPlan,
  getWorkoutPlans,
  removeWorkoutPlan,
  toggleWorkoutPlanExercise,
} from "../../api";
import { AppLoading } from "../../components/common";
import type { CreateWorkoutPlanPayload, WorkoutPlan } from "../../types";
import { getErrorMessage } from "../../utils";

const { Title, Text } = Typography;
const DATE_FORMAT = "YYYY-MM-DD";

interface WorkoutPlanFormExerciseValues {
  exercise_name?: string;
  sets?: number;
  reps?: number;
  hold_seconds?: number;
}

interface WorkoutPlanFormValues {
  name: string;
  plan_date: Dayjs;
  exercises?: WorkoutPlanFormExerciseValues[];
}

function isCompleted(value: number) {
  return value === 1;
}

function renderNullableNumber(value: number | null, suffix = "") {
  return value === null ? "-" : `${value}${suffix}`;
}

function toCreatePayload(values: WorkoutPlanFormValues): CreateWorkoutPlanPayload {
  return {
    name: values.name.trim(),
    plan_date: values.plan_date.format(DATE_FORMAT),
    exercises: (values.exercises ?? []).map((exercise) => ({
      exercise_name: exercise.exercise_name?.trim() ?? "",
      sets: exercise.sets,
      reps: exercise.reps,
      hold_seconds: exercise.hold_seconds,
    })),
  };
}

export default function WorkoutPlanPage() {
  const [form] = Form.useForm<WorkoutPlanFormValues>();
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [togglingExerciseId, setTogglingExerciseId] = useState<number | null>(
    null,
  );
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    let isMounted = true;

    async function loadPlans() {
      try {
        setLoading(true);
        setError(null);
        const data = await getWorkoutPlans();

        if (isMounted) {
          setPlans(data);
        }
      } catch (error: unknown) {
        const errorMessage = getErrorMessage(
          error,
          "Cannot load workout plans. Please try again.",
        );

        if (isMounted) {
          setError(errorMessage);
          messageApi.error(errorMessage);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadPlans();

    return () => {
      isMounted = false;
    };
  }, [messageApi]);

  async function handleCreate(values: WorkoutPlanFormValues) {
    try {
      setCreating(true);
      await createWorkoutPlan(toCreatePayload(values));
      messageApi.success("Workout plan created successfully.");
      setCreateModalOpen(false);
      form.resetFields();
      const data = await getWorkoutPlans();
      setPlans(data);
    } catch (error: unknown) {
      messageApi.error(
        getErrorMessage(error, "Cannot create workout plan. Please try again."),
      );
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(planId: number) {
    if (deletingId === planId) {
      return;
    }

    try {
      setDeletingId(planId);
      const deleted = await removeWorkoutPlan(planId);

      if (!deleted) {
        messageApi.error("Workout plan does not exist.");
        return;
      }

      setPlans((currentPlans) =>
        currentPlans.filter((plan) => plan.id !== planId),
      );
      messageApi.success("Workout plan deleted successfully.");
    } catch (error: unknown) {
      messageApi.error(
        getErrorMessage(error, "Cannot delete workout plan. Please try again."),
      );
    } finally {
      setDeletingId(null);
    }
  }

  async function handleToggleExercise(
    planId: number,
    exerciseId: number,
    event: CheckboxChangeEvent,
  ) {
    event.preventDefault();

    if (togglingExerciseId === exerciseId) {
      return;
    }

    try {
      setTogglingExerciseId(exerciseId);
      const response = await toggleWorkoutPlanExercise(planId, exerciseId);
      setPlans((currentPlans) =>
        currentPlans.map((plan) =>
          plan.id === planId
            ? {
                ...plan,
                exercises: plan.exercises.map((exercise) =>
                  exercise.id === exerciseId
                    ? {
                        ...exercise,
                        is_completed: response.data.is_completed ? 1 : 0,
                      }
                    : exercise,
                ),
              }
            : plan,
        ),
      );
      messageApi.success("Exercise status updated successfully.");
    } catch (error: unknown) {
      messageApi.error(
        getErrorMessage(
          error,
          "Cannot update exercise status. Please try again.",
        ),
      );
    } finally {
      setTogglingExerciseId(null);
    }
  }

  return (
    <Card>
      {contextHolder}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Title className="mb-0" level={2}>
          Workout Plans
        </Title>
        <Button type="primary" onClick={() => setCreateModalOpen(true)}>
          Create plan
        </Button>
      </div>

      <AppLoading spinning={loading} tip="Loading workout plans...">
        {plans.length === 0 ? (
          <Empty description={error ?? "No workout plans yet."} />
        ) : (
          <List
            dataSource={plans}
            rowKey="id"
            renderItem={(plan) => (
              <List.Item>
                <Card className="w-full">
                  <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <Space wrap>
                      <Text strong>{plan.name}</Text>
                      <Tag color="blue">{plan.plan_date}</Tag>
                    </Space>
                    <Popconfirm
                      cancelText="Cancel"
                      description="This will delete the plan and its exercises."
                      disabled={deletingId === plan.id}
                      okButtonProps={{ loading: deletingId === plan.id }}
                      okText="Delete"
                      onConfirm={() => {
                        void handleDelete(plan.id);
                      }}
                      title="Delete this workout plan?"
                    >
                      <Button
                        danger
                        disabled={deletingId === plan.id}
                        loading={deletingId === plan.id}
                        size="small"
                        type="link"
                      >
                        Delete
                      </Button>
                    </Popconfirm>
                  </div>

                  {plan.exercises.length === 0 ? (
                    <Empty description="No exercises in this plan." />
                  ) : (
                    <List
                      dataSource={plan.exercises}
                      rowKey="id"
                      renderItem={(exercise) => {
                        const completed = isCompleted(exercise.is_completed);

                        return (
                          <List.Item>
                            <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                              <Space direction="vertical" size={2}>
                                <Checkbox
                                  checked={completed}
                                  disabled={
                                    togglingExerciseId === exercise.id
                                  }
                                  onChange={(event) => {
                                    void handleToggleExercise(
                                      plan.id,
                                      exercise.id,
                                      event,
                                    );
                                  }}
                                >
                                  {exercise.exercise_name}
                                </Checkbox>
                                <Space wrap size="small">
                                  <Text type="secondary">
                                    Sets:{" "}
                                    {renderNullableNumber(exercise.sets)}
                                  </Text>
                                  <Text type="secondary">
                                    Reps:{" "}
                                    {renderNullableNumber(exercise.reps)}
                                  </Text>
                                  <Text type="secondary">
                                    Hold:{" "}
                                    {renderNullableNumber(
                                      exercise.hold_seconds,
                                      "s",
                                    )}
                                  </Text>
                                </Space>
                              </Space>
                              <Tag color={completed ? "green" : "default"}>
                                {completed ? "Completed" : "Pending"}
                              </Tag>
                            </div>
                          </List.Item>
                        );
                      }}
                    />
                  )}
                </Card>
              </List.Item>
            )}
          />
        )}
      </AppLoading>

      <Modal
        confirmLoading={creating}
        okText="Create"
        onCancel={() => setCreateModalOpen(false)}
        onOk={() => form.submit()}
        open={createModalOpen}
        title="Create Workout Plan"
      >
        <Form<WorkoutPlanFormValues>
          form={form}
          layout="vertical"
          onFinish={handleCreate}
          requiredMark={false}
        >
          <Form.Item<WorkoutPlanFormValues>
            label="Plan Name"
            name="name"
            rules={[{ required: true, message: "Please enter plan name." }]}
          >
            <Input placeholder="Push day" />
          </Form.Item>

          <Form.Item<WorkoutPlanFormValues>
            label="Plan Date"
            name="plan_date"
            rules={[{ required: true, message: "Please select plan date." }]}
          >
            <DatePicker className="w-full" format={DATE_FORMAT} />
          </Form.Item>

          <Form.List name="exercises" initialValue={[{}]}>
            {(fields, { add, remove }) => (
              <Space className="w-full" direction="vertical">
                {fields.map((field) => (
                  <Card
                    key={field.key}
                    size="small"
                    title={`Exercise ${field.name + 1}`}
                    extra={
                      fields.length > 1 ? (
                        <Button
                          danger
                          size="small"
                          type="link"
                          onClick={() => remove(field.name)}
                        >
                          Remove
                        </Button>
                      ) : null
                    }
                  >
                    <Form.Item
                      label="Exercise Name"
                      name={[field.name, "exercise_name"]}
                      rules={[
                        {
                          required: true,
                          message: "Please enter exercise name.",
                        },
                      ]}
                    >
                      <Input placeholder="Push up" />
                    </Form.Item>

                    <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-3">
                      <Form.Item label="Sets" name={[field.name, "sets"]}>
                        <InputNumber className="w-full" min={1} />
                      </Form.Item>
                      <Form.Item label="Reps" name={[field.name, "reps"]}>
                        <InputNumber className="w-full" min={1} />
                      </Form.Item>
                      <Form.Item
                        label="Hold Seconds"
                        name={[field.name, "hold_seconds"]}
                      >
                        <InputNumber className="w-full" min={1} />
                      </Form.Item>
                    </div>
                  </Card>
                ))}

                <Button type="dashed" onClick={() => add()}>
                  Add exercise
                </Button>
              </Space>
            )}
          </Form.List>
        </Form>
      </Modal>
    </Card>
  );
}
