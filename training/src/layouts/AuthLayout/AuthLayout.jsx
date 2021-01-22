import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from '@apollo/react-components';
import { Footer } from '../Componants';
import { Login } from '../../pages';
import { LOGIN_USER } from '../../pages/Login/mutation';

class AuthLayout extends Component {
  render() {
    const { history } = this.props;
    return (
      <>
        <Mutation mutation={LOGIN_USER}>
          {(loginUser) => (
            <>
              <Login history={history} loginUser={loginUser} />
              <Footer />
            </>
          )}
        </Mutation>
      </>
    );
    // return (
    //   <>
    //     <Login history={history} />
    //     <Footer />
    //   </>
    // );
  }
}
AuthLayout.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
};
export default AuthLayout;
