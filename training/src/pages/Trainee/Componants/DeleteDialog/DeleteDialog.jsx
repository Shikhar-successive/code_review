import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import PropTypes from 'prop-types';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import CircularProgress from '@material-ui/core/CircularProgress';

class DeleteDialog extends Component {
  render() {
    const {
      open, onClose, onDelete, loading,
    } = this.props;
    return (
      <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title" fullWidth maxWidth="md">
        <DialogTitle style={{ alignContent: 'start' }}>Delete Trainee</DialogTitle>
        <DialogContentText style={{ paddingLeft: '25px' }}>Do you really want to delete Trainee</DialogContentText>
        <DialogActions>
          <Button onClick={onClose} color="primary">Cancel</Button>
          <Button onClick={onDelete} disabled={loading} color="primary" variant="contained">
            {
              loading && <CircularProgress size="1.5rem" />
            }
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
DeleteDialog.propTypes = {
  open: PropTypes.bool,
  loading: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

DeleteDialog.defaultProps = {
  open: false,
  loading: false,
};
export default DeleteDialog;
