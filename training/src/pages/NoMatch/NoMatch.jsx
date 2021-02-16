import React, { Component } from 'react';
import { Typography } from '@material-ui/core';

class NoMatch extends Component {
  render() {
    return (
      <>
        <div>
          <Typography align="center" variant="h3">NOT FOUND</Typography>
          <h2 align="center">Seem like page you are looking after does not exist</h2>
        </div>
      </>
    );
  }
}
export default NoMatch;
