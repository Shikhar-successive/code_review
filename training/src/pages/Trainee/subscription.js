import { gql } from '@apollo/client';

const TRAINEE_UPDATED = gql`
  subscription {
    traineeUpdated {
      status
      message
      data {
        _id
        name
        email
        role
        password
        createdAt
        originalId
      }
    }
  }
`;

const TRAINEE_DELETED = gql`
  subscription {
    traineeDeleted {
      message
      data {
        id
      }
    }
  }
`;

export {
  TRAINEE_UPDATED,
  TRAINEE_DELETED,
};
