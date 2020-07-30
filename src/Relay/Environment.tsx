import { Environment, RecordSource, Store } from 'relay-runtime';
import {
  RelayNetworkLayer,
  urlMiddleware,
  authMiddleware,
  progressMiddleware,
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
  progressMiddleware({
    onProgress: (current, total) => {
      console.log('Downloaded: ' + current + ' B, total: ' + total + ' B');
    },
  }),
]);

export default new Environment({
  network,
  store,
});
