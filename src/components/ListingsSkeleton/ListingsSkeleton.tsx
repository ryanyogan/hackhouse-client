import React from "react";
import { Alert, Divider, Skeleton } from "antd";
import "./styles/ListingsSkeleton.css";

interface Props {
  title: string;
  error?: boolean;
}

export const ListingsSkeleton = ({ title, error = false }: Props) => {
  const errorAlert = error ? (
    <Alert
      className="listings-skeleton__alert"
      type="error"
      message="Uh oh! Something went wrong :("
    />
  ) : null;

  return (
    <div>
      <h2>{title}</h2>
      {errorAlert}
      <Skeleton active paragraph={{ rows: 1 }} />
      <Divider />
      <Skeleton active paragraph={{ rows: 1 }} />
      <Divider />
      <Skeleton active paragraph={{ rows: 1 }} />
    </div>
  );
};
