import { InMemoryCache } from 'apollo-boost';
import ApolloClient from 'apollo-client';
import { HttpLink } from '@apollo/client';
import { setContext } from 'apollo-link-context';

console.log(process.env.REACT_APP_Apollo_URI);
const httpLink = new HttpLink({ uri: process.env.REACT_APP_Apollo_URI });

const authLink = setContext(() => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      authorization: token,
    },
  };
});

const cache = new InMemoryCache();

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
});
// console.log(cache, 'cache');
// console.log(httpLink, 'link');
// console.log(client, 'client');
export default client;
