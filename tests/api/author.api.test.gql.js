import gql from 'graphql-tag';

export const CREATE_AUTHOR_MUTATION = gql`
  mutation createAuthor($fullName: String!, $about: String!) {
    createAuthor(editAuthorReq: {
      fullName: $fullName
      about: $about
    }) {
      id
      creator {
        id
      }
      fullName
      about
    }
  }
`;

export const EDIT_AUTHOR_MUTATION = gql`
  mutation editAuthor($id: ID!, $fullName: String!, $about: String!) {
    editAuthor(id: $id, editAuthorReq: {
      fullName: $fullName
      about: $about
    }) {
      id
      fullName
      about
    }
  }
`;

export const DEL_AUTHOR_MUTATION = gql`
  mutation deleteAuthor($id: ID!) {
    deleteAuthor(id: $id) {
      id
      fullName
      about
    }
  }
`;

export const AUTHOR_BY_ID_QUERY = gql`
  query authorById($id: ID!) {
    authorById(id: $id) {
      id, fullName, about
    }
  }
`;

export const AUTHORS_QUERY = gql`
  query authors($first: Int = 10, $offset: Int = 1) {
    authors(first: $first, offset: $offset) {
      id, fullName, about
    }
  }
`;
