import { useQuery } from "@apollo/client";
import { Layout, List } from "antd";
import React from "react";
import { ListingCard } from "../../lib/components";
import { ListingsFilter } from "../../lib/graphql/globalTypes";
import { LISTINGS_QUERY } from "../../lib/graphql/queries";
import {
  Listings as ListingsData,
  ListingsVariables,
} from "../../lib/graphql/queries/Listings/__generated__/Listings";

const { Content } = Layout;
const PAGE_LIMIT = 8;

export const Listings = () => {
  const { data } = useQuery<ListingsData, ListingsVariables>(LISTINGS_QUERY, {
    variables: {
      filter: ListingsFilter.PRICE_LOW_TO_HIGH,
      limit: PAGE_LIMIT,
      page: 1,
    },
  });

  const listings = data ? data.listings : null;

  const listingsSectionElement = listings ? (
    <List
      grid={{
        gutter: 8,
        xs: 1,
        md: 2,
        lg: 4,
      }}
      dataSource={listings.result}
      renderItem={(listing) => (
        <List.Item>
          <ListingCard listing={listing} />
        </List.Item>
      )}
    />
  ) : null;

  return <Content className="listings">{listingsSectionElement}</Content>;
};
