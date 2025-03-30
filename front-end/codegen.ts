import { CodegenConfig } from '@graphql-codegen/cli';
import dotenv from 'dotenv';
import dotenvexpand from 'dotenv-expand'

const appEnv = dotenv.config();
dotenvexpand(appEnv);


const config: CodegenConfig = {
  overwrite: true,
  require: ["ts-node/register"],
  generates: {
    'src/graphql/generated/graphql-cstoken.tsx': {
      schema: `${process.env.REACT_APP_CSTOKEN_APOLLO_SERVER_URL}/graphql`,
      documents: "src/graphql/queries/cstoken/**/*.graphql",
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo'
      ]
    },
    'src/graphql/generated/graphql-ttt.tsx': {
      schema: `${process.env.REACT_APP_TTT_APOLLO_SERVER_URL}/graphql`,
      documents: "src/graphql/queries/ttt/**/*.graphql",
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo'
      ]
    },
  },
};
export default config;