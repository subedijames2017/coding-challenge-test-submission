import React, { FunctionComponent } from 'react';
import cx from 'classnames';
import $ from './Radio.module.css';

interface RadioProps {
  id: string;
  name: string;
  checked: boolean;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children: React.ReactNode;
}

const Radio: FunctionComponent<RadioProps> = ({
  children,
  id,
  value,
  checked,
  name,
  onChange,
}) => {
  return (
    <label
      htmlFor={id}
      className={cx($.radioCard, { [$.checked]: checked })}
    >
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className={$.input}
      />
      <div className={$.content}>{children}</div>
    </label>
  );
};

export default Radio;
