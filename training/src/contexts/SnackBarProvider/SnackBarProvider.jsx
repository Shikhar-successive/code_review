import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CustomSnackBar from './SnackBar';

export const SnackbarContext = React.createContext();

class SnackBarProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      message: '',
      variant: '',
    };
  }

  openSnackbar = (message, variant) => {
    this.setState({
      isOpen: true,
      message,
      variant,
    });
  };

  closeSnackbar = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({
      message: '',
      isOpen: false,
    });
  };

  render() {
    const { children } = this.props;
    const { isOpen, message, variant } = this.state;

    return (
      <>
        <SnackbarContext.Provider value={this.openSnackbar}>
          {children}
        </SnackbarContext.Provider>
        <CustomSnackBar
          open={isOpen}
          onClose={this.closeSnackbar}
          message={message}
          status={variant}
        />
      </>
    );
  }
}
SnackBarProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export default SnackBarProvider;
