/* eslint-disable no-eval */
/* eslint-disable lines-between-class-members */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Math extends Component {
  getResult = () => {
    const { first, second, operator } = this.props;
    if (operator === '/' && second === 0) {
      return 'infinity';
    }
    if (!['+', '-', '*', '/'].includes(operator)) {
      return 'Invalid operator';
    }
    return eval(first + operator + second);
  };

  render() {
    const {
      children, first, second, operator,
    } = this.props;
    return (
      <>
        {
          children ? children({
            first, second, result: this.getResult(), operator,
          }) : `${first} Add ${second} = ${this.getResult}`
        }
      </>
    );
  }
}
Math.propTypes = {
  first: PropTypes.number.isRequired,
  second: PropTypes.number.isRequired,
  children: PropTypes.func.isRequired,
  operator: PropTypes.string.isRequired,
};
export default Math;
