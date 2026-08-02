ALTER TABLE workout_plans
ADD COLUMN updated_at TEXT;

UPDATE workout_plans
SET updated_at = created_at
WHERE updated_at IS NULL;

ALTER TABLE workout_plan_exercises
ADD COLUMN created_at TEXT;

ALTER TABLE workout_plan_exercises
ADD COLUMN updated_at TEXT;

UPDATE workout_plan_exercises
SET created_at = CURRENT_TIMESTAMP
WHERE created_at IS NULL;

UPDATE workout_plan_exercises
SET updated_at = CURRENT_TIMESTAMP
WHERE updated_at IS NULL;