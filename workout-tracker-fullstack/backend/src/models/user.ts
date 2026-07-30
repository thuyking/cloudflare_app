export interface UserRow {
  id: number;
  name: string;
  email: string;
  password_hash: string;
}
export interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

export interface LoginBody {
  email: string,
  password: string
}