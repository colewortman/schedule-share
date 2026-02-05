export interface User {
  user_id: string;
  user_name: string;
  email: string;
}

export interface Group {
  group_id: string;
  group_name: string;
}

export interface Schedule {
  schedule_id: string;
  user_id: string | null;
  group_id: string | null;
}