import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { unregister } from './serviceWorker';
import { RelayEnvironmentProvider } from 'react-relay/hooks';
import environment from './Relay/Environment';
import { ErrorBoundary, loading } from './utils';

/**
 * Render main React Component App into #root, uses RelayEnvironmentProvider
 * to create the environment for the react-relay hooks, ErrorBoundary
 * in case of errors and a fallback while loading
 */
ReactDOM.render(
  <RelayEnvironmentProvider environment={environment}>
    <ErrorBoundary
      fallback={(error) => `Error: ${error.message}: ${error.stack}`}
    >
      <React.Suspense fallback={loading()}>
        <App />
      </React.Suspense>
    </ErrorBoundary>
  </RelayEnvironmentProvider>,
  document.getElementById('root'),
);

unregister();
