export type User = {
  uid: number;
  username: string;
  password: string;
  isLoggedIn: boolean;
};

const userFactory = (user: Partial<User> = {}): User => ({
  uid: -1,
  username: "",
  password: "",
  isLoggedIn: false,
  ...user,
});

export default userFactory;
