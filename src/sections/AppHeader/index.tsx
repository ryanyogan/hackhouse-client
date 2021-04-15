import React, { useEffect, useState } from "react";
import { Input, Layout } from "antd";
import { Link, useHistory, useLocation } from "react-router-dom";
import logo from "./assets/tinyhouse-logo.png";
import { MenuItems } from "./components";
import { Viewer } from "../../lib/types";
import { displayErrorMessage } from "../../lib/utils";

const { Header } = Layout;
const { Search } = Input;

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

export const AppHeader = ({ viewer, setViewer }: Props) => {
  const [search, setSearch] = useState("");
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const { pathname } = location;
    const subPath = pathname.split("/");

    if (!pathname.includes("/listings")) {
      setSearch("");
      return;
    }

    if (pathname.includes("/listings") && subPath.length === 3) {
      setSearch(subPath[2]);
      return;
    }
  }, [location]);

  const onSearch = (value: string) => {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      return displayErrorMessage("Please enter a valid search.");
    }

    history.push(`/listings/${trimmedValue}`);
  };

  return (
    <Header className="app-header">
      <div className="app-header__logo-search-section">
        <div className="app-header__logo">
          <Link to="/">
            <img src={logo} alt="TinyHouse Logo" />
          </Link>
        </div>
        <div className="app-header__search-input">
          <Search
            placeholder="Search 'San Fransisco'"
            enterButton
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSearch={onSearch}
          />
        </div>
      </div>
      <div className="app-header__menu-section">
        <MenuItems viewer={viewer} setViewer={setViewer} />
      </div>
    </Header>
  );
};
