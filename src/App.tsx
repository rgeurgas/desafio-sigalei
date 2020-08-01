import React from 'react';
import './App.css';
import { Routes } from './Routes';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Home } from './Views/Home/Home';
import Layout from './Views/Layout';
import { Commits } from './Views/Commits/Commits';
import Typography from '@material-ui/core/Typography';
import queryString from 'query-string';

export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route
          exact
          path={Routes.HOME}
          render={(props) => (
            <Layout>
              <Home />
            </Layout>
          )}
        />
        <Route
          path={Routes.COMMITS}
          render={(props) => {
            const { user } = queryString.parse(props.location.search);

            return (
              <Layout toolbar={user as string}>
                <Commits user={user as string} />
              </Layout>
            );
          }}
        />
        <Route
          render={(props) => (
            <Typography>Invalid path: {props.location.pathname}</Typography>
          )}
        />
      </Switch>
    </BrowserRouter>
  );
}
