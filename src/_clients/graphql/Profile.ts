import { createApi } from '@reduxjs/toolkit/query/react';
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';
import { GraphQLClient } from 'graphql-request';
import { getSession } from 'next-auth/react';

const client = new GraphQLClient(process.env.NEXT_PUBLIC_GQL_PROFILE_ENDPOINT as string);

export async function ProfileBaseQuery(args: any, api: any, extraOptions: any) {
  const rawBaseQuery = graphqlRequestBaseQuery({ client });
  const result = await rawBaseQuery(args, api, extraOptions);
  return result;
}

export const api = createApi({
  baseQuery: ProfileBaseQuery,
  reducerPath: 'profile',
  endpoints: () => ({}),
  keepUnusedDataFor: 0,
});

export default client;
