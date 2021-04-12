import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { LISTING_QUERY } from "../../lib/graphql/queries";
import {
  Listing as ListingData,
  ListingVariables,
} from "../../lib/graphql/queries/Listing/__generated__/Listing";
import { RouteComponentProps } from "react-router";
import { Col, Layout, Row } from "antd";
import { ErrorBanner, PageSkeleton } from "../../lib/components";
import {
  ListingBookings,
  ListingCreateBooking,
  ListingDetials,
} from "./components";
import { mockListingBookings } from "./mocks";
import { Moment } from "moment";
import { Viewer } from "../../lib/types";

interface MatchParams {
  id: string;
}

interface Props {
  viewer: Viewer;
}

const { Content } = Layout;
const PAGE_LIMIT = 3;

export const Listing = ({
  match,
  viewer,
}: Props & RouteComponentProps<MatchParams>) => {
  const [bookingsPage, setBookingsPage] = useState(1);
  const [checkInDate, setCheckInDate] = useState<Moment | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Moment | null>(null);

  const { loading, data, error } = useQuery<ListingData, ListingVariables>(
    LISTING_QUERY,
    {
      variables: {
        id: match.params.id,
        bookingsPage,
        limit: PAGE_LIMIT,
      },
    }
  );

  if (loading) {
    return (
      <Content className="listings">
        <PageSkeleton />
      </Content>
    );
  }

  if (error) {
    return (
      <Content className="listings">
        <ErrorBanner description="This listing may not exists or an error has occurred.  Please try again laster." />
        <PageSkeleton />
      </Content>
    );
  }

  const listing = data ? data.listing : null;
  // const listingBookings = listing ? listing.bookings : null;
  const listingBookings = mockListingBookings;

  const listingDetailsElement = listing ? (
    <ListingDetials listing={listing} />
  ) : null;

  const listingBookingsElement = listingBookings ? (
    <ListingBookings
      listingBookings={listingBookings}
      bookingsPage={bookingsPage}
      limit={PAGE_LIMIT}
      setBookingsPage={setBookingsPage}
    />
  ) : null;

  const listingCreateBookingElement = listing ? (
    <ListingCreateBooking
      viewer={viewer}
      host={listing.host}
      price={listing.price}
      bookingsIndex={listing.bookingsIndex}
      checkInDate={checkInDate}
      checkOutDate={checkOutDate}
      setCheckInDate={setCheckInDate}
      setCheckOutDate={setCheckOutDate}
    />
  ) : null;

  return (
    <Content className="listings">
      <Row gutter={24} type="flex" justify="space-between">
        <Col xs={24} lg={14}>
          {listingDetailsElement}
          {listingBookingsElement}
        </Col>
        <Col xs={24} lg={10}>
          {listingCreateBookingElement}
        </Col>
      </Row>
    </Content>
  );
};
