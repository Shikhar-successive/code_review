import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import EmailIcon from '@material-ui/icons/Email';
import PersonIcon from '@material-ui/icons/Person';
import DialogContentText from '@material-ui/core/DialogContentText';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as Yup from 'yup';

class AddDialog extends Component {
  schema = Yup.object().shape({
    name: Yup.string().required('Name is Required Field'),
    email: Yup.string().email().required('Email is Required Field'),
    password: Yup.string()
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}$/g, 'must contain at least eight characters, one number, both lower and uppercase letters and special characters')
      .required('Password is Required Field'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required field'),
  });

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
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

  handelPasswordChange = (event) => {
    this.setState({ password: event.target.value }, () => {
    });
  }

  handelConfirmChange = (event) => {
    this.setState({ confirmPassword: event.target.value }, () => {
    });
  }

  hasError = () => {
    const {
      name,
      email,
      password,
      confirmPassword,
    } = this.state;
    const data = {
      name: `${name}`,
      email: `${email}`,
      password: `${password}`,
      confirmPassword: `${confirmPassword}`,
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
      password,
      confirmPassword,
    } = this.state;
    const data = {
      name: `${name}`,
      email: `${email}`,
      password: `${password}`,
      confirmPassword: `${confirmPassword}`,
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

  handelSubmit = (state) => {
    const { onSubmit } = this.props;
    onSubmit(state);
    this.setState({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      touched: {},
    });
  }

  render() {
    const {
      name, email, password, confirmPassword,
    } = this.state;
    const state = { name, email, password };
    const {
      open, onClose, loading,
    } = this.props;
    return (
      <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title" fullWidth maxWidth="md">
        <DialogTitle style={{ alignContent: 'start' }}>Add Trainee</DialogTitle>
        <DialogContentText style={{ paddingLeft: '25px' }}>Enter your Trainee details</DialogContentText>
        <div style={{ paddingLeft: '12px', paddingTop: '8px', paddingRight: '12px' }}>
          <TextField
            value={name}
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
            value={email}
            error={this.getError('email')}
            helperText={this.getError('email')}
            onChange={this.handelEmailChange}
            onBlur={() => this.onToched('email')}
            label="Email*"
            variant="outlined"
            type="Email"
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
        <div style={{ paddingLeft: '12px', paddingTop: '8px', alignItems: 'space-evenly' }}>
          <TextField
            value={password}
            error={this.getError('password')}
            helperText={this.getError('password')}
            onChange={this.handelPasswordChange}
            onBlur={() => this.onToched('password')}
            label="Password*"
            type="password"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <VisibilityOffIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            value={confirmPassword}
            error={this.getError('confirmPassword')}
            helperText={this.getError('confirmPassword')}
            onChange={this.handelConfirmChange}
            onBlur={() => this.onToched('confirmPassword')}
            label="Confirm Password*"
            type="password"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <VisibilityOffIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button disabled={this.hasError() || !this.isTouched() || loading} color="primary" variant="contained" onClick={() => this.handelSubmit(state)}>
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
AddDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};
AddDialog.defaultProps = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
export default AddDialog;
