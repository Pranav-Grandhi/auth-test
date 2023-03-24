import type { InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { withIronSessionSsr } from "iron-session/next";

import { sessionOptions } from "~/lib/session";

export default function Home({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      {user ? (
        <>
          {/* TODO: Display user email */}
          <p>Signed as {}</p>
        </>
      ) : (
        <p>
          Please <Link href="/login">Sign in</Link> or{" "}
          <Link href="/signup">Sign up</Link>.
        </p>
      )}
    </>
  );
}

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
}) {
  return {
    props: {
      user: req.session.user ?? null,
    },
  };
},
sessionOptions);
