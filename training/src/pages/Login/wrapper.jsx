// import React, { Component } from 'react';
// import { Mutation } from '@apollo/react-components';
// import PropTypes from 'prop-types';
// import { LOGIN_USER } from './mutation';
// import Login from './Login';

// export default class Wrapper extends Component {
//   render() {
//     const { history } = this.props;
//     return (
//       <Mutation mutation={LOGIN_USER}>
//         {(loginUser) => (
//           <>
//             <Login loginUser={loginUser} history={history} />
//           </>
//         )}
//       </Mutation>
//     );
//   }
// }
// Wrapper.propTypes = {
//   history: PropTypes.instanceOf(Object).isRequired,
// };
