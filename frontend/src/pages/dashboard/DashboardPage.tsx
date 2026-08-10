import {
  Alert,
  Button,
  Card,
  Empty,
  Progress,
  Skeleton,
  Space,
  Tag,
  Typography,
  message,
} from "antd";
import {
  CalendarOutlined,
  FieldTimeOutlined,
  FireOutlined,
  PlusOutlined,
  ReloadOutlined,
  RightOutlined,
  ScheduleOutlined,
  ThunderboltOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getWorkoutPlans, getWorkouts } from "../../api";
import type { Workout, WorkoutPlan } from "../../types";
import { getErrorMessage } from "../../utils";

const { Title, Text, Paragraph } = Typography;

interface DashboardStat {
  label: string;
  value: string;
  helper: string;
  tone: "primary" | "info" | "success" | "warning";
}

interface PlanProgress {
  completed: number;
  total: number;
  percent: number;
}

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

function compareDateDesc(left: string, right: string) {
  return new Date(right).getTime() - new Date(left).getTime();
}

function renderDuration(workout: Workout) {
  if (workout.duration === null) {
    return "No duration";
  }

  return workout.duration_unit
    ? `${workout.duration} ${workout.duration_unit}`
    : `${workout.duration}`;
}

function planProgress(plan: WorkoutPlan): PlanProgress {
  const total = plan.exercises.length;
  const completed = plan.exercises.filter(
    (exercise) => exercise.is_completed === 1,
  ).length;

  return {
    completed,
    total,
    percent: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

function isToday(value: string) {
  const date = new Date(value);
  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

function isFutureOrToday(value: string) {
  const date = new Date(value);
  const today = new Date();

  date.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return date.getTime() >= today.getTime();
}

function DashboardStatCard({ label, value, helper, tone }: DashboardStat) {
  const toneClassName = {
    primary: "border-[rgba(182,255,59,0.24)] bg-[rgba(182,255,59,0.08)] text-[var(--wt-primary)]",
    info: "border-[rgba(56,189,248,0.24)] bg-[rgba(56,189,248,0.08)] text-[var(--wt-info)]",
    success: "border-[rgba(52,211,153,0.24)] bg-[rgba(52,211,153,0.08)] text-[var(--wt-success)]",
    warning: "border-[rgba(251,191,36,0.24)] bg-[rgba(251,191,36,0.08)] text-[var(--wt-warning)]",
  }[tone];

  return (
    <Card className="h-full !rounded-lg !border-[var(--wt-border)] !bg-[rgba(20,26,33,0.78)]">
      <div className="flex h-full flex-col justify-between gap-4">
        <div className="flex items-start justify-between gap-3">
          <Text className="!text-[13px] !font-bold !uppercase !tracking-normal !text-[var(--wt-text-subtle)]">
            {label}
          </Text>
          <span
            aria-hidden="true"
            className={`h-3 w-3 shrink-0 rounded-full border ${toneClassName}`}
          />
        </div>
        <div>
          <div className="font-mono text-3xl font-bold leading-none text-[var(--wt-text)] sm:text-4xl">
            {value}
          </div>
          <Text className="mt-2 block !text-sm !text-[var(--wt-text-muted)]">
            {helper}
          </Text>
        </div>
      </div>
    </Card>
  );
}

function DashboardSection({
  action,
  children,
  description,
  title,
}: {
  action?: React.ReactNode;
  children: React.ReactNode;
  description?: string;
  title: string;
}) {
  return (
    <section className="min-w-0">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <Title
            className="!m-0 !text-xl !font-bold !text-[var(--wt-text)] sm:!text-2xl"
            level={2}
          >
            {title}
          </Title>
          {description ? (
            <Text className="mt-1 block !text-sm !text-[var(--wt-text-muted)]">
              {description}
            </Text>
          ) : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function ErrorPanel({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <Alert
      action={
        <Button icon={<ReloadOutlined />} onClick={onRetry}>
          Retry
        </Button>
      }
      className="!rounded-lg !border-[rgba(248,113,113,0.28)] !bg-[rgba(248,113,113,0.08)]"
      description={message}
      message="Dashboard data could not load"
      showIcon
      type="error"
    />
  );
}

export default function DashboardPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [workoutsLoading, setWorkoutsLoading] = useState(false);
  const [plansLoading, setPlansLoading] = useState(false);
  const [workoutsError, setWorkoutsError] = useState<string | null>(null);
  const [plansError, setPlansError] = useState<string | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const loadWorkouts = useCallback(async () => {
    try {
      setWorkoutsLoading(true);
      setWorkoutsError(null);
      const data = await getWorkouts();
      setWorkouts(data);
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(
        error,
        "Cannot load workouts. Please try again.",
      );
      setWorkoutsError(errorMessage);
      messageApi.error(errorMessage);
    } finally {
      setWorkoutsLoading(false);
    }
  }, [messageApi]);

  const loadPlans = useCallback(async () => {
    try {
      setPlansLoading(true);
      setPlansError(null);
      const data = await getWorkoutPlans();
      setPlans(data);
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(
        error,
        "Cannot load workout plans. Please try again.",
      );
      setPlansError(errorMessage);
      messageApi.error(errorMessage);
    } finally {
      setPlansLoading(false);
    }
  }, [messageApi]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadWorkouts();
      void loadPlans();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadPlans, loadWorkouts]);

  const recentWorkouts = useMemo(
    () =>
      [...workouts]
        .sort((left, right) =>
          compareDateDesc(left.workout_date, right.workout_date),
        )
        .slice(0, 5),
    [workouts],
  );

  const featuredPlans = useMemo(
    () =>
      [...plans]
        .sort((left, right) => {
          const leftUpcoming = isFutureOrToday(left.plan_date) ? 0 : 1;
          const rightUpcoming = isFutureOrToday(right.plan_date) ? 0 : 1;

          if (leftUpcoming !== rightUpcoming) {
            return leftUpcoming - rightUpcoming;
          }

          return new Date(left.plan_date).getTime() - new Date(right.plan_date).getTime();
        })
        .slice(0, 4),
    [plans],
  );

  const latestWorkout = recentWorkouts[0] ?? null;
  const todaysPlans = plans.filter((plan) => isToday(plan.plan_date));
  const totalCalories = workouts.reduce(
    (total, workout) => total + workout.calories_burned,
    0,
  );
  const totalSets = workouts.reduce(
    (total, workout) => total + (workout.sets ?? 0),
    0,
  );
  const totalReps = workouts.reduce(
    (total, workout) => total + (workout.reps ?? 0),
    0,
  );
  const completedPlanExercises = plans.reduce(
    (total, plan) =>
      total +
      plan.exercises.filter((exercise) => exercise.is_completed === 1).length,
    0,
  );
  const totalPlanExercises = plans.reduce(
    (total, plan) => total + plan.exercises.length,
    0,
  );

  const stats: DashboardStat[] = [
    {
      label: "Workouts",
      value: workouts.length.toLocaleString(),
      helper: "Logged workout records",
      tone: "primary",
    },
    {
      label: "Calories",
      value: totalCalories.toLocaleString(),
      helper: "Total calories burned",
      tone: "warning",
    },
    {
      label: "Sets / Reps",
      value: `${totalSets.toLocaleString()} / ${totalReps.toLocaleString()}`,
      helper: "Strength volume captured",
      tone: "info",
    },
    {
      label: "Plan Work",
      value:
        totalPlanExercises > 0
          ? `${completedPlanExercises}/${totalPlanExercises}`
          : "0",
      helper: "Completed plan exercises",
      tone: "success",
    },
  ];

  return (
    <div className="space-y-8">
      {contextHolder}

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-stretch">
        <div className="min-w-0 py-1">
          <Text className="!text-sm !font-bold !uppercase !tracking-normal !text-[var(--wt-primary)]">
            Training dashboard
          </Text>
          <Title
            className="!mb-3 !mt-2 !text-3xl !font-black !leading-tight !text-[var(--wt-text)] sm:!text-4xl"
            level={1}
          >
            Keep the next session in focus.
          </Title>
          <Paragraph className="!m-0 max-w-2xl !text-base !text-[var(--wt-text-muted)]">
            Review your latest training log, current plan work, and the workout
            history already saved in your account.
          </Paragraph>
          <Space className="mt-6" wrap size={[12, 12]}>
            <Button icon={<PlusOutlined />} type="primary">
              <Link to="/workouts/new">Log workout</Link>
            </Button>
            <Button icon={<ScheduleOutlined />}>
              <Link to="/plans">Manage plans</Link>
            </Button>
          </Space>
        </div>

        <Card className="!rounded-lg !border-[rgba(182,255,59,0.22)] !bg-[linear-gradient(135deg,rgba(182,255,59,0.12),rgba(20,26,33,0.86)_42%,rgba(13,17,23,0.94))]">
          <div className="flex h-full flex-col justify-between gap-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <Text className="!text-sm !font-bold !uppercase !tracking-normal !text-[var(--wt-text-subtle)]">
                  Up next
                </Text>
                <Title
                  className="!mb-0 !mt-2 !text-2xl !font-bold !text-[var(--wt-text)]"
                  level={2}
                >
                  {todaysPlans.length > 0
                    ? `${todaysPlans.length} plan${todaysPlans.length === 1 ? "" : "s"} today`
                    : latestWorkout
                      ? latestWorkout.title
                      : "No training yet"}
                </Title>
              </div>
              <div
                aria-hidden="true"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[rgba(182,255,59,0.28)] bg-[rgba(182,255,59,0.1)] text-[var(--wt-primary)]"
              >
                <ThunderboltOutlined className="text-xl" />
              </div>
            </div>

            {todaysPlans.length > 0 ? (
              <div className="space-y-3">
                {todaysPlans.slice(0, 2).map((plan) => {
                  const progress = planProgress(plan);

                  return (
                    <div key={plan.id}>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <Text strong className="!text-[var(--wt-text)]">
                          {plan.name}
                        </Text>
                        <Text className="!font-mono !text-sm !text-[var(--wt-text-muted)]">
                          {progress.completed}/{progress.total}
                        </Text>
                      </div>
                      <Progress
                        percent={progress.percent}
                        showInfo={false}
                        strokeColor="var(--wt-primary)"
                        trailColor="rgba(255,255,255,0.1)"
                      />
                    </div>
                  );
                })}
              </div>
            ) : latestWorkout ? (
              <Space direction="vertical" size={4}>
                <Text className="!text-[var(--wt-text-muted)]">
                  Latest logged workout
                </Text>
                <Text className="!text-[var(--wt-text)]">
                  {latestWorkout.exercise_type} on{" "}
                  {formatDate(latestWorkout.workout_date)}
                </Text>
                <Text className="!text-[var(--wt-text-muted)]">
                  {renderDuration(latestWorkout)} ·{" "}
                  {latestWorkout.calories_burned.toLocaleString()} calories
                </Text>
              </Space>
            ) : (
              <Text className="!text-[var(--wt-text-muted)]">
                Start by logging your first workout or creating a workout plan.
              </Text>
            )}
          </div>
        </Card>
      </section>

      {workoutsError ? (
        <ErrorPanel message={workoutsError} onRetry={loadWorkouts} />
      ) : null}
      {plansError ? <ErrorPanel message={plansError} onRetry={loadPlans} /> : null}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {workoutsLoading && workouts.length === 0
          ? Array.from({ length: 4 }, (_, index) => (
              <Card
                className="!rounded-lg !border-[var(--wt-border)] !bg-[rgba(20,26,33,0.78)]"
                key={index}
              >
                <Skeleton active paragraph={{ rows: 2 }} title={false} />
              </Card>
            ))
          : stats.map((stat) => <DashboardStatCard key={stat.label} {...stat} />)}
      </section>

      <section className="grid gap-8 xl:grid-cols-[minmax(0,1.08fr)_minmax(340px,0.92fr)]">
        <DashboardSection
          action={
            <Button icon={<UnorderedListOutlined />}>
              <Link to="/workouts">All workouts</Link>
            </Button>
          }
          description="The most recent workout records from your account."
          title="Recent workouts"
        >
          {workoutsLoading && workouts.length === 0 ? (
            <Card className="!rounded-lg !border-[var(--wt-border)] !bg-[rgba(20,26,33,0.68)]">
              <Skeleton active paragraph={{ rows: 5 }} />
            </Card>
          ) : recentWorkouts.length > 0 ? (
            <div className="space-y-3">
              {recentWorkouts.map((workout) => (
                <Link
                  className="group block rounded-lg border border-[var(--wt-border)] bg-[rgba(20,26,33,0.7)] p-4 no-underline transition-colors hover:border-[rgba(182,255,59,0.38)] hover:bg-[rgba(20,26,33,0.96)]"
                  key={workout.id}
                  to={`/workouts/${workout.id}`}
                >
                  <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <Text className="!text-lg !font-bold !text-[var(--wt-text)]">
                          {workout.title}
                        </Text>
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
                    <RightOutlined className="text-[var(--wt-text-subtle)] transition-colors group-hover:text-[var(--wt-primary)]" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="!rounded-lg !border-dashed !border-[rgba(182,255,59,0.28)] !bg-[rgba(182,255,59,0.05)]">
              <Empty
                description={
                  <span className="text-[var(--wt-text-muted)]">
                    No workouts have been logged yet.
                  </span>
                }
              >
                <Button icon={<PlusOutlined />} type="primary">
                  <Link to="/workouts/new">Log workout</Link>
                </Button>
              </Empty>
            </Card>
          )}
        </DashboardSection>

        <DashboardSection
          action={
            <Button icon={<ScheduleOutlined />}>
              <Link to="/plans">Open plans</Link>
            </Button>
          }
          description="Workout plans and completion based on saved exercises."
          title="Workout plans"
        >
          {plansLoading && plans.length === 0 ? (
            <Card className="!rounded-lg !border-[var(--wt-border)] !bg-[rgba(20,26,33,0.68)]">
              <Skeleton active paragraph={{ rows: 5 }} />
            </Card>
          ) : featuredPlans.length > 0 ? (
            <div className="space-y-3">
              {featuredPlans.map((plan) => {
                const progress = planProgress(plan);

                return (
                  <Card
                    className="!rounded-lg !border-[var(--wt-border)] !bg-[rgba(20,26,33,0.72)]"
                    key={plan.id}
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Text className="block !text-base !font-bold !text-[var(--wt-text)]">
                          {plan.name}
                        </Text>
                        <Text className="!text-sm !text-[var(--wt-text-muted)]">
                          {formatDate(plan.plan_date)}
                        </Text>
                      </div>
                      <Tag color={isToday(plan.plan_date) ? "green" : "default"}>
                        {isToday(plan.plan_date) ? "Today" : "Planned"}
                      </Tag>
                    </div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <Text className="!text-sm !text-[var(--wt-text-muted)]">
                        Exercises completed
                      </Text>
                      <Text className="!font-mono !text-sm !text-[var(--wt-text)]">
                        {progress.completed}/{progress.total}
                      </Text>
                    </div>
                    <Progress
                      percent={progress.percent}
                      strokeColor="var(--wt-success)"
                      trailColor="rgba(255,255,255,0.1)"
                    />
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="!rounded-lg !border-dashed !border-[rgba(56,189,248,0.28)] !bg-[rgba(56,189,248,0.05)]">
              <Empty
                description={
                  <span className="text-[var(--wt-text-muted)]">
                    No workout plans are available yet.
                  </span>
                }
              >
                <Button icon={<ScheduleOutlined />}>
                  <Link to="/plans">Create a plan</Link>
                </Button>
              </Empty>
            </Card>
          )}
        </DashboardSection>
      </section>
    </div>
  );
}
