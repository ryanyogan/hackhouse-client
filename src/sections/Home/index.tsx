import React from "react";
import { Layout } from "antd";
import { HomeHero } from "./components";
import mapBackground from "./assets/map-background.jpeg";
import { RouteComponentProps } from "react-router";
import { displayErrorMessage } from "../../lib/utils";

const { Content } = Layout;

export const Home = ({ history }: RouteComponentProps) => {
  const onSearch = (value: string) => {
    const trimmedValue = value.trim();
    if (trimmedValue.length <= 0) {
      return displayErrorMessage("Please enter a valid search.");
    }
    history.push(`/listings/${value}`);
  };

  return (
    <Content
      className="home"
      style={{ backgroundImage: `url(${mapBackground})` }}
    >
      <HomeHero onSearch={onSearch} />
    </Content>
  );
};
