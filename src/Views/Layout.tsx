import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Typography, IconButton, SvgIcon } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

interface Props {
  toolbar?: string;
  children: React.ReactNode;
}

/**
 * Creates the default layout for the website
 * @param toolbar - Toolbar text
 * @param children - Content bellow the AppBar
 */
export default function Layout({
  toolbar = 'Desafio Sigalei',
  children,
}: Props) {
  // Hook for routing
  const history = useHistory();

  return (
    <React.Fragment>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => {
              history.push('/');
            }}
          >
            <SvgIcon>
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </SvgIcon>
          </IconButton>
          <Typography variant="h6" style={{ paddingLeft: 16 }}>
            {toolbar}
          </Typography>
        </Toolbar>
      </AppBar>
      {children}
    </React.Fragment>
  );
}
