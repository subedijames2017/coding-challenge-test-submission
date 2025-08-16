import * as React from "react";
import $ from "./ErrorMessage.module.css";

interface Props {
  children?: string | null;
}

const ErrorMessage: React.FC<Props> = ({ children }) => {
  if (!children) return null;
  return <div className={$.error}>{children}</div>;
};

export default ErrorMessage;
