import gql from 'graphql-tag';

export const EDIT_USER_MUTATION = gql`
  mutation editUser($id: ID!, $fullName: String!, $email: String!) {
    editUser(id: $id, editUserReq: {
      fullName: $fullName,
      email: $email
    }) {
      id, fullName, email
    }
  }
`;

export const DEL_USER_MUTATION = gql`
  mutation deleteUser($id: ID!) {
    deleteUser(id: $id) {
      id, fullName, email
    }
  }
`;

export const USER_BY_ID_QUERY = gql`
  query userById($id: ID!) {
    userById(id: $id) {
      id, fullName, email
    }
  }
`;

export const USERS_QUERY = gql`
  query users {
    users {
      id, fullName, email
    }
  }
`;
