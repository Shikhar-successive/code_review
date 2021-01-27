import React, { Component } from 'react';
import {
  // BrowserRouter as
  // Router,
  Route,
  Switch,
} from 'react-router-dom';
import { AuthLayout } from '../layouts';

class AuthRoute extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/login" render={(routerProps) => <AuthLayout history={routerProps.history} />} />
      </Switch>
    );
  }
}
// render={(routerProps) => <AuthLayout history={routerProps.history} />}
export default AuthRoute;
