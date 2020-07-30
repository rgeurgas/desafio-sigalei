import React from 'react';
import './App.css';
import { Routes } from './Routes';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Home } from './Views/Home';

// Colocar o router aqui
function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path={`${Routes.HOME}`} component={Home} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
