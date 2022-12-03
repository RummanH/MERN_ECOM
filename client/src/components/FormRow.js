import React from 'react';

import Form from 'react-bootstrap/esm/Form';

const FormRow = ({ name, labelText, type, handleChange, value }) => {
  return (
    <Form.Group className="mb-3" controlId={name}>
      <Form.Label>{labelText || name}</Form.Label>
      <Form.Control
        style={{ fontSize: '1.7rem' }}
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
