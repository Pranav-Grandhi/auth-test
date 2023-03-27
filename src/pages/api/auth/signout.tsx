import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";

import { sessionOptions } from "~/lib/session";

async function signout(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "POST") {
      req.session.destroy();
      return res.status(200).end();
    } else {
      res.setHeader("Allow", ["POST"]);
      return res
        .status(405)
        .json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
}

export default withIronSessionApiRoute(signout, sessionOptions);
