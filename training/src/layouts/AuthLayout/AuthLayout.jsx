// import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { Footer } from '../Componants';
// // import { Login } from '../../pages';
// import Wrapper from '../../pages/Login/wrapper';

// class AuthLayout extends Component {
//   render() {
//     const { history } = this.props;
//     return (
//       <>
//         <Wrapper history={history} />
//         <Footer />
//       </>
//     );
//   }
// }
// AuthLayout.propTypes = {
//   history: PropTypes.instanceOf(Object).isRequired,
// };
// export default AuthLayout;

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

      <Mutation mutation={LOGIN_USER}>
        {(loginUser) => (
          <>
            <Login loginUser={loginUser} history={history} />
            <Footer />
          </>
        )}
      </Mutation>
    );
  }
}
AuthLayout.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
};
export default AuthLayout;
