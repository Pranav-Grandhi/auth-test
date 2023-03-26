import { NextApiRequest, NextApiResponse } from "next";
import checkPassword from "hibp-checker";
import { hash } from "argon2";
import { withIronSessionApiRoute } from "iron-session/next";
import * as z from "zod";

import { prisma } from "~/lib/prisma";
import { sessionOptions } from "~/lib/session";

const signupBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
  password_confirmation: z.string(),
});

async function signup(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "POST") {
      if (req.session.user) {
        return res.status(400).end();
      }

      const { email, password, password_confirmation } = signupBodySchema.parse(
        req.body
      );

      const userExists = await prisma.user.findUnique({
        where: { email: email },
      });
      if (userExists) {
        return res.status(400).json({
          message:
            "Email already in use. Please login or use a different email.",
        });
      }

      const strongRegex = RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{10,})"
      );
      if (!strongRegex.test(password)) {
        return res.status(400).json({
          message:
            "Password is too weak. Minimum 10 characters and please include: 1 uppercase, digit, or special character.",
        });
      }

      if ((await checkPassword(password)) > 0) {
        return res.status(400).json({
          message: "This password was found in a data leak and can't be used.",
        });
      }

      if (password_confirmation !== password) {
        return res
          .status(400)
          .json({ message: "Password confirmation doesn't match Password." });
      }

      const passwordHash = await hash(password);
      const user = await prisma.user.create({
        data: { email: email, passwordHash: passwordHash },
      });

      req.session.user = { id: user.id };
      await req.session.save();

      return res.status(200).send({});
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

export default withIronSessionApiRoute(signup, sessionOptions);
