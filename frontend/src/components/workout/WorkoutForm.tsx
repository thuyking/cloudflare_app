import { Button, DatePicker, Form, Input, InputNumber, Select } from "antd";
import type { Dayjs } from "dayjs";
import { useEffect } from "react";
import type { CreateWorkoutPayload } from "../../types";

const DATE_FORMAT = "YYYY-MM-DD";

export interface WorkoutFormValues {
  title: string;
  exercise_type: string;
  duration?: number;
  duration_unit?: string;
  sets?: number;
  reps?: number;
  calories_burned: number;
  workout_date: Dayjs;
  notes?: string;
}

interface WorkoutFormProps {
  initialValues?: Partial<WorkoutFormValues>;
  submitting?: boolean;
  submitText: string;
  onSubmit: (payload: CreateWorkoutPayload) => void | Promise<void>;
}

function toCreateWorkoutPayload(values: WorkoutFormValues): CreateWorkoutPayload {
  const durationUnit = values.duration_unit?.trim() || undefined;
  const notes = values.notes?.trim() || undefined;

  return {
    title: values.title.trim(),
    exercise_type: values.exercise_type.trim(),
    duration: values.duration,
    duration_unit: durationUnit,
    sets: values.sets,
    reps: values.reps,
    calories_burned: values.calories_burned,
    workout_date: values.workout_date.format(DATE_FORMAT),
    notes,
  };
}

export default function WorkoutForm({
  initialValues,
  submitting = false,
  submitText,
  onSubmit,
}: WorkoutFormProps) {
  const [form] = Form.useForm<WorkoutFormValues>();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [form, initialValues]);

  const handleFinish = (values: WorkoutFormValues) => {
    return onSubmit(toCreateWorkoutPayload(values));
  };

  return (
    <Form<WorkoutFormValues>
      className="w-full max-w-2xl px-0 sm:px-1"
      form={form}
      initialValues={initialValues}
      layout="vertical"
      onFinish={handleFinish}
      requiredMark={false}
    >
      <Form.Item<WorkoutFormValues>
        label="Title"
        name="title"
        rules={[{ required: true, message: "Please enter workout title." }]}
      >
        <Input placeholder="Morning run" />
      </Form.Item>

      <Form.Item<WorkoutFormValues>
        label="Exercise Type"
        name="exercise_type"
        rules={[{ required: true, message: "Please enter exercise type." }]}
      >
        <Input placeholder="running, strength, yoga..." />
      </Form.Item>

      <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
        <Form.Item<WorkoutFormValues>
          label="Duration"
          name="duration"
          rules={[
            {
              type: "number",
              min: 1,
              message: "Duration must be greater than 0.",
            },
          ]}
        >
          <InputNumber className="w-full" min={1} placeholder="30" />
        </Form.Item>

        <Form.Item<WorkoutFormValues>
          label="Duration Unit"
          name="duration_unit"
        >
          <Select
            allowClear
            options={[
              { label: "Minutes", value: "minutes" },
              { label: "Hours", value: "hours" },
              { label: "Seconds", value: "seconds" },
            ]}
            placeholder="Select unit"
          />
        </Form.Item>
      </div>

      <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
        <Form.Item<WorkoutFormValues>
          label="Sets"
          name="sets"
          rules={[
            {
              type: "number",
              min: 1,
              message: "Sets must be greater than 0.",
            },
          ]}
        >
          <InputNumber className="w-full" min={1} placeholder="3" />
        </Form.Item>

        <Form.Item<WorkoutFormValues>
          label="Reps"
          name="reps"
          rules={[
            {
              type: "number",
              min: 1,
              message: "Reps must be greater than 0.",
            },
          ]}
        >
          <InputNumber className="w-full" min={1} placeholder="12" />
        </Form.Item>
      </div>

      <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
        <Form.Item<WorkoutFormValues>
          label="Calories Burned"
          name="calories_burned"
          rules={[
            { required: true, message: "Please enter calories burned." },
            {
              type: "number",
              min: 0,
              message: "Calories burned cannot be negative.",
            },
          ]}
        >
          <InputNumber className="w-full" min={0} placeholder="250" />
        </Form.Item>

        <Form.Item<WorkoutFormValues>
          label="Workout Date"
          name="workout_date"
          rules={[{ required: true, message: "Please select workout date." }]}
        >
          <DatePicker className="w-full" format={DATE_FORMAT} />
        </Form.Item>
      </div>

      <Form.Item<WorkoutFormValues> label="Notes" name="notes">
        <Input.TextArea placeholder="Optional notes" rows={4} />
      </Form.Item>

      <Form.Item>
        <Button
          className="w-full sm:w-auto"
          htmlType="submit"
          loading={submitting}
          type="primary"
        >
          {submitText}
        </Button>
      </Form.Item>
    </Form>
  );
}
