import React from "react";
import { Controller } from "react-hook-form";
import { Form } from "react-bootstrap";

//reusable component that contains a title, an input field, optional form text and an error message
//based on react-bootstrap's form group structure
//react-hook-form's <Controller/> component gives you easy access to library components values and validity
function ControlledInput(props) {
  const { title, name, control, errors } = props;
  return (
    <Form.Group>
      <Form.Label>{title}</Form.Label>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <Form.Control
            {...field}
            type="text"
            isInvalid={!!errors[name]}
            autoComplete="off"
          />
        )}
      />
      {props.formText && (
        <Form.Text className="text-muted">{props.formText}</Form.Text>
      )}

      {errors[name] && (
        <Form.Control.Feedback type="invalid">
          {errors[name].message}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
}

export default ControlledInput;
