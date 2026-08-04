create table user (
  id integer primary key autoincrement,
  name text not null,
  email text not null unique,
  password_hash text not null,
  created_at text default current_timestamp,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

create table workout (
  id integer primary key autoincrement,
  user_id int not null,
  title text not null,
  exercise_type text not null,
  duration int , 
  duration_unit text ,
  sets int,
  reps int,
  calories_burned int not null,
  workout_date text not null,
  notes text,
  created_at text default current_timestamp,
  updated_at text default current_timestamp,
  foreign key (user_id) references user(id)
);

create index idx_workout_user_id on workout(user_id);
create index idx_workout_user_date on workout(user_id, workout_date);

create table workout_plans (
  id integer primary key autoincrement,
  user_id int not null,
  name text not null,
  plan_date text not null,
  created_at text default current_timestamp,
  foreign key (user_id) references user(id) 
);

create index idx_workout_plans_user_id on workout_plans(user_id);

create table workout_plan_exercises (
  id integer primary key autoincrement,
  workout_plan_id int not null,
  exercise_name text not null,
  sets int,
  reps int,
  hold_seconds int,
  is_completed integer default 0,
  workout_log_id int,
  foreign key (workout_plan_id) references workout_plans(id),
  foreign key (workout_log_id) references workout(id)
);

create index idx_workout_plans_exersices_plans_id on workout_plan_exercises(workout_plan_id);
