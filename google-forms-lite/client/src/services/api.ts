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
  tagTypes: ['Form', 'Response'],
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
      transformResponse: (response: { forms: Form[] }) => response.forms,
      providesTags: ['Form'],
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
      transformResponse: (response: { form: Form }) => response.form,
      providesTags: (result, error, id) => [{ type: 'Form' as const, id }],
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
      transformResponse: (response: { responses: Response[] }) => response.responses,
      providesTags: (result, error, formId) => [{ type: 'Response' as const, id: formId }],
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
      transformResponse: (response: { createForm: Form }) => response.createForm,
      invalidatesTags: ['Form'],
    }),

    updateForm: builder.mutation<Form, { id: string } & FormInput>({
      query: ({ id, ...input }) => ({
        document: gql`
          mutation UpdateForm($id: ID!, $title: String!, $description: String, $questions: [QuestionInput!]) {
            updateForm(id: $id, title: $title, description: $description, questions: $questions) {
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
        variables: {
          id,
          title: input.title,
          description: input.description,
          questions: input.questions,
        },
      }),
      transformResponse: (response: { updateForm: Form }) => response.updateForm,
      invalidatesTags: ['Form'],
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
      transformResponse: (response: { submitResponse: Response }) => response.submitResponse,
      invalidatesTags: (result, error, { formId }) => [{ type: 'Response' as const, id: formId }],
    }),
  }),
})

export const {
  useGetFormsQuery,
  useGetFormQuery,
  useGetResponsesQuery,
  useCreateFormMutation,
  useUpdateFormMutation,
  useSubmitResponseMutation,
} = api
