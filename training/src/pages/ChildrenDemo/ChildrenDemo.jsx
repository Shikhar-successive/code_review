/* eslint-disable react/jsx-one-expression-per-line */
import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import { Math } from '../../components';

class ChildrenDemo extends Component {
  render() {
    return (
      <>
        <Math first={4} second={3} operator="+">
          {
            (item) => (
              <p>Sum of {item.first} and {item.second} is {item.result} </p>
            )
          }
        </Math>
        <Math first={7} second={3} operator="-">
          {
            (item) => (
              <p>Subtract {item.first} and {item.second} is {item.result} </p>
            )
          }
        </Math>
        <Math first={7} second={3} operator="*">
          {
            (item) => (
              <p>Multiply {item.first} and {item.second} is {item.result} </p>
            )
          }
        </Math>
        <Math first={7} second={0} operator="/">
          {
            (item) => (
              <p>divide {item.first} and {item.second} is {item.result} </p>
            )
          }
        </Math>
        <Math first={8} second={2} operator="/">
          {
            (item) => (
              <p>divide {item.first} and {item.second} is {item.result} </p>
            )
          }
        </Math>
        <Math first={5} second={4} operator="^">
          {
            (item) => (
              // eslint-disable-next-line max-len
              <Typography>Calculating {item.first} {item.operator} with {item.second} is {item.result} </Typography>
            )
          }
        </Math>
      </>
    );
  }
}
export default ChildrenDemo;
