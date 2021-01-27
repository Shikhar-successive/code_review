import { gql } from '@apollo/client';
// import { Mutation } from '@apollo/react-hooks';
// import { useMutation } from '@apollo/client';

// console.log('inside login mutauon');

const LOGIN_USER = gql`
  mutation loginUser($email: String!, $password: String!) {
    loginUser(payload: {email: $email, password: $password})
  }
`;

export {
  LOGIN_USER,
};
