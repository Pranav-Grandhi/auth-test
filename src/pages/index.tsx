import type { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { withIronSessionSsr } from "iron-session/next";

import { sessionOptions } from "~/lib/session";

export default function Home({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  return (
    <>
      {user ? (
        <>
          {/* TODO: Display user email */}
          <p>Signed as {}</p>
          <form
            action="/api/auth/signout"
            method="post"
            onClick={async (e) => {
              e.preventDefault();
              await fetch("/api/auth/signout", { method: "POST" });
              router.push("/");
            }}
          >
            <button type="submit">Sign out</button>
          </form>
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
