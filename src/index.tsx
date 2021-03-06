import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  useMutation,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import reportWebVitals from "./reportWebVitals";
import "./styles/index.css";
import {
  Home,
  Listing,
  User,
  NotFound,
  LogIn,
  Listings,
  AppHeader,
  Stripe,
  WrappedHost as Host,
} from "./sections";
import { Affix, Layout, Spin } from "antd";
import { Viewer } from "./lib/types";
import {
  LogIn as LogInData,
  LogInVariables,
} from "./lib/graphql/mutations/LogIn/__generated__/LogIn";
import { LOG_IN } from "./lib/graphql/mutations/LogIn";
import { AppHeaderSkeleton, ErrorBanner } from "./lib/components";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const httpLink = createHttpLink({
  uri: "/api",
  credentials: "same-origin",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      ...headers,
      "X-CSRF-TOKEN": token ? token : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const initialViewer: Viewer = {
  id: null,
  token: null,
  avatar: null,
  hasWallet: null,
  didRequest: false,
};

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY as string);

const App = () => {
  const [viewer, setViewer] = useState<Viewer>(initialViewer);
  const [logIn, { error }] = useMutation<LogInData, LogInVariables>(LOG_IN, {
    onCompleted: (data) => {
      if (data && data.logIn) {
        setViewer(data.logIn);

        if (data.logIn.token) {
          localStorage.setItem("token", data.logIn.token);
        } else {
          localStorage.removeItem("token");
        }
      }
    },
  });

  const logInRef = useRef(logIn);

  useEffect(() => {
    logInRef.current();
  }, []);

  if (!viewer.didRequest && !error) {
    return (
      <Layout className="app-skeleton">
        <AppHeaderSkeleton />
        <div className="app-skeleton__spin-section">
          <Spin size="large" tip="Launching TinyHouse" />
        </div>
      </Layout>
    );
  }

  const logInErrorBannerElement = error ? (
    <ErrorBanner description="We were not able to verify your user, please log in again." />
  ) : null;

  // TODO: Remove the render-props when you are bored
  return (
    <Router>
      <Layout id="app">
        {logInErrorBannerElement}
        <Affix offsetTop={0} className="app__affix-header">
          <AppHeader viewer={viewer} setViewer={setViewer} />
        </Affix>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route
            exact
            path="/login"
            render={(props) => <LogIn {...props} setViewer={setViewer} />}
          />
          <Route
            exact
            path="/host"
            render={(props) => <Host {...props} viewer={viewer} />}
          />
          <Route
            exact
            path="/listing/:id"
            render={(props) => (
              <Elements stripe={stripePromise}>
                <Listing {...props} viewer={viewer} />
              </Elements>
            )}
          />
          <Route exact path="/listings/:location?" component={Listings} />
          <Route
            exact
            path="/user/:id"
            render={(props) => (
              <User {...props} viewer={viewer} setViewer={setViewer} />
            )}
          />
          <Route
            exact
            path="/stripe"
            render={(props) => (
              <Stripe {...props} viewer={viewer} setViewer={setViewer} />
            )}
          />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </Router>
  );
};

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);

reportWebVitals();
