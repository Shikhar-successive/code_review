import React, { Component } from 'react';
// import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
// import IconButton from '@material-ui/core/IconButton';
// import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';
import MuiAlert from '@material-ui/lab/Alert';

class SnackBar extends Component {
  render() {
    const {
      open,
      onClose,
      message,
      status,
    } = this.props;
    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        message={message}
        autoHideDuration={6000}
        onClose={onClose}
      >
        <MuiAlert variant="filled" severity={`${status}`}>
          {message}
        </MuiAlert>
      </Snackbar>
    );
  }
}
SnackBar.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  message: PropTypes.string,
  status: PropTypes.string,
};
SnackBar.defaultProps = {
  message: '',
  status: 'success',
  open: false,
};
export default SnackBar;
