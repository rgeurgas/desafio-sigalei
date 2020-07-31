import React from 'react';
import './App.css';
import { Routes } from './Routes';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Home } from './Views/Home/Home';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route
          path={`${Routes.HOME}`}
          render={(props) => <Home expression={'master'} />}
        />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
