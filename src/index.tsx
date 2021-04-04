import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import reportWebVitals from "./reportWebVitals";
import "./styles/index.css";
import { Home, Listing, User, NotFound, LogIn, Listings } from "./sections";
import { Layout } from "antd";

const client = new ApolloClient({
  uri: "/api",
  cache: new InMemoryCache(),
});

const App = () => {
  return (
    <Router>
      <Layout id="app">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={LogIn} />
          <Route exact path="/host" component={Home} />
          <Route exact path="/listing/:id" component={Listing} />
          <Route exact path="/listings/:location?" component={Listings} />
          <Route exact path="/user/:id" component={User} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </Router>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
