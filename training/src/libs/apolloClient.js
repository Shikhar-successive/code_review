import { InMemoryCache } from 'apollo-boost';
import ApolloClient from 'apollo-client';
// import { ApolloClient } from 'apollo-boost';
import { createHttpLink } from 'apollo-link-http';

// const httpLink = new HttpLink({
//   uri: 'http://localhost:8000',
// });

const httpLink = createHttpLink({ uri: 'http://localhost:8000/graphql' });

const cache = new InMemoryCache();

const client = new ApolloClient({
  link: httpLink,
  cache,
});
console.log(cache, 'cache');
console.log(httpLink, 'link');
console.log(client, 'client');
export default client;
