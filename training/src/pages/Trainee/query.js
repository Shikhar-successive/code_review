import { gql } from '@apollo/client';

const GET_USER = gql`
  query GetAllTrainee($skip: Int, $limit: Int) {
    getAllTrainee(display: {skip: $skip, limit: $limit}){
    status
    message
    data {
      totalRecords
      count
      records {
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
  }
`;

export {
  GET_USER,
};
