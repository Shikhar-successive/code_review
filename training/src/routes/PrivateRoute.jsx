import React from 'react';
import {
  Route, Switch, Redirect,
} from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import { PrivateLayout } from '../layouts';
import {
  ChildrenDemo, InputDemo, TextFieldDemo, Trainee, NoMatch,
} from '../pages';

const useStyles = makeStyles((theme) => ({
  navBody: {
    margin: theme.spacing(2),
  },
}));

const PrivateRoute = () => {
  const classes = useStyles();
  if (localStorage.getItem('token')) {
    return (
      <>
        <PrivateLayout />
        <div className={classes.navBody}>
          <Switch>
            <Redirect exact path="/" to="/Trainee" />
            <Route path="/Trainee" component={Trainee} />
            <Route exact path="/TextField-Demo" component={TextFieldDemo} />
            <Route exact path="/Input-Demo" component={InputDemo} />
            <Route exact path="/Children-Demo" component={ChildrenDemo} />
            <Route default component={NoMatch} />
          </Switch>
        </div>
      </>
    );
  }
  return (
    <Switch>
      <Redirect to="/login" />
    </Switch>
  );
};
export default PrivateRoute;
