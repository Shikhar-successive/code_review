/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Typography, CircularProgress } from '@material-ui/core';

const withLoaderAndMessage = (Componant) => {
  const newComponant = (props) => {
    const { loading, dataLength, ...rest } = props;
    if (loading) {
      return <CircularProgress size={24} />;
    }
    if (dataLength === 0) {
      return <Typography variant="h3" color="primary" align="center">OOPS! No Data</Typography>;
    }
    return <Componant {...rest} />;
  };
  return newComponant;
};
export default withLoaderAndMessage;
