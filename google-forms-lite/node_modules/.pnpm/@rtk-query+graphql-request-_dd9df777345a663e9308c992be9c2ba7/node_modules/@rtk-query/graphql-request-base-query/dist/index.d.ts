import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { DocumentNode } from 'graphql';
import { ClientError } from 'graphql-request';
import type { ErrorResponse, GraphqlRequestBaseQueryArgs } from './GraphqlBaseQueryTypes';
export declare const graphqlRequestBaseQuery: <E = ErrorResponse>(options: GraphqlRequestBaseQueryArgs<E>) => BaseQueryFn<{
    document: string | DocumentNode;
    variables?: any;
}, unknown, E, Partial<Pick<ClientError, "request" | "response">>>;
