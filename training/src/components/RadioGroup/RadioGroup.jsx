import React, { Component } from 'react';
import PropTypes from 'prop-types';

class RadioGroup extends Component {
  render() {
    const {
      onChange, options, value, onBlur, error,
    } = this.props;
    return (
      <>
        <div>
          {
            options.map((item) => (
              <div key={item.value}>
                <input type="radio" name="sportRole" id={item.label} onChange={onChange} value={item.value} checked={value === item.value} onBlur={onBlur} />
                <label htmlFor={item.label}>{item.value}</label>
              </div>
            ))
          }
        </div>
        <p style={{ color: 'red' }}>{ error }</p>
      </>
    );
  }
}
RadioGroup.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.instanceOf(Array),
  onBlur: PropTypes.func,
  error: PropTypes.string,
};

RadioGroup.defaultProps = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  options: PropTypes.instanceOf(Array),
  onBlur: PropTypes.func,
  error: PropTypes.string,
};
export default RadioGroup;
