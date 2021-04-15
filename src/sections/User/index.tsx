import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { RouteComponentProps, useParams } from "react-router";
import { USER_QUERY } from "../../lib/graphql/queries";
import {
  User as UserData,
  UserVariables,
} from "../../lib/graphql/queries/User/__generated__/User";
import { Col, Layout, Row } from "antd";
import { UserBookings, UserListings, UserProfile } from "./components";
import { Viewer } from "../../lib/types";
import { ErrorBanner, PageSkeleton } from "../../lib/components";
import { useScrollToTop } from "../../lib/hooks";

const { Content } = Layout;

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}
interface MatchParams {
  id: string;
}

const PAGE_LIMIT = 4;

export const User = ({
  viewer,
  setViewer,
}: Props & RouteComponentProps<MatchParams>) => {
  const [listingsPage, setListingsPage] = useState(1);
  const [bookingsPage, setBookingsPage] = useState(1);
  const { id } = useParams<MatchParams>();

  const { data, loading, error, refetch } = useQuery<UserData, UserVariables>(
    USER_QUERY,
    {
      variables: {
        id,
        bookingsPage,
        listingsPage,
        limit: PAGE_LIMIT,
      },
      fetchPolicy: "cache-and-network",
    }
  );

  useScrollToTop();

  if (loading) {
    return (
      <Content className="user">
        <PageSkeleton />
      </Content>
    );
  }

  if (error) {
    return (
      <Content className="user">
        <ErrorBanner description="This user may not exist or an error has occurred.  Please try again." />
        <PageSkeleton />
      </Content>
    );
  }

  const user = data?.user ?? null;
  const viewerIsUser = viewer.id === id;

  const userListings = user ? user.listings : null;
  const userBookings = user ? user.bookings : null;

  const handleUserRefetch = async () => {
    await refetch();
  };

  const userProfileElement = user ? (
    <UserProfile
      user={user}
      viewerIsUser={viewerIsUser}
      viewer={viewer}
      setViewer={setViewer}
      handleUserRefetch={handleUserRefetch}
    />
  ) : null;

  const userListingsElement = userListings ? (
    <UserListings
      userListings={userListings}
      listingsPage={listingsPage}
      limit={PAGE_LIMIT}
      setListingsPage={setListingsPage}
    />
  ) : null;

  const userBookingElement = userBookings ? (
    <UserBookings
      userBookings={userBookings}
      bookingsPage={bookingsPage}
      limit={PAGE_LIMIT}
      setBookingsPage={setBookingsPage}
    />
  ) : null;

  const stripeError = new URL(window.location.href).searchParams.get(
    "stripe_error"
  );
  const stripeErrorBanner = stripeError ? (
    <ErrorBanner description="We had an issue connecting with Stripe.  Please try again." />
  ) : null;

  return (
    <Content className="user">
      {stripeErrorBanner}
      <Row gutter={12} type="flex" justify="space-between">
        <Col xs={24}>{userProfileElement}</Col>
        <Col xs={24}>
          {userListingsElement}
          {userBookingElement}
        </Col>
      </Row>
    </Content>
  );
};
