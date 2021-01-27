import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Typography, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

class Navbar extends Component {
  onLogoutHandler = () => {
    localStorage.removeItem('token');
  }

  render() {
    return (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Trainee Portal
          </Typography>
          <Link to="/">
            <Button variant="contained" color="primary">
              Trainee
            </Button>
          </Link>
          <Link to="/TextField-Demo">
            <Button variant="contained" color="primary">
              TextField Demo
            </Button>
          </Link>
          <Link to="/Input-Demo">
            <Button variant="contained" color="primary">
              Input Demo
            </Button>
          </Link>
          <Link to="/Children-Demo">
            <Button variant="contained" color="primary">
              Children Demo
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="contained" color="primary" onClick={() => this.onLogoutHandler()}>
              logout
            </Button>
          </Link>
        </Toolbar>
      </AppBar>
    );
  }
}
export default Navbar;
