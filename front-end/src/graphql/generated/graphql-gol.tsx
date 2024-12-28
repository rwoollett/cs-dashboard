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

/** A subset of rows, or the complete rows from the GOL board for one generate. */
export type BoardOutput = {
  __typename?: 'BoardOutput';
  board: Array<Array<Scalars['Int']['output']>>;
  cols: Scalars['Int']['output'];
  genId: Scalars['Int']['output'];
  rows: Scalars['Int']['output'];
};

/** The columns in the GOL board row. */
export type BoardRow = {
  __typename?: 'BoardRow';
  cols: Array<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  order: Scalars['Int']['output'];
  taskId: Scalars['Int']['output'];
};

/** The columns in the GOL board row. */
export type BoardRowResult = {
  __typename?: 'BoardRowResult';
  cols: Array<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  order: Scalars['Int']['output'];
  taskResultId: Scalars['Int']['output'];
};

/** A subset of rows, or the complete rows from the GOL board for one generate. */
export type BoardRowsInput = {
  data: Array<Array<Scalars['Int']['input']>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  postBoardByGenID: BoardOutput;
  postTask: Task;
  postTaskResult: TaskResult;
  removeTaskComplete: RemovalResult;
  signinTMRole: TaskManagerRole;
  signoutTMRole: TaskManagerRole;
};


export type MutationPostBoardByGenIdArgs = {
  board: BoardRowsInput;
  cols: Scalars['Int']['input'];
  genId: Scalars['Int']['input'];
  rows: Scalars['Int']['input'];
};


export type MutationPostTaskArgs = {
  genId: Scalars['Int']['input'];
  length: Scalars['Int']['input'];
  row: Scalars['Int']['input'];
  rows: BoardRowsInput;
};


export type MutationPostTaskResultArgs = {
  genId: Scalars['Int']['input'];
  length: Scalars['Int']['input'];
  row: Scalars['Int']['input'];
  rows: BoardRowsInput;
};


export type MutationRemoveTaskCompleteArgs = {
  genId: Scalars['Int']['input'];
};


export type MutationSigninTmRoleArgs = {
  nodeId: Scalars['String']['input'];
  nodeName: Scalars['String']['input'];
};


export type MutationSignoutTmRoleArgs = {
  nodeId: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  countTaskResultByGenID?: Maybe<Scalars['Int']['output']>;
  getNextTask?: Maybe<Task>;
  getTaskResultByGenID?: Maybe<Array<Maybe<TaskResult>>>;
};


export type QueryCountTaskResultByGenIdArgs = {
  genId: Scalars['Int']['input'];
};


export type QueryGetTaskResultByGenIdArgs = {
  genId: Scalars['Int']['input'];
};

/** Removal result. */
export type RemovalResult = {
  __typename?: 'RemovalResult';
  message: Scalars['String']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  board_Generation?: Maybe<BoardOutput>;
};

/** Task of generating new cells in a subset of rows in GOL. */
export type Task = {
  __typename?: 'Task';
  /** When found with query getNextTask as findFirst this is marked true. */
  allocated: Scalars['Boolean']['output'];
  genId: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  length: Scalars['Int']['output'];
  row: Scalars['Int']['output'];
  /** Subset of GOL rows in generation */
  rows: Array<Maybe<BoardRow>>;
};

/** Task Manager role is allocated to one client to act as task creater for GOL generations. */
export type TaskManagerRole = {
  __typename?: 'TaskManagerRole';
  granted: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
  nodeId: Scalars['String']['output'];
  nodeName: Scalars['String']['output'];
};

/** Task Result of generating new cells in a subset of rows in GOL. */
export type TaskResult = {
  __typename?: 'TaskResult';
  genId: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  length: Scalars['Int']['output'];
  row: Scalars['Int']['output'];
  /** Subset of GOL rows in generation */
  rows: Array<Maybe<BoardRowResult>>;
};

export type BoardGenerationSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type BoardGenerationSubscription = { __typename?: 'Subscription', board_Generation?: { __typename?: 'BoardOutput', genId: number, rows: number, cols: number, board: Array<Array<number>> } | null };


export const BoardGenerationDocument = gql`
    subscription BoardGeneration {
  board_Generation {
    genId
    rows
    cols
    board
  }
}
    `;

/**
 * __useBoardGenerationSubscription__
 *
 * To run a query within a React component, call `useBoardGenerationSubscription` and pass it any options that fit your needs.
 * When your component renders, `useBoardGenerationSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoardGenerationSubscription({
 *   variables: {
 *   },
 * });
 */
export function useBoardGenerationSubscription(baseOptions?: Apollo.SubscriptionHookOptions<BoardGenerationSubscription, BoardGenerationSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<BoardGenerationSubscription, BoardGenerationSubscriptionVariables>(BoardGenerationDocument, options);
      }
export type BoardGenerationSubscriptionHookResult = ReturnType<typeof useBoardGenerationSubscription>;
export type BoardGenerationSubscriptionResult = Apollo.SubscriptionResult<BoardGenerationSubscription>;