import React from "react";
import { useQuery } from "@apollo/client";
import { RouteComponentProps } from "react-router";
import { USER_QUERY } from "../../lib/graphql/queries";
import {
  User as UserData,
  UserVariables,
} from "../../lib/graphql/queries/User/__generated__/User";
import { Col, Layout, Row } from "antd";
import { UserProfile } from "./components";
import { Viewer } from "../../lib/types";

const { Content } = Layout;

interface Props {
  viewer: Viewer;
}
interface MatchParams {
  id: string;
}

export const User = ({
  match,
  viewer,
}: Props & RouteComponentProps<MatchParams>) => {
  const { data, loading, error } = useQuery<UserData, UserVariables>(
    USER_QUERY,
    {
      variables: {
        id: match.params.id,
      },
    }
  );

  const user = data?.user ?? null;
  const viewerIsUser = viewer.id === match.params.id;

  const userProfileElement = user ? (
    <UserProfile user={user} viewerIsUser={viewerIsUser} />
  ) : null;

  return (
    <Content className="user">
      <Row gutter={12} type="flex" justify="space-between">
        <Col xs={24}>{userProfileElement}</Col>
      </Row>
    </Content>
  );
};
