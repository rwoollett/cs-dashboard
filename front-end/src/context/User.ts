export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface CurrentUser {
  currentUser?: Pick<User, "id" | "email">;
}

export type SignInUser = Pick<User, "email" | "password">;
