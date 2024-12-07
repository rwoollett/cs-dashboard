import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

/** A client ip takes ownership of CS token from the sourceIp */
export type AcquireCs = {
  __typename?: 'AcquireCS';
  acquiredAt: Scalars['String']['output'];
  ip: Scalars['String']['output'];
  sourceIp: Scalars['String']['output'];
};

/** Clients to request and acquire the single token for CS */
export type Client = {
  __typename?: 'Client';
  connected: Scalars['Boolean']['output'];
  connectedAt: Scalars['String']['output'];
  disconnectedAt: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  ip: Scalars['String']['output'];
  name: Scalars['String']['output'];
  processId?: Maybe<Scalars['String']['output']>;
  /** The client ip associated request parent record(always the same two record using ip) */
  requestParent: RequestParent;
};

/** Connected client to an ip on network CS */
export type ConnectedClient = {
  __typename?: 'ConnectedClient';
  connectedAt: Scalars['String']['output'];
  processId: Scalars['String']['output'];
  sourceIp: Scalars['String']['output'];
};

/** Disconnected client from an ip on network CS */
export type DisconnectedClient = {
  __typename?: 'DisconnectedClient';
  disconnectedAt: Scalars['String']['output'];
  sourceIp: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  connectClientCS: ConnectedClient;
  createAcquireCS: AcquireCs;
  createClient: Client;
  createRequestCS: RequestCs;
  disconnectClientCS: DisconnectedClient;
};


export type MutationConnectClientCsArgs = {
  processId: Scalars['String']['input'];
  sourceIp: Scalars['String']['input'];
};


export type MutationCreateAcquireCsArgs = {
  ip: Scalars['String']['input'];
  sourceIp: Scalars['String']['input'];
};


