import * as React from "react";
import { ButtonType } from "../../types/button"; // adjust if you moved types
import $ from "./Button.module.css";

type ButtonVariant = "primary" | "secondary";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  type?: ButtonType;          // "button" | "submit" | "reset"
  variant?: ButtonVariant;
  loading?: boolean;          // custom prop (not a native attribute)
}

const Button: React.FC<Props> = ({
  type = "button",
  variant = "primary",
  className,
  loading = false,            // <-- extract so it isn't forwarded
  disabled,
  children,
  ...rest                      // rest are safe native props only
}) => {
  const cls = [
    $.button,
    variant === "secondary" ? $.secondary : $.primary,
    className,
    loading ? $.loading : undefined, // optional: style when loading
  ]
    .filter(Boolean)
    .join(" ");

  const isLoading = Boolean(loading);

  return (
    <button
      type={type}
      className={cls}
      disabled={disabled || isLoading}              // prevent double submits
      aria-busy={isLoading ? true : undefined}      // omit when false
      data-loading={isLoading ? "" : undefined}     // optional CSS hook
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
