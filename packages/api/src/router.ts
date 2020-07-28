import { execute } from 'graphql-api-koa';
import { schema } from './graphql';

// eslint-disable-next-line import/order
import Router = require('@koa/router');

const router = new Router();

router.get('/hello', (ctx) => {
  ctx.body = 'hello';
});

router.post('/graphql', execute({ schema }));

export { router };
