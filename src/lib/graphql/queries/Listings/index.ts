import gql from "graphql-tag";

export const LISTINGS_QUERY = gql`
  query Listings($filter: ListingsFilter!, $limit: Int!, $page: Int!) {
    listings(filter: $filter, limit: $limit, page: $page) {
      result {
        id
        title
        image
        address
        price
        numOfGuests
      }
    }
  }
`;