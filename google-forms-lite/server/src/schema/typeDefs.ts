export const typeDefs = `#graphql
  enum QuestionType {
    TEXT
    MULTIPLE_CHOICE
    CHECKBOX
    DATE
  }

  type Question {
    id: ID!
    title: String!
    type: QuestionType!
    options: [String!]
    required: Boolean!
  }

  type Form {
    id: ID!
    title: String!
    description: String
    questions: [Question!]!
    createdAt: String!
  }

  type Answer {
    questionId: ID!
    value: [String!]!
  }

  type Response {
    id: ID!
    formId: ID!
    answers: [Answer!]!
    submittedAt: String!
  }

  input QuestionInput {
    title: String!
    type: QuestionType!
    options: [String!]
    required: Boolean!
  }

  input AnswerInput {
    questionId: ID!
    value: [String!]!
  }

  type Query {
    forms: [Form!]!
    form(id: ID!): Form
    responses(formId: ID!): [Response!]!
  }

  type Mutation {
    createForm(title: String!, description: String, questions: [QuestionInput!]): Form!
    submitResponse(formId: ID!, answers: [AnswerInput!]!): Response
  }
`;