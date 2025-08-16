import React, { FunctionComponent } from "react";
import Button from "../Button/Button";
import InputText from "../InputText/InputText";
import $ from "./Form.module.css";

type InputTextProps = React.ComponentProps<typeof InputText>;
type ButtonProps = React.ComponentProps<typeof Button>;

interface FormEntry {
  name: string;
  placeholder: string;
  extraProps?: Omit<InputTextProps, "name" | "placeholder">;
}

interface FormProps {
  label: string;
  loading?: boolean;
  formEntries: FormEntry[];
  onFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  submitText: string;
  submitButtonProps?: Omit<ButtonProps, "type" | "children">;
  /** optional helper under the legend */
  description?: string;
}

const Form: FunctionComponent<FormProps> = ({
  label,
  loading,
  formEntries,
  onFormSubmit,
  submitText,
  submitButtonProps,
  description,
}) => (
  <form className={$.form} onSubmit={onFormSubmit} aria-busy={!!loading}>
    <fieldset className={$.fieldset}>
      <legend className={$.legend}>
        <span className={$.legendDot} aria-hidden="true" />
        {label}
      </legend>
      {description && <p className={$.legendDescription}>{description}</p>}

      <div className={$.rows}>
        {formEntries.map(({ name, placeholder, extraProps }) => (
          <div key={name} className={$.formRow}>
            <InputText
              name={name}
              placeholder={placeholder}
              value={extraProps?.value || ""}
              {...extraProps}
            />
          </div>
        ))}
      </div>

      <div className={$.actions}>
        <Button
          type="submit"
          loading={!!loading}
          {...submitButtonProps}
        >
          {submitText}
        </Button>
      </div>
    </fieldset>
  </form>
);

export default Form;
