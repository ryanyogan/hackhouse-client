import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { LISTING_QUERY } from "../../lib/graphql/queries";
import {
  Listing as ListingData,
  ListingVariables,
} from "../../lib/graphql/queries/Listing/__generated__/Listing";
import { useParams } from "react-router";
import { Col, Layout, Row } from "antd";
import { ErrorBanner, PageSkeleton } from "../../lib/components";
import {
  ListingBookings,
  ListingCreateBooking,
  ListingCreateBookingModal,
  ListingDetials,
} from "./components";
import { Moment } from "moment";
import { Viewer } from "../../lib/types";
import { useScrollToTop } from "../../lib/hooks";

interface MatchParams {
  id: string;
}

interface Props {
  viewer: Viewer;
}

const { Content } = Layout;
const PAGE_LIMIT = 3;

export const Listing = ({ viewer }: Props) => {
  const [bookingsPage, setBookingsPage] = useState(1);
  const [checkInDate, setCheckInDate] = useState<Moment | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Moment | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { id } = useParams<MatchParams>();

  const { loading, data, error, refetch } = useQuery<
    ListingData,
    ListingVariables
  >(LISTING_QUERY, {
    variables: {
      id,
      bookingsPage,
      limit: PAGE_LIMIT,
    },
  });

  useScrollToTop();

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
  const listingBookings = listing ? listing.bookings : null;

  const clearBookingData = () => {
    setModalVisible(false);
    setCheckInDate(null);
    setCheckOutDate(null);
  };

  const handleListingRefetch = async () => {
    await refetch();
  };

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
      setModalVisible={setModalVisible}
    />
  ) : null;

  const listingCreateBookingModalElement =
    listing && checkInDate && checkOutDate ? (
      <ListingCreateBookingModal
        id={listing.id}
        price={listing.price}
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        clearBookingData={clearBookingData}
        handleListingRefetch={handleListingRefetch}
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
      {listingCreateBookingModalElement}
    </Content>
  );
};
