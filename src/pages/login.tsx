import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation } from "@tanstack/react-query";

import { InputField } from "~/components/field";

{
  /* TODO: When authenticated: redirect to home */
}
export default function Login() {
  const router = useRouter();

  const { mutate, isLoading, isError, error } = useMutation<void, Error, any>({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }
    },
    onSuccess: () => {
      router.push("/");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    mutate(data);
  };

  return (
    <>
      {isError && <p style={{ color: "red" }}>{error.message}</p>}
      <h1>Log in to Orion</h1>
      <form onSubmit={handleSubmit}>
        <fieldset disabled={isLoading}>
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
          <button type="submit">
            {isLoading ? <>Signing in...</> : <>Sign in</>}
          </button>
        </fieldset>
      </form>
      <p>
        New to Orion? <Link href="/signup">Create an account</Link>.
      </p>
    </>
  );
}
