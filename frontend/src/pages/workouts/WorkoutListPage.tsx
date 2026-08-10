import {
  Alert,
  Button,
  Card,
  Empty,
  Pagination,
  Popconfirm,
  Skeleton,
  Space,
  Tag,
  Typography,
  message,
} from "antd";
import {
  CalendarOutlined,
  EditOutlined,
  EyeOutlined,
  FieldTimeOutlined,
  FireOutlined,
  PlusOutlined,
  ReloadOutlined,
  ThunderboltOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getWorkouts, removeWorkout } from "../../api";
import type { Workout } from "../../types";
import { getErrorMessage } from "../../utils";

const { Title, Text, Paragraph } = Typography;
const PAGE_SIZE = 10;

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function renderNullable(value: number | string | null) {
  return value ?? "-";
}

function renderDuration(workout: Workout) {
  if (workout.duration === null) {
    return "No duration";
  }

  return workout.duration_unit
    ? `${workout.duration} ${workout.duration_unit}`
    : `${workout.duration}`;
}

function workoutVolume(workout: Workout) {
  const sets = workout.sets === null ? "-" : workout.sets.toLocaleString();
  const reps = workout.reps === null ? "-" : workout.reps.toLocaleString();

  return `${sets} sets / ${reps} reps`;
}

function WorkoutMetric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-[rgba(38,49,61,0.78)] bg-[rgba(13,17,23,0.58)] px-3 py-2">
      <Text className="block !text-[12px] !font-bold !uppercase !tracking-normal !text-[var(--wt-text-subtle)]">
        {label}
      </Text>
      <Text className="block truncate !font-mono !text-sm !font-bold !text-[var(--wt-text)]">
        {value}
      </Text>
    </div>
  );
}

function WorkoutListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }, (_, index) => (
        <Card
          className="!rounded-lg !border-[var(--wt-border)] !bg-[rgba(20,26,33,0.68)]"
          key={index}
        >
          <Skeleton active paragraph={{ rows: 2 }} />
        </Card>
      ))}
    </div>
  );
}

