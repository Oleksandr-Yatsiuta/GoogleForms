import { createApi } from '@reduxjs/toolkit/query/react'
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query'
import { gql } from 'graphql-request'
import type { Form } from '../features/forms/form'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: graphqlRequestBaseQuery({
    url: 'http://localhost:4000/graphql',
  }),
  endpoints: (builder) => ({
    getForms: builder.query<Form[], void>({
      query: () => ({
        document: gql`
          query GetForms {
            forms {
              id
              title
              description
            }
          }
        `,
      }),
    }),
  }),
})

export const { useGetFormsQuery } = api
