import React, { Component } from 'react';
import PropTypes from 'prop-types';
import btnstyle from './style';

class Button extends Component {
  render() {
    const {
      disabled, value, color,
    } = this.props;
    let btnprimary;
    if (!disabled) {
      btnprimary = btnstyle[color];
    } else {
      btnprimary = btnstyle.button;
    }

    return (
      <>
        <button style={btnprimary} type="button" disabled={disabled}>{value}</button>
      </>
    );
  }
}
Button.propTypes = {
  value: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  color: PropTypes.string,
};
Button.defaultProps = {
  disabled: false,
  color: '',
};
export default Button;
