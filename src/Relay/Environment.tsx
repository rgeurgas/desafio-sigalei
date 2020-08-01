import { Environment, RecordSource, Store } from 'relay-runtime';
import {
  RelayNetworkLayer,
  urlMiddleware,
  authMiddleware,
} from 'react-relay-network-modern';

const source = new RecordSource();
const store = new Store(source);
const network = new RelayNetworkLayer([
  urlMiddleware({
    url: (req) => Promise.resolve('https://api.github.com/graphql'),
  }),
  authMiddleware({
    token: () => `${process.env.REACT_APP_GITHUB_PRIVATE_KEY}`,
  }),
]);

export default new Environment({
  network,
  store,
});
