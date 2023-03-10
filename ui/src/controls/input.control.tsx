import React, { useCallback } from "react";
import { Form } from "react-bootstrap";

interface InputControlProps {
  value: any;
  onChangeCallback: any;
  placeholder?: string;
  type?: string;
}

export const InputControl: React.FC<InputControlProps> = ({
  value,
  onChangeCallback,
  placeholder,
  type,
}) => {
  const onChange = useCallback(
    (event: any) => {
      onChangeCallback(event?.target?.value);
    },
    [onChangeCallback]
  );
  return (
    <Form.Control
      className="form-control"
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      type={type}
    />
  );
};
