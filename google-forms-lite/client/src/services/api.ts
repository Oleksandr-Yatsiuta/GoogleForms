import { createApi } from '@reduxjs/toolkit/query/react'
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query'
import { gql } from 'graphql-request'
import type { Form, FormInput } from '../features/forms/form'
import type { Response, AnswerInput } from '../features/responses/response'

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
              createdAt
            }
          }
        `,
      }),
    }),

    getForm: builder.query<Form, string>({
      query: (id) => ({
        document: gql`
          query GetForm($id: ID!) {
            form(id: $id) {
              id
              title
              description
              createdAt
              questions {
                id
                title
                type
                options
                required
              }
            }
          }
        `,
        variables: { id },
      }),
    }),

    getResponses: builder.query<Response[], string>({
      query: (formId) => ({
        document: gql`
          query GetResponses($formId: ID!) {
            responses(formId: $formId) {
              id
              formId
              submittedAt
              answers {
                questionId
                value
              }
            }
          }
        `,
        variables: { formId },
      }),
    }),

    createForm: builder.mutation<Form, FormInput>({
      query: (input) => ({
        document: gql`
          mutation CreateForm($title: String!, $description: String, $questions: [QuestionInput!]) {
            createForm(title: $title, description: $description, questions: $questions) {
              id
              title
              description
              createdAt
            }
          }
        `,
        variables: {
          title: input.title,
          description: input.description,
          questions: input.questions,
        },
      }),
    }),

    submitResponse: builder.mutation<Response, { formId: string; answers: AnswerInput[] }>({
      query: ({ formId, answers }) => ({
        document: gql`
          mutation SubmitResponse($formId: ID!, $answers: [AnswerInput!]!) {
            submitResponse(formId: $formId, answers: $answers) {
              id
              formId
              submittedAt
              answers {
                questionId
                value
              }
            }
          }
        `,
        variables: { formId, answers },
      }),
    }),
  }),
})

export const {
  useGetFormsQuery,
  useGetFormQuery,
  useGetResponsesQuery,
  useCreateFormMutation,
  useSubmitResponseMutation,
} = api
