import React from "react";
import { Layout } from "antd";
import { HomeHero } from "./components";
import mapBackground from "./assets/map-background.jpeg";

const { Content } = Layout;

export const Home = () => {
  return (
    <Content
      className="home"
      style={{ backgroundImage: `url(${mapBackground})` }}
    >
      <HomeHero />
    </Content>
  );
};
