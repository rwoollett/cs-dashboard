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

/** A board update of tictactoe */
export type BoardOutput = {
  __typename?: 'BoardOutput';
  board: Scalars['String']['output'];
  gameId: Scalars['Int']['output'];
};

/** Tic Tac Toes game board. The player can play as Nought(1) or Cross(2). O is empty cell. */
export type Game = {
  __typename?: 'Game';
  board: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  userId: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  boardMove: PlayerMove;
  createGame: Game;
  removeGameComplete: RemovalResult;
  serverUpdateBoard: Game;
};


export type MutationBoardMoveArgs = {
  gameId: Scalars['Int']['input'];
  moveCell: Scalars['Int']['input'];
  player: Scalars['Int']['input'];
};


export type MutationCreateGameArgs = {
  userId: Scalars['Int']['input'];
};


export type MutationRemoveGameCompleteArgs = {
  gameId: Scalars['Int']['input'];
};


export type MutationServerUpdateBoardArgs = {
  board: Scalars['String']['input'];
  gameId: Scalars['Int']['input'];
};

/** The players moves in the Tic Tac Toe board against oppenent. */
export type PlayerMove = {
  __typename?: 'PlayerMove';
  /** When found with query getPlayerMove as findFirst this is marked true. */
  allocated: Scalars['Boolean']['output'];
  game: Game;
  gameId: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  moveCell: Scalars['Int']['output'];
  player: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  getPlayerMove?: Maybe<Array<Maybe<PlayerMove>>>;
};


export type QueryGetPlayerMoveArgs = {
  nodeId: Scalars['String']['input'];
};

/** Removal result. */
export type RemovalResult = {
  __typename?: 'RemovalResult';
  message: Scalars['String']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  game_Update?: Maybe<BoardOutput>;
};


export type SubscriptionGame_UpdateArgs = {
  gameId: Scalars['Int']['input'];
};

export type CreateGameMutationVariables = Exact<{
  userId: Scalars['Int']['input'];
}>;


export type CreateGameMutation = { __typename?: 'Mutation', createGame: { __typename?: 'Game', id: number } };

export type BoardMoveMutationVariables = Exact<{
  gameId: Scalars['Int']['input'];
  player: Scalars['Int']['input'];
  moveCell: Scalars['Int']['input'];
}>;


export type BoardMoveMutation = { __typename?: 'Mutation', boardMove: { __typename?: 'PlayerMove', id: number, gameId: number, moveCell: number, allocated: boolean } };

export type GameUpdateByGameIdSubscriptionVariables = Exact<{
  gameId: Scalars['Int']['input'];
}>;


export type GameUpdateByGameIdSubscription = { __typename?: 'Subscription', game_Update?: { __typename?: 'BoardOutput', board: string, gameId: number } | null };


export const CreateGameDocument = gql`
    mutation CreateGame($userId: Int!) {
  createGame(userId: $userId) {
    id
  }
}
    `;
export type CreateGameMutationFn = Apollo.MutationFunction<CreateGameMutation, CreateGameMutationVariables>;

/**
 * __useCreateGameMutation__
 *
 * To run a mutation, you first call `useCreateGameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateGameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createGameMutation, { data, loading, error }] = useCreateGameMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useCreateGameMutation(baseOptions?: Apollo.MutationHookOptions<CreateGameMutation, CreateGameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateGameMutation, CreateGameMutationVariables>(CreateGameDocument, options);
      }
export type CreateGameMutationHookResult = ReturnType<typeof useCreateGameMutation>;
export type CreateGameMutationResult = Apollo.MutationResult<CreateGameMutation>;
export type CreateGameMutationOptions = Apollo.BaseMutationOptions<CreateGameMutation, CreateGameMutationVariables>;
export const BoardMoveDocument = gql`
    mutation BoardMove($gameId: Int!, $player: Int!, $moveCell: Int!) {
  boardMove(gameId: $gameId, player: $player, moveCell: $moveCell) {
    id
    gameId
    moveCell
    allocated
  }
}
    `;
export type BoardMoveMutationFn = Apollo.MutationFunction<BoardMoveMutation, BoardMoveMutationVariables>;

/**
 * __useBoardMoveMutation__
 *
 * To run a mutation, you first call `useBoardMoveMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBoardMoveMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [boardMoveMutation, { data, loading, error }] = useBoardMoveMutation({
 *   variables: {
 *      gameId: // value for 'gameId'
 *      player: // value for 'player'
 *      moveCell: // value for 'moveCell'
 *   },
 * });
 */
export function useBoardMoveMutation(baseOptions?: Apollo.MutationHookOptions<BoardMoveMutation, BoardMoveMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BoardMoveMutation, BoardMoveMutationVariables>(BoardMoveDocument, options);
      }
export type BoardMoveMutationHookResult = ReturnType<typeof useBoardMoveMutation>;
export type BoardMoveMutationResult = Apollo.MutationResult<BoardMoveMutation>;
export type BoardMoveMutationOptions = Apollo.BaseMutationOptions<BoardMoveMutation, BoardMoveMutationVariables>;
export const GameUpdateByGameIdDocument = gql`
    subscription GameUpdateByGameId($gameId: Int!) {
  game_Update(gameId: $gameId) {
    board
    gameId
  }
}
    `;

/**
 * __useGameUpdateByGameIdSubscription__
 *
 * To run a query within a React component, call `useGameUpdateByGameIdSubscription` and pass it any options that fit your needs.
 * When your component renders, `useGameUpdateByGameIdSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGameUpdateByGameIdSubscription({
 *   variables: {
 *      gameId: // value for 'gameId'
 *   },
 * });
 */
export function useGameUpdateByGameIdSubscription(baseOptions: Apollo.SubscriptionHookOptions<GameUpdateByGameIdSubscription, GameUpdateByGameIdSubscriptionVariables> & ({ variables: GameUpdateByGameIdSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<GameUpdateByGameIdSubscription, GameUpdateByGameIdSubscriptionVariables>(GameUpdateByGameIdDocument, options);
      }
export type GameUpdateByGameIdSubscriptionHookResult = ReturnType<typeof useGameUpdateByGameIdSubscription>;
export type GameUpdateByGameIdSubscriptionResult = Apollo.SubscriptionResult<GameUpdateByGameIdSubscription>;