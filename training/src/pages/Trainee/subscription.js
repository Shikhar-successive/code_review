import { gql } from 'apollo-boost';

const TRAINEE_UPDATED = gql`
  subscription {
    traineeUpdated {
      message
      data {
        name
        email
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
