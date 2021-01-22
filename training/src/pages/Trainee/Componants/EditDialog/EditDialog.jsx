/* eslint-disable react/forbid-prop-types */
import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import PropTypes from 'prop-types';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';
import EmailIcon from '@material-ui/icons/Email';
import PersonIcon from '@material-ui/icons/Person';
import InputAdornment from '@material-ui/core/InputAdornment';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as Yup from 'yup';

class EditDialog extends Component {
  schema = Yup.object().shape({
    name: Yup.string().required('Name is Required Field'),
    email: Yup.string().email().required('Email is Required Field'),
  });

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      touched: {},
    };
  }

  handelNameChange = (event) => {
    this.setState({ name: event.target.value }, () => {
    });
  }

  handelEmailChange = (event) => {
    this.setState({ email: event.target.value }, () => {
    });
  }

  hasError = () => {
    const {
      name,
      email,
    } = this.state;
    const data = {
      name: `${name}`,
      email: `${email}`,
    };
    try {
      return !this.schema.validateSync(data);
    } catch (err) {
      return true;
    }
  }

  onToched = (componant) => {
    const { touched } = this.state;
    this.setState({ touched: { ...touched, [componant]: true } });
  }

  isTouched = () => {
    const { touched } = this.state;
    return Object.keys(touched).length !== 0;
  }

  getError = (componant) => {
    const {
      name,
      email,
    } = this.state;
    const data = {
      name: `${name}`,
      email: `${email}`,
    };
    const { touched } = this.state;
    if (touched[componant] && this.hasError) {
      try {
        this.schema.validateSyncAt(componant, data);
      } catch (err) {
        return err.message;
      }
    }
    return null;
  }

  render() {
    const { name, email } = this.state;
    const {
      open,
      onClose,
      details,
      onSubmit,
      loading,
    } = this.props;
    const traineeId = details.originalId;
    const state = { name, email, traineeId };
    return (
      <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title" fullWidth maxWidth="md">
        <DialogTitle style={{ alignContent: 'start' }}>Edit Trainee</DialogTitle>
        <DialogContentText style={{ paddingLeft: '25px' }}>Enter your trainee details</DialogContentText>
        <div style={{ paddingLeft: '12px', paddingTop: '8px', paddingRight: '12px' }}>
          <TextField
            defaultValue={details.name}
            error={this.getError('name')}
            helperText={this.getError('name')}
            onChange={this.handelNameChange}
            onBlur={() => this.onToched('name')}
            label="Name*"
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div style={{ paddingLeft: '12px', paddingTop: '8px', paddingRight: '12px' }}>
          <TextField
            // value={email}
            defaultValue={details.email}
            error={this.getError('email')}
            helperText={this.getError('email')}
            onChange={this.handelEmailChange}
            onBlur={() => this.onToched('email')}
            label="Email*"
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>
        <DialogActions>
          <Button onClick={onClose} color="primary">Cancel</Button>
          <Button disabled={this.hasError() || !this.isTouched() || loading} onClick={() => onSubmit(state)} color="primary" variant="contained">
            {
              loading && <CircularProgress size="1.5rem" />
            }
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
EditDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  details: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};
export default EditDialog;
