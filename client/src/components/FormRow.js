import React from 'react';

//Bootstrap
import Form from 'react-bootstrap/esm/Form';

const FormRow = ({ name, labelText, type, handleChange, value }) => {
  return (
    <Form.Group className="mb-3" controlId={name}>
      <Form.Label>{labelText || name}</Form.Label>
      <Form.Control
        type={type}
        required
        name={name}
        onChange={handleChange}
        value={value}
      />
    </Form.Group>
  );
};

export default FormRow;
