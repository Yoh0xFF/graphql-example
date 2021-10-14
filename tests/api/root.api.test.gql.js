import gql from 'graphql-tag';

export const SAY_HELLO_QUERY = gql`
  query {
    sayHello(name: "User")
  }
`;

export const SAY_HELLO_MUTATION = gql`
  mutation {
    sayHello(name: "User")
  }
`;
