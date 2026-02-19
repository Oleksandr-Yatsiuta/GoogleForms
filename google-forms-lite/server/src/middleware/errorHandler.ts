import type { ErrorRequestHandler } from 'express';
import { GraphQLError, type GraphQLFormattedError } from 'graphql';

export class HttpError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_SERVER_ERROR') {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export const formatGraphQLError = (
  error: GraphQLError
): GraphQLFormattedError => {
  const originalError = error.originalError;

  if (originalError instanceof HttpError) {
    return {
      message: originalError.message,
      locations: error.locations,
      path: error.path,
      extensions: {
        code: originalError.code,
        status: originalError.statusCode,
      },
    };
  }

  return {
    message: 'Internal server error',
    locations: error.locations,
    path: error.path,
    extensions: {
      code: 'INTERNAL_SERVER_ERROR',
      status: 500,
    },
  };
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (res.headersSent) {
    return;
  }

  if (error instanceof HttpError) {
    res.status(error.statusCode).json({
      error: {
        message: error.message,
        code: error.code,
      },
    });
    return;
  }

  if (error instanceof SyntaxError) {
    res.status(400).json({
      error: {
        message: 'Invalid JSON payload',
        code: 'BAD_REQUEST',
      },
    });
    return;
  }

  res.status(500).json({
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR',
    },
  });
};
