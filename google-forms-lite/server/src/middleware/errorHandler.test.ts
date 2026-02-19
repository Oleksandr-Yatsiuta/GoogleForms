import { describe, it, expect, vi } from 'vitest';
import { GraphQLError } from 'graphql';
import type { Request, Response, NextFunction } from 'express';
import { HttpError, errorHandler, formatGraphQLError } from './errorHandler';

// Helper to create a mock Express response object
const createMockResponse = (headersSent = false): Response => {
	const response = {
		headersSent,
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	};

	return response as unknown as Response;
};

describe('errorHandler middleware', () => {
	// -----------------------------
	// Test behavior when headers already sent
	// -----------------------------
	it('returns immediately when headers already sent', () => {
		const res = createMockResponse(true);

		errorHandler(new Error('Already handled'), {} as Request, res, vi.fn() as NextFunction);

		// Should not call status/json since headers are sent
		expect(res.status).not.toHaveBeenCalled();
		expect(res.json).not.toHaveBeenCalled();
	});

	// -----------------------------
	// Test handling of custom HttpError
	// -----------------------------
	it('returns custom HttpError response', () => {
		const res = createMockResponse();

		errorHandler(
			new HttpError('Form not found', 404, 'NOT_FOUND'),
			{} as Request,
			res,
			vi.fn() as NextFunction
		);

		// Should return correct HTTP status and JSON payload
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			error: {
				message: 'Form not found',
				code: 'NOT_FOUND',
			},
		});
	});

	// -----------------------------
	// Test handling of JSON parsing errors
	// -----------------------------
	it('returns 400 for SyntaxError', () => {
		const res = createMockResponse();

		errorHandler(new SyntaxError('Unexpected token'), {} as Request, res, vi.fn() as NextFunction);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			error: {
				message: 'Invalid JSON payload',
				code: 'BAD_REQUEST',
			},
		});
	});

	// -----------------------------
	// Test handling of unknown errors
	// -----------------------------
	it('returns 500 for unknown errors', () => {
		const res = createMockResponse();

		errorHandler(new Error('Unknown failure'), {} as Request, res, vi.fn() as NextFunction);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			error: {
				message: 'Internal server error',
				code: 'INTERNAL_SERVER_ERROR',
			},
		});
	});
});

describe('formatGraphQLError', () => {
	// -----------------------------
	// Test formatting of GraphQL errors for known HttpError
	// -----------------------------
	it('formats HttpError with custom message and extensions', () => {
		const graphQLError = new GraphQLError('Request failed', {
			path: ['createForm'],
			originalError: new HttpError('Validation failed', 422, 'VALIDATION_ERROR'),
		});

		const formatted = formatGraphQLError(graphQLError);

		expect(formatted.message).toBe('Validation failed');
		expect(formatted.path).toEqual(['createForm']);
		expect(formatted.extensions).toEqual({
			code: 'VALIDATION_ERROR',
			status: 422,
		});
	});

	// -----------------------------
	// Test formatting of GraphQL errors for unknown errors
	// -----------------------------
	it('hides details for unknown GraphQL errors', () => {
		const graphQLError = new GraphQLError('Database exploded', {
			path: ['submitResponse'],
			originalError: new Error('Low-level database error'),
		});

		const formatted = formatGraphQLError(graphQLError);

		expect(formatted.message).toBe('Internal server error');
		expect(formatted.path).toEqual(['submitResponse']);
		expect(formatted.extensions).toEqual({
			code: 'INTERNAL_SERVER_ERROR',
			status: 500,
		});
	});
});
