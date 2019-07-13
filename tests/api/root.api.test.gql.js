import gql from 'graphql-tag';

export const PING_QUERY = gql`
    query {
        ping
    }
`;

export const PING_MUTATION = gql`
    mutation {
        ping
    }
`;
