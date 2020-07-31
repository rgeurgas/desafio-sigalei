import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { unregister } from './serviceWorker';
import { RelayEnvironmentProvider } from 'react-relay/hooks';
import environment from './Relay/Environment';
import { ErrorBoundary, loading } from './utils';
import Layout from './Views/Layout';

ReactDOM.render(
  <RelayEnvironmentProvider environment={environment}>
    <Layout>
      <ErrorBoundary
        fallback={(error) => `Error: ${error.message}: ${error.stack}`}
      >
        <React.Suspense fallback={loading()}>
          <App />
        </React.Suspense>
      </ErrorBoundary>
    </Layout>
  </RelayEnvironmentProvider>,
  document.getElementById('root'),
);

unregister();
