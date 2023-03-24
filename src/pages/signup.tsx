import Link from "next/link";

import { InputField } from "~/components/field";

{
  /* TODO: When authenticated: redirect to home */
}
export default function Signup() {
  return (
    <>
      <h1>Create your account</h1>
      <form method="post" action="/api/auth/signup">
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
          autoComplete="new-password"
          placeholder="••••••••••"
        />
        <InputField
          label="Password confirmation"
          name="password_confirmation"
          type="password"
          required
          autoComplete="new-password"
          placeholder="••••••••••"
        />
        <button type="submit">Sign up</button>
      </form>
      <p>
        Already have an account? <Link href="/login">Log in</Link>.
      </p>
    </>
  );
}
