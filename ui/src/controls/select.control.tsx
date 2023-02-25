import React, { useCallback } from "react";
import { Form } from "react-bootstrap";

interface SelectControlProps {
  value: any;
  onChangeCallback: any;
  placeholder?: string;
  children?: any;
}

export const SelectControl: React.FC<SelectControlProps> = ({
  value,
  onChangeCallback,
  placeholder,
  children,
}) => {
  const onChange = useCallback(
    (event: any) => {
      onChangeCallback(event?.target?.value);
    },
    [onChangeCallback]
  );
  return (
    <Form.Select
      className="form-control"
      value={value}
      placeholder={placeholder}
      onChange={onChange}
    >
      {children}
    </Form.Select>
  );
};
