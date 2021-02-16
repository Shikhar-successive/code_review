import { gql } from '@apollo/client';

const CREATE_USER = gql`
  mutation create($name: String!, $email: String!, $password: String!, $role: String!, $createdBy: String!) {
    create(user: {name: $name, email: $email, password: $password, role: $role, createdBy: $createdBy}) {
      message
      data {
        name
        email
      }
    }
  }
`;

const UPDATE_USER = gql`
  mutation update($originalId: ID!, $name: String!, $email: String!, $role: String!, $updatedBy: String!) {
    update(user: {originalId: $originalId, name: $name, email: $email, role: $role, updatedBy: $updatedBy}) {
     message
      data {
        name
        email
      }
    }
  }
`;

const DELETE_USER = gql`
  mutation deleteUser($originalId: ID!) {
    deleteUser(user: {originalId: $originalId}) {
      message
      data {
        id
      }
    }
  }
`;

export {
  CREATE_USER,
  UPDATE_USER,
  DELETE_USER,
};
