import React from "react";
import { Col, Layout, Row, Typography } from "antd";
import { HomeHero, HomeListings, HomeListingsSkeleton } from "./components";
import { RouteComponentProps } from "react-router";
import { displayErrorMessage } from "../../lib/utils";
import { Link } from "react-router-dom";
import {
  Listings as ListingsData,
  ListingsVariables,
} from "../../lib/graphql/queries/Listings/__generated__/Listings";

import mapBackground from "./assets/map-background.jpeg";
import sanFransiscoImage from "./assets/san-fransisco.jpeg";
import cancunImage from "./assets/cancun.jpeg";
import { useQuery } from "@apollo/client";
import { LISTINGS_QUERY } from "../../lib/graphql/queries";
import { ListingsFilter } from "../../lib/graphql/globalTypes";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const PAGE_LIMIT = 4;
const PAGE_NUMBER = 1;

export const Home = ({ history }: RouteComponentProps) => {
  const { loading, data } = useQuery<ListingsData, ListingsVariables>(
    LISTINGS_QUERY,
    {
      variables: {
        filter: ListingsFilter.PRICE_HIGH_TO_LOW,
        limit: PAGE_LIMIT,
        page: PAGE_NUMBER,
      },
      fetchPolicy: "cache-and-network",
    }
  );

  const onSearch = (value: string) => {
    const trimmedValue = value.trim();
    if (trimmedValue.length <= 0) {
      return displayErrorMessage("Please enter a valid search.");
    }
    history.push(`/listings/${value}`);
  };

  const renderListingsSection = () => {
    if (loading) {
      return <HomeListingsSkeleton />;
    }

    if (data) {
      return (
        <HomeListings
          title="Premium Listings"
          listings={data.listings.result}
        />
      );
    }

    return null;
  };

  return (
    <Content
      className="home"
      style={{ backgroundImage: `url(${mapBackground})` }}
    >
      <HomeHero onSearch={onSearch} />

      <div className="home__cta-section">
        <Title level={2} className="home__cta-section-title">
          Your guide to see the world...
        </Title>
        <Paragraph>
          Helping you make the best decisions in renting your last minute
          locations, quick, easy, and not like the others.
        </Paragraph>

        <Link
          to="/listings/united%20states"
          className="ant-btn ant-btn-primary ant-btn-lg home__cta-section-button"
        >
          Popular listings in the United States
        </Link>
      </div>

      {renderListingsSection()}

      <div className="home__listings">
        <Title level={4} className="home__listings-title">
          Take a fun trip to a random place...
        </Title>
        <Row gutter={12}>
          <Col xs={24} sm={12}>
            <Link to="/listings/san%20fransisco">
              <div className="home__listings-img-cover">
                <img
                  src={sanFransiscoImage}
                  alt="San Fransisco"
                  className="home__listings-img"
                />
              </div>
            </Link>
          </Col>
          <Col xs={24} sm={12}>
            <Link to="/listings/cancun">
              <div className="home__listings-img-cover">
                <img
                  src={cancunImage}
                  alt="Cancun"
                  className="home__listings-img"
                />
              </div>
            </Link>
          </Col>
        </Row>
      </div>
    </Content>
  );
};
