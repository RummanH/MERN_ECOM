import React from 'react';

//Bootstrap
import Alert from 'react-bootstrap/Alert';

const MessageBox = ({ children, variant }) => {
  return <Alert variant={variant || 'info'}>{children}</Alert>;
};

export default MessageBox;
