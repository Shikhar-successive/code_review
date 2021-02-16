import { InMemoryCache } from 'apollo-boost';
import ApolloClient from 'apollo-client';
import { HttpLink } from '@apollo/client';
import { setContext } from 'apollo-link-context';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';

const httpLink = new HttpLink({ uri: `${process.env.REACT_APP_Apollo_URI}` });

const wsLink = new WebSocketLink({
  uri: `${process.env.REACT_APP_APOLLO_SUBSCRIPTION_URI}`,
  options: {
    reconnect: true,
  },
});

const authLink = setContext(() => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      authorization: token,
    },
  };
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      (definition.kind === 'OperationDefinition') && (definition.operation === 'subscription')
    );
  },
  wsLink,
  httpLink,
);

const cache = new InMemoryCache();

const client = new ApolloClient({
  link: authLink.concat(link),
  cache,
});
export default client;
