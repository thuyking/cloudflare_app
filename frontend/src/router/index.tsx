import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../layouts";
import { LoginPage, RegisterPage } from "../pages/auth";
import { DashboardPage } from "../pages/dashboard";
import NotFoundPage from "../pages/NotFoundPage";
import { WorkoutPlanPage } from "../pages/plans";
import {
  WorkoutCreatePage,
  WorkoutDetailPage,
  WorkoutEditPage,
  WorkoutListPage,
} from "../pages/workouts";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  {
<<<<<<< Updated upstream
=======
    path: "login",
    element: <Navigate replace to="/auth/login" />,
  },
  {
    path: "register",
    element: <Navigate replace to="/auth/register" />,
  },
  {
>>>>>>> Stashed changes
    path: "auth/login",
    element: <LoginPage />,
  },
  {
    path: "auth/register",
    element: <RegisterPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          {
            path: "dashboard",
            element: <DashboardPage />,
          },
          {
            path: "workouts",
            element: <WorkoutListPage />,
          },
          {
            path: "workouts/new",
            element: <WorkoutCreatePage />,
          },
          {
            path: "workouts/:id",
            element: <WorkoutDetailPage />,
          },
          {
            path: "workouts/:id/edit",
            element: <WorkoutEditPage />,
          },
          {
            path: "plans",
            element: <WorkoutPlanPage />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
