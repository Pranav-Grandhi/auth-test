import * as React from "react";

type Required<T, K extends keyof T> = T & { [P in K]-?: T[P] };

interface InputFieldProps
  extends Omit<
    Required<React.InputHTMLAttributes<HTMLInputElement>, "name">,
    "id"
  > {
  label: string;
  type: "email" | "password" | "text";
}

export const InputField = ({ label, ...props }: InputFieldProps) => {
  const id = React.useId();

  return (
    <div>
      <label htmlFor={id} style={{ display: "block" }}>
        {label}
      </label>
      <input id={id} {...props} />
    </div>
  );
};
