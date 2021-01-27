import { gql } from '@apollo/client';
// import { Mutation } from '@apollo/react-hooks';
// import { useMutation } from '@apollo/client';

// console.log('inside mutauon------------');

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
      }
    }
    }
  }
`;

export {
  GET_USER,
};
