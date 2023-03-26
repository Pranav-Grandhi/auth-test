import { NextApiRequest, NextApiResponse } from "next";
import { verify } from "argon2";
import { withIronSessionApiRoute } from "iron-session/next";
import * as z from "zod";

import { prisma } from "~/lib/prisma";
import { sessionOptions } from "~/lib/session";

const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

async function login(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "POST") {
      const { email, password } = loginBodySchema.parse(req.body);

      const user = await prisma.user.findUnique({ where: { email: email } });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password." });
      }

      const passwordValid = await verify(user.passwordHash, password);
      if (!passwordValid) {
        return res.status(400).json({ message: "Invalid email or password." });
      }

      // password is valid, create a session
      req.session.user = { id: user.id };
      await req.session.save();

      return res.status(200);
    } else {
      res.setHeader("Allow", ["POST"]);
      return res
        .status(405)
        .json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid request body." });
    } else {
      return res
        .status(500)
        .json({ message: "Something went wrong. Please try again later." });
    }
  }
}

export default withIronSessionApiRoute(login, sessionOptions);
