import type { IronSessionOptions } from "iron-session";

import { env } from "~/env";

export const sessionOptions: IronSessionOptions = {
  password: env.SESSION_SECRET,
  cookieName: "orion_session",
  cookieOptions: {
    secure: env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  },
};

// This is where we specify the typings of req.session.*
declare module "iron-session" {
  interface IronSessionData {
    user?: { id: string };
  }
}
