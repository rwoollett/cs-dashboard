import {
  ApolloClient, HttpLink,
  InMemoryCache, 
  from, split
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities'

//const getToken = () => localStorage.getItem('jwtToken'); // Replace with your token retrieval logic
const getToken = (token: string | null) => {
  return token; // Retrieve the token from the context
};

function createApolloClient(token: string | null) {

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : '', // Add the JWT token here
      },
    };
  });

  const wsLinkCSToken = new GraphQLWsLink(createClient({
    url: `${process.env.REACT_APP_CSTOKEN_APOLLO_SERVER_WS}/graphql`,
    connectionParams: () => ({
      headers: {
        Authorization: `Bearer ${token}`, // Add the JWT token here
      },
    }),
  }));

  // const httpLinkCSToken = new HttpLink({
  //   uri: `${process.env.REACT_APP_CSTOKEN_APOLLO_SERVER_URL}/graphql`, // Server URL (must be absolute)
  //   credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
  // });
  const httpLinkCSToken = from([
    authLink,
    new HttpLink({
      uri: `${process.env.REACT_APP_CSTOKEN_APOLLO_SERVER_URL}/graphql`, // Server URL (must be absolute)
      credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
    }),
  ]);


  const wsLinkGOL = new GraphQLWsLink(createClient({
    url: `${process.env.REACT_APP_GOL_APOLLO_SERVER_WS}/graphql`,
  }));

  const httpLinkGOL = new HttpLink({
    uri: `${process.env.REACT_APP_GOL_APOLLO_SERVER_URL}/graphql`,
    credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
  })

  const wsLinkTTT = new GraphQLWsLink(createClient({
    url: `${process.env.REACT_APP_TTT_APOLLO_SERVER_WS}/graphql`,
  }));

  const httpLinkTTT = new HttpLink({
    uri: `${process.env.REACT_APP_TTT_APOLLO_SERVER_URL}/graphql`, // Server URL (must be absolute)
    credentials: 'same-origin',
  })

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Path: ${path}`
        )
      )
    if (networkError) console.log(`[Network error]: ${networkError}`)
  })

  return new ApolloClient({
    link: split(operation => operation.getContext().service === 'gol',
      split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
          );
        },
        wsLinkGOL,
        from([errorLink, httpLinkGOL]),
      ),
      split(operation => operation.getContext().service === 'ttt',
        split(
          ({ query }) => {
            const definition = getMainDefinition(query);
            return (
              definition.kind === 'OperationDefinition' &&
              definition.operation === 'subscription'
            );
          },
          wsLinkTTT,
          from([errorLink, httpLinkTTT]),),
        split(
          ({ query }) => {
            const definition = getMainDefinition(query);
            return (
              definition.kind === 'OperationDefinition' &&
              definition.operation === 'subscription'
            );
          },
          wsLinkCSToken,
          from([errorLink, httpLinkCSToken]),
        ))
    ),
    cache: new InMemoryCache(),
  })
}

export { getToken };
export default createApolloClient;