import {
  Button,
  Card,
  Empty,
  Popconfirm,
  Space,
  Table,
  Typography,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getWorkouts, removeWorkout } from "../../api";
import type { Workout } from "../../types";
import { getErrorMessage } from "../../utils";

const { Title } = Typography;

function renderNullable(value: number | string | null) {
  return value ?? "-";
}

function renderDuration(workout: Workout) {
  if (workout.duration === null) {
    return "-";
  }

  return workout.duration_unit
    ? `${workout.duration} ${workout.duration_unit}`
    : workout.duration;
}

export default function WorkoutListPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    let isMounted = true;

    async function loadWorkouts() {
      try {
        setLoading(true);
        setError(null);
        const data = await getWorkouts();

        if (isMounted) {
          setWorkouts(data);
        }
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(
          err,
          "Cannot load workouts. Please try again.",
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

    void loadWorkouts();

    return () => {
      isMounted = false;
    };
  }, [messageApi]);

  async function handleDelete(workoutId: number) {
    if (deletingId === workoutId) {
      return;
    }

    try {
      setDeletingId(workoutId);
      await removeWorkout(workoutId);
      setWorkouts((currentWorkouts) =>
        currentWorkouts.filter((workout) => workout.id !== workoutId),
      );
      messageApi.success("Workout deleted successfully.");
    } catch (err: unknown) {
      messageApi.error(
        getErrorMessage(err, "Cannot delete workout. Please try again."),
      );
    } finally {
      setDeletingId(null);
    }
  }

  const columns: ColumnsType<Workout> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      fixed: "left",
      width: 180,
    },
    {
      title: "Exercise Type",
      dataIndex: "exercise_type",
      key: "exercise_type",
      width: 160,
    },
    {
      title: "Sets",
      dataIndex: "sets",
      key: "sets",
      render: renderNullable,
      width: 90,
    },
    {
      title: "Reps",
      dataIndex: "reps",
      key: "reps",
      render: renderNullable,
      width: 90,
    },
    {
      title: "Duration",
      key: "duration",
      render: (_, record) => renderDuration(record),
      width: 140,
    },
    {
      title: "Calories",
      dataIndex: "calories_burned",
      key: "calories_burned",
      width: 120,
    },
    {
      title: "Workout Date",
      dataIndex: "workout_date",
      key: "workout_date",
      width: 140,
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      render: (_, record) => (
        <Space wrap size="small">
          <Button size="small" type="link">
            <Link to={`/workouts/${record.id}`}>Xem</Link>
          </Button>
          <Button size="small" type="link">
            <Link to={`/workouts/${record.id}/edit`}>Sua</Link>
          </Button>
          <Popconfirm
            cancelText="Cancel"
            description="This action cannot be undone."
            disabled={deletingId === record.id}
            okButtonProps={{ loading: deletingId === record.id }}
            okText="Delete"
            onConfirm={() => {
              void handleDelete(record.id);
            }}
            title="Delete this workout?"
          >
            <Button
              danger
              disabled={deletingId === record.id}
              loading={deletingId === record.id}
              size="small"
              type="link"
            >
              Xoa
            </Button>
          </Popconfirm>
        </Space>
      ),
      width: 180,
    },
  ];

  return (
    <Card>
      {contextHolder}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Title className="mb-0" level={2}>
          Workouts
        </Title>
        <Button type="primary">
          <Link to="/workouts/new">Them workout</Link>
        </Button>
      </div>

      <Table<Workout>
        columns={columns}
        dataSource={workouts}
        loading={loading}
        locale={{
          emptyText: error ? (
            error
          ) : (
            <Empty description="No workouts yet.">
              <Button type="primary">
                <Link to="/workouts/new">Them workout</Link>
              </Button>
            </Empty>
          ),
        }}
        pagination={{ pageSize: 10 }}
        rowKey="id"
        scroll={{ x: 1100 }}
      />
    </Card>
  );
}
