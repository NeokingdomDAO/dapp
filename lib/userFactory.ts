import { OdooUser } from "types";

export type User = {
  id: number;
  isLoggedIn: boolean;
  username: string;
  password: string;
} & OdooUser;

const userFactory = (user: Partial<User> = {}): User => ({
  id: -1,
  isLoggedIn: false,
  email: "",
  ethereum_address: "",
  name: "",
  display_name: "",
  username: "",
  password: "",
  ...user,
});

export default userFactory;