export type MutationCreateClientArgs = {
  connected: Scalars['Boolean']['input'];
  ip: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type MutationCreateRequestCsArgs = {
  originalIp: Scalars['String']['input'];
  parentIp: Scalars['String']['input'];
  relayed: Scalars['Boolean']['input'];
  sourceIp: Scalars['String']['input'];
};


export type MutationDisconnectClientCsArgs = {
  sourceIp: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  getClients: Array<Maybe<Client>>;
};


export type QueryGetClientsArgs = {
  range: RangePort;
};

/** Port range for list of clients. Ie. all from 5010 to 5020 (from and to) */
export type RangePort = {
  from: Scalars['Int']['input'];
  to: Scalars['Int']['input'];
};

/**
 * A request for CS from a client source ip to its currently known parent ip in the distributed tree
 * If relayed Request, it is because a parentIP was not the root, or is unreachable.
 * The originalIp is the real client wanting to enter CS and acquire token.
 * And when relayed, the sourceIp was the parent ip of the previous relayed sourceIp.
 *
 */
export type RequestCs = {
  __typename?: 'RequestCS';
  originalIp: Scalars['String']['output'];
  parentIp: Scalars['String']['output'];
  relayed: Scalars['Boolean']['output'];
  requestedAt: Scalars['String']['output'];
  sourceIp: Scalars['String']['output'];
};

/** Clients to request and acquire the single token for CS */
export type RequestParent = {
  __typename?: 'RequestParent';
  clientIp: Scalars['String']['output'];
  id: Scalars['Int']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  acquireCS_Created?: Maybe<AcquireCs>;
  clientCS_Connected?: Maybe<ConnectedClient>;
  clientCS_Disconnected?: Maybe<DisconnectedClient>;
  requestCS_Created?: Maybe<RequestCs>;
};


export type SubscriptionClientCs_ConnectedArgs = {
  sourceIp: Scalars['String']['input'];
};


export type SubscriptionClientCs_DisconnectedArgs = {
  sourceIp: Scalars['String']['input'];
};

export type GetClientsQueryVariables = Exact<{
  range: RangePort;
}>;


export type GetClientsQuery = { __typename?: 'Query', getClients: Array<{ __typename?: 'Client', id: number, ip: string, name: string, connected: boolean, connectedAt: string, disconnectedAt: string, requestParent: { __typename?: 'RequestParent', id: number, clientIp: string } } | null> };

export type ConnectClientSubscriptionVariables = Exact<{
  sourceIp: Scalars['String']['input'];
}>;


export type ConnectClientSubscription = { __typename?: 'Subscription', clientCS_Connected?: { __typename?: 'ConnectedClient', connectedAt: string, sourceIp: string } | null };

export type DisconnectClientSubscriptionVariables = Exact<{
  sourceIp: Scalars['String']['input'];
}>;


export type DisconnectClientSubscription = { __typename?: 'Subscription', clientCS_Disconnected?: { __typename?: 'DisconnectedClient', disconnectedAt: string, sourceIp: string } | null };

export type RequestedCsTokenSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type RequestedCsTokenSubscription = { __typename?: 'Subscription', requestCS_Created?: { __typename?: 'RequestCS', sourceIp: string, originalIp: string, parentIp: string, relayed: boolean, requestedAt: string } | null };

export type AcquiredCsTokenSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type AcquiredCsTokenSubscription = { __typename?: 'Subscription', acquireCS_Created?: { __typename?: 'AcquireCS', ip: string, sourceIp: string, acquiredAt: string } | null };


export const GetClientsDocument = gql`
    query GetClients($range: RangePort!) {
  getClients(range: $range) {
    id
    ip
    name
    connected
    connectedAt
    disconnectedAt
    requestParent {
      id
      clientIp
    }
  }
}
    `;

/**
 * __useGetClientsQuery__
 *
 * To run a query within a React component, call `useGetClientsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetClientsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetClientsQuery({
 *   variables: {
 *      range: // value for 'range'
 *   },
 * });
 */
export function useGetClientsQuery(baseOptions: Apollo.QueryHookOptions<GetClientsQuery, GetClientsQueryVariables> & ({ variables: GetClientsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetClientsQuery, GetClientsQueryVariables>(GetClientsDocument, options);
      }
export function useGetClientsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetClientsQuery, GetClientsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetClientsQuery, GetClientsQueryVariables>(GetClientsDocument, options);
        }
export function useGetClientsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetClientsQuery, GetClientsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetClientsQuery, GetClientsQueryVariables>(GetClientsDocument, options);
        }
export type GetClientsQueryHookResult = ReturnType<typeof useGetClientsQuery>;
export type GetClientsLazyQueryHookResult = ReturnType<typeof useGetClientsLazyQuery>;
export type GetClientsSuspenseQueryHookResult = ReturnType<typeof useGetClientsSuspenseQuery>;
export type GetClientsQueryResult = Apollo.QueryResult<GetClientsQuery, GetClientsQueryVariables>;
export const ConnectClientDocument = gql`
    subscription ConnectClient($sourceIp: String!) {
  clientCS_Connected(sourceIp: $sourceIp) {
    connectedAt
    sourceIp
  }
}
    `;

/**
 * __useConnectClientSubscription__
 *
 * To run a query within a React component, call `useConnectClientSubscription` and pass it any options that fit your needs.
 * When your component renders, `useConnectClientSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useConnectClientSubscription({
 *   variables: {
 *      sourceIp: // value for 'sourceIp'
 *   },
 * });
 */
export function useConnectClientSubscription(baseOptions: Apollo.SubscriptionHookOptions<ConnectClientSubscription, ConnectClientSubscriptionVariables> & ({ variables: ConnectClientSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<ConnectClientSubscription, ConnectClientSubscriptionVariables>(ConnectClientDocument, options);
      }
export type ConnectClientSubscriptionHookResult = ReturnType<typeof useConnectClientSubscription>;
export type ConnectClientSubscriptionResult = Apollo.SubscriptionResult<ConnectClientSubscription>;
export const DisconnectClientDocument = gql`
    subscription DisconnectClient($sourceIp: String!) {
  clientCS_Disconnected(sourceIp: $sourceIp) {
    disconnectedAt
    sourceIp
  }
}
    `;

/**
 * __useDisconnectClientSubscription__
 *
 * To run a query within a React component, call `useDisconnectClientSubscription` and pass it any options that fit your needs.
 * When your component renders, `useDisconnectClientSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDisconnectClientSubscription({
 *   variables: {
 *      sourceIp: // value for 'sourceIp'
 *   },
 * });
 */
export function useDisconnectClientSubscription(baseOptions: Apollo.SubscriptionHookOptions<DisconnectClientSubscription, DisconnectClientSubscriptionVariables> & ({ variables: DisconnectClientSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<DisconnectClientSubscription, DisconnectClientSubscriptionVariables>(DisconnectClientDocument, options);
      }
export type DisconnectClientSubscriptionHookResult = ReturnType<typeof useDisconnectClientSubscription>;
export type DisconnectClientSubscriptionResult = Apollo.SubscriptionResult<DisconnectClientSubscription>;
export const RequestedCsTokenDocument = gql`
    subscription RequestedCSToken {
  requestCS_Created {
    sourceIp
    originalIp
    parentIp
    relayed
    requestedAt
  }
}
    `;

/**
 * __useRequestedCsTokenSubscription__
 *
 * To run a query within a React component, call `useRequestedCsTokenSubscription` and pass it any options that fit your needs.
 * When your component renders, `useRequestedCsTokenSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRequestedCsTokenSubscription({
 *   variables: {
 *   },
 * });
 */
export function useRequestedCsTokenSubscription(baseOptions?: Apollo.SubscriptionHookOptions<RequestedCsTokenSubscription, RequestedCsTokenSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<RequestedCsTokenSubscription, RequestedCsTokenSubscriptionVariables>(RequestedCsTokenDocument, options);
      }
export type RequestedCsTokenSubscriptionHookResult = ReturnType<typeof useRequestedCsTokenSubscription>;
export type RequestedCsTokenSubscriptionResult = Apollo.SubscriptionResult<RequestedCsTokenSubscription>;
export const AcquiredCsTokenDocument = gql`
    subscription AcquiredCSToken {
  acquireCS_Created {
    ip
    sourceIp
    acquiredAt
  }
}
    `;

/**
 * __useAcquiredCsTokenSubscription__
 *
 * To run a query within a React component, call `useAcquiredCsTokenSubscription` and pass it any options that fit your needs.
 * When your component renders, `useAcquiredCsTokenSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAcquiredCsTokenSubscription({
 *   variables: {
 *   },
 * });
 */
export function useAcquiredCsTokenSubscription(baseOptions?: Apollo.SubscriptionHookOptions<AcquiredCsTokenSubscription, AcquiredCsTokenSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<AcquiredCsTokenSubscription, AcquiredCsTokenSubscriptionVariables>(AcquiredCsTokenDocument, options);
      }
export type AcquiredCsTokenSubscriptionHookResult = ReturnType<typeof useAcquiredCsTokenSubscription>;
export type AcquiredCsTokenSubscriptionResult = Apollo.SubscriptionResult<AcquiredCsTokenSubscription>;