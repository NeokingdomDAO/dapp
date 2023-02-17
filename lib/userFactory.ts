import { OdooUser } from "types";

export type User = {
  id: number;
  isLoggedIn: boolean;
} & OdooUser;

const userFactory = (user: Partial<User> = {}): User => ({
  id: -1,
  isLoggedIn: false,
  email: "",
  ethereum_address: "",
  display_name: "",
  ...user,
});

export default userFactory;
