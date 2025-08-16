import * as React from "react";

type Fields<T extends Record<string, any>> = T;

export default function useFormFields<T extends Record<string, any>>(
  initial: Fields<T>
) {
  const [fields, setFields] = React.useState<Fields<T>>(initial);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFields((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const reset = () => setFields(initial);

  return { fields, setFields, onChange, reset };
}
