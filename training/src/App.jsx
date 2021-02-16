import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import { ApolloProvider } from '@apollo/react-hooks';
import { AuthRoute, PrivateRoute } from './routes';
import { SnackBarProvider } from './contexts/SnackBarProvider';
import apolloClient from './libs/apolloClient';
// import { Trainee } from './pages';
// import { theme } from './theme';

function App() {
  // const myTheme = theme();
  return (
    // <div className={myTheme.root}>
    <SnackBarProvider>
      <ApolloProvider client={apolloClient}>
        <CssBaseline />
        <Router>
          <Switch>
            <Route path="/login" component={AuthRoute} />
            <Route default component={PrivateRoute} />
          </Switch>
        </Router>
      </ApolloProvider>
    </SnackBarProvider>
  );
}
export default App;
