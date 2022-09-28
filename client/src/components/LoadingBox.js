import React from 'react';

//Bootstrap
import Spinner from 'react-bootstrap/Spinner';

const LoadingBox = () => {
  return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
};

export default LoadingBox;
