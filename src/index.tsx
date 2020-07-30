import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { unregister } from './serviceWorker';
import { RelayEnvironmentProvider } from 'react-relay/hooks';
import environment from './Relay/Environment';
import { ErrorBoundary } from './utils';

ReactDOM.render(
  <RelayEnvironmentProvider environment={environment}>
    <ErrorBoundary
      fallback={(error) => `Error: ${error.message}: ${error.stack}`}
    >
      <React.Suspense fallback={<div>loading...</div>}>
        <App />
      </React.Suspense>
    </ErrorBoundary>
  </RelayEnvironmentProvider>,
  document.getElementById('root'),
);

unregister();
