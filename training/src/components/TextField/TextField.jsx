import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './style';

class TextField extends Component {
  render() {
    const {
      value, onChange, onBlur, error, disabled,
    } = this.props;
    return (
      <>
        <input style={style.text} type="text" defaultValue={value} onChange={onChange} onBlur={onBlur} disabled={disabled} />
        {error ? <div style={{ color: 'red' }}>{error}</div> : ''}
      </>
    );
  }
}
TextField.propTypes = {
  disabled: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  error: PropTypes.string,
};
TextField.defaultProps = {
  disabled: false,
  value: '',
  onChange: () => {},
  onBlur: () => {},
  error: '',
};
export default TextField;
