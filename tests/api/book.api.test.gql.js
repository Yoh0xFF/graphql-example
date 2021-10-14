import gql from 'graphql-tag';

export const CREATE_BOOK_MUTATION = gql`
  mutation createBook($authorIds: [ID!]!, $title: String!, $about: String!) {
    createBook(editBookReq: {
      authorIds: $authorIds,
      title: $title
      about: $about
    }) {
      id
      creator {
        id
      }
      authors {
        id
      }
      title
      about
    }
  }
`;

export const EDIT_BOOK_MUTATION = gql`
  mutation editBook($id: ID!, $authorIds: [ID!]!, $title: String!, $about: String!) {
    editBook(id: $id, editBookReq: {
      authorIds: $authorIds,
      title: $title
      about: $about
    }) {
      id
      creator {
        id
      }
      authors {
        id
      }
      title
      about
    }
  }
`;

export const DEL_BOOK_MUTATION = gql`
  mutation deleteBook($id: ID!) {
    deleteBook(id: $id) {
      id
      title
      about
    }
  }
`;

export const BOOK_BY_ID_QUERY = gql`
  query bookById($id: ID!) {
    bookById(id: $id) {
      id, title, about
    }
  }
`;

export const BOOKS_QUERY = gql`
  query books($first: Int = 10, $offset: Int = 1) {
    books(first: $first, offset: $offset) {
      id, title, about
    }
  }
`;
