import type { IronSessionOptions } from "iron-session";
import { User } from "../lib/userFactory";

// Typings of req.session.*
declare module "iron-session" {
  interface IronSessionData {
    user?: User;
  }
}

export const sessionOptions: IronSessionOptions = {
  password: process.env.COOKIE_PASSWORD as string,
  cookieName: process.env.COOKIE_NAME as string,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};
