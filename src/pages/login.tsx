import Link from "next/link";

import { InputField } from "~/components/field";

{
  /* TODO: When authenticated: redirect to home */
}
export default function Login() {
  return (
    <>
      <h1>Log in to Orion</h1>
      <form method="post" action="/api/auth/login">
        <InputField
          label="Email Address"
          name="email"
          type="email"
          autoFocus
          required
          autoComplete="email"
          placeholder="tim@apple.com"
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••••"
        />
        <button type="submit">Sign in</button>
      </form>
      <p>
        New to Orion? <Link href="/signup">Create an account</Link>.
      </p>
    </>
  );
}