export default function WorkoutListPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [messageApi, contextHolder] = message.useMessage();

  const loadWorkouts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getWorkouts();
      setWorkouts(data);
      setCurrentPage(1);
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(
        err,
        "Cannot load workouts. Please try again.",
      );

      setError(errorMessage);
      messageApi.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [messageApi]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadWorkouts();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadWorkouts]);

  async function handleDelete(workoutId: number) {
    if (deletingId === workoutId) {
      return;
    }

    try {
      setDeletingId(workoutId);
      await removeWorkout(workoutId);
      setWorkouts((currentWorkouts) => {
        const nextWorkouts = currentWorkouts.filter(
          (workout) => workout.id !== workoutId,
        );
        const lastPage = Math.max(1, Math.ceil(nextWorkouts.length / PAGE_SIZE));

        setCurrentPage((page) => Math.min(page, lastPage));

        return nextWorkouts;
      });
      messageApi.success("Workout deleted successfully.");
    } catch (err: unknown) {
      messageApi.error(
        getErrorMessage(err, "Cannot delete workout. Please try again."),
      );
    } finally {
      setDeletingId(null);
    }
  }

  const pagedWorkouts = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;

    return workouts.slice(startIndex, startIndex + PAGE_SIZE);
  }, [currentPage, workouts]);

  const totalCalories = workouts.reduce(
    (total, workout) => total + workout.calories_burned,
    0,
  );
  const latestWorkout = workouts[0] ?? null;
  const showingStart =
    workouts.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const showingEnd = Math.min(currentPage * PAGE_SIZE, workouts.length);

  return (
    <div className="space-y-6">
      {contextHolder}

      <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <Text className="!text-sm !font-bold !uppercase !tracking-normal !text-[var(--wt-primary)]">
            Workout log
          </Text>
          <Title
            className="!mb-3 !mt-2 !text-3xl !font-black !leading-tight !text-[var(--wt-text)] sm:!text-4xl"
            level={1}
          >
            Training history
          </Title>
          <Paragraph className="!m-0 max-w-2xl !text-base !text-[var(--wt-text-muted)]">
            Scan logged workouts, compare key training details, and jump into
            the record you need.
          </Paragraph>
        </div>

        <Button icon={<PlusOutlined />} type="primary">
          <Link to="/workouts/new">Add workout</Link>
        </Button>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-[rgba(182,255,59,0.22)] bg-[rgba(182,255,59,0.07)] p-4">
          <Text className="block !text-[12px] !font-bold !uppercase !tracking-normal !text-[var(--wt-text-subtle)]">
            Total workouts
          </Text>
          <Text className="mt-2 block !font-mono !text-3xl !font-bold !leading-none !text-[var(--wt-text)]">
            {workouts.length.toLocaleString()}
          </Text>
        </div>
        <div className="rounded-lg border border-[rgba(251,191,36,0.2)] bg-[rgba(251,191,36,0.06)] p-4">
          <Text className="block !text-[12px] !font-bold !uppercase !tracking-normal !text-[var(--wt-text-subtle)]">
            Calories burned
          </Text>
          <Text className="mt-2 block !font-mono !text-3xl !font-bold !leading-none !text-[var(--wt-text)]">
            {totalCalories.toLocaleString()}
          </Text>
        </div>
        <div className="rounded-lg border border-[rgba(56,189,248,0.2)] bg-[rgba(56,189,248,0.06)] p-4">
          <Text className="block !text-[12px] !font-bold !uppercase !tracking-normal !text-[var(--wt-text-subtle)]">
            Latest session
          </Text>
          <Text className="mt-2 block truncate !text-lg !font-bold !text-[var(--wt-text)]">
            {latestWorkout ? latestWorkout.title : "No workouts yet"}
          </Text>
          {latestWorkout ? (
            <Text className="block !text-sm !text-[var(--wt-text-muted)]">
              {formatDate(latestWorkout.workout_date)}
            </Text>
          ) : null}
        </div>
      </section>

      {error ? (
        <Alert
          action={
            <Button icon={<ReloadOutlined />} onClick={loadWorkouts}>
              Retry
            </Button>
          }
          className="!rounded-lg !border-[rgba(248,113,113,0.28)] !bg-[rgba(248,113,113,0.08)]"
          description={error}
          message="Workout list could not load"
          showIcon
          type="error"
        />
      ) : null}

      <section className="min-w-0">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <Title
              className="!m-0 !text-xl !font-bold !text-[var(--wt-text)] sm:!text-2xl"
              level={2}
            >
              Saved workouts
            </Title>
            <Text className="mt-1 block !text-sm !text-[var(--wt-text-muted)]">
              {workouts.length > 0
                ? `Showing ${showingStart}-${showingEnd} of ${workouts.length} workouts`
                : "No saved workouts to show"}
            </Text>
          </div>
          <Space wrap size={[8, 8]}>
            <Tag className="!m-0" icon={<UnorderedListOutlined />}>
              Date ordered
            </Tag>
            <Tag className="!m-0" icon={<ThunderboltOutlined />}>
              Client pagination
            </Tag>
          </Space>
        </div>

        {loading && workouts.length === 0 ? (
          <WorkoutListSkeleton />
        ) : workouts.length === 0 && !error ? (
          <Card className="!rounded-lg !border-dashed !border-[rgba(182,255,59,0.28)] !bg-[rgba(182,255,59,0.05)]">
            <Empty
              description={
                <span className="text-[var(--wt-text-muted)]">
                  No workouts have been logged yet.
                </span>
              }
            >
              <Button icon={<PlusOutlined />} type="primary">
                <Link to="/workouts/new">Add workout</Link>
              </Button>
            </Empty>
          </Card>
        ) : (
          <div className="space-y-3">
            {pagedWorkouts.map((workout) => (
              <article
                className="rounded-lg border border-[var(--wt-border)] bg-[rgba(20,26,33,0.72)] p-4 transition-colors hover:border-[rgba(182,255,59,0.34)] hover:bg-[rgba(20,26,33,0.92)]"
                key={workout.id}
              >
                <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.78fr)_auto] xl:items-center">
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Title
                        className="!m-0 !text-xl !font-bold !text-[var(--wt-text)]"
                        level={3}
                      >
                        {workout.title}
                      </Title>
                      <Tag className="!m-0" color="lime">
                        {workout.exercise_type}
                      </Tag>
                    </div>
                    <Space wrap size={[14, 4]}>
                      <Text className="!text-sm !text-[var(--wt-text-muted)]">
                        <CalendarOutlined /> {formatDate(workout.workout_date)}
                      </Text>
                      <Text className="!text-sm !text-[var(--wt-text-muted)]">
                        <FieldTimeOutlined /> {renderDuration(workout)}
                      </Text>
                      <Text className="!text-sm !text-[var(--wt-text-muted)]">
                        <FireOutlined />{" "}
                        {workout.calories_burned.toLocaleString()} calories
                      </Text>
                    </Space>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-4">
                    <WorkoutMetric
                      label="Sets"
                      value={renderNullable(workout.sets)}
                    />
                    <WorkoutMetric
                      label="Reps"
                      value={renderNullable(workout.reps)}
                    />
                    <WorkoutMetric label="Volume" value={workoutVolume(workout)} />
                    <WorkoutMetric
                      label="ID"
                      value={`#${workout.id.toLocaleString()}`}
                    />
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row xl:flex-col">
                    <Button icon={<EyeOutlined />}>
                      <Link to={`/workouts/${workout.id}`}>View</Link>
                    </Button>
                    <Button icon={<EditOutlined />}>
                      <Link to={`/workouts/${workout.id}/edit`}>Edit</Link>
                    </Button>
                    <Popconfirm
                      cancelText="Cancel"
                      description="This action cannot be undone."
                      disabled={deletingId === workout.id}
                      okButtonProps={{ loading: deletingId === workout.id }}
                      okText="Delete"
                      onConfirm={() => {
                        void handleDelete(workout.id);
                      }}
                      title="Delete this workout?"
                    >
                      <Button
                        danger
                        disabled={deletingId === workout.id}
                        loading={deletingId === workout.id}
                      >
                        Delete
                      </Button>
                    </Popconfirm>
                  </div>
                </div>
              </article>
            ))}

            {workouts.length > PAGE_SIZE ? (
              <div className="flex justify-center pt-2 sm:justify-end">
                <Pagination
                  current={currentPage}
                  onChange={setCurrentPage}
                  pageSize={PAGE_SIZE}
                  showSizeChanger={false}
                  total={workouts.length}
                />
              </div>
            ) : null}
          </div>
        )}
      </section>
    </div>
  );
}
