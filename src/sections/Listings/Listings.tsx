import gql from "graphql-tag";
import React from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { Listings as ListingsData } from "./__generated__/Listings";
import {
  DeleteListing as DeleteListingData,
  DeleteListingVariables,
} from "./__generated__/DeleteListing";
import { Avatar, Button, List } from "antd";
import "./styles/Listings.css";

const LISTINGS = gql`
  query Listings {
    listings {
      id
      title
      image
      address
      price
      numOfGuests
      numOfBeds
      numOfBaths
      rating
    }
  }
`;

const DELETE_LISTING = gql`
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id) {
      id
    }
  }
`;

interface Props {
  title: string;
}

export const Listings = ({ title }: Props) => {
  const { data, loading, error, refetch } = useQuery<ListingsData>(LISTINGS);
  const [
    deleteListing,
    { loading: deleteLoading, error: deleteError },
  ] = useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTING);

  const handleDeleteListing = async (id: string) => {
    await deleteListing({ variables: { id } });
    refetch();
  };

  const listings = data ? data.listings : null;

  const listingsList = listings ? (
    <List
      itemLayout="horizontal"
      dataSource={listings}
      renderItem={(listing) => (
        <List.Item
          actions={[
            <Button
              type="primary"
              onClick={() => handleDeleteListing(listing.id)}
            >
              Delete
            </Button>,
          ]}
        >
          <List.Item.Meta
            title={listing.title}
            description={listing.address}
            avatar={<Avatar src={listing.image} shape="square" size={48} />}
          />
        </List.Item>
      )}
    />
  ) : null;

  if (error) {
    return <h2>Uh oh! Something went wrong</h2>;
  }

  if (loading) {
    return <h2>Loading...</h2>;
  }

  const deleteListingLoadingMessage = deleteLoading ? (
    <h4>Deletion in progress...</h4>
  ) : null;

  const deleteListingErrorMessage = deleteError ? (
    <h4>Uh Oh! Something done fucked up...</h4>
  ) : null;

  return (
    <div className="listings">
      <h2>{title}</h2>
      {listingsList}
      {deleteListingLoadingMessage}
      {deleteListingErrorMessage}
    </div>
  );
};
