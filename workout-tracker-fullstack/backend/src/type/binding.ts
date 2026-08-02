export type Bindings = {
  workout_tracker_db: D1Database;
  JWT_SECRET: string;

  APP_NAME: string;
  AUTHOR: string;
  ENVIRONMENT: "development" | "staging" | "production";
};

export type Variables = {
  userId: number;
};