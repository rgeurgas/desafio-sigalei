import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Desafio Sigalei</Typography>
        </Toolbar>
      </AppBar>
      {children}
    </React.Fragment>
  );
}
