import gql from 'graphql-tag';

export const AUTH_USER_QUERY = gql`
  query {
    authUser {
      id, email
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      success, message, token
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation signup(
    $fullName: String!,
    $email: String!,
    $password: String!,
    $rePassword: String!
  ) {
    signup(signupReq: {
      fullName: $fullName
      email: $email
      password: $password
      rePassword: $rePassword
    }) {
      success
      message
      user {
        id
        email
      }
    }
  }
`;

export const UPDATE_PERSONAL_INFO_MUTATION = gql`
  mutation updatePersonalInfo($fullName: String!) {
    updatePersonalInfo(fullName: $fullName) {
      id, email, fullName
    }
  }
`;

export const CHANGE_PASSWORD_MUTATION = gql`
  mutation changePassword($password: String!, $newPassword: String!, $reNewPassword: String!) {
    changePassword(password: $password, newPassword: $newPassword, reNewPassword: $reNewPassword)
  }
`;
