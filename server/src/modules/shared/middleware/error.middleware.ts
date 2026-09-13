import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/appError.js';
import { ApiResponse } from '../utils/response.js';

export function globalErrorHandler(
    err: Error | AppError | ZodError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Handle zod runtime validation error
    if (err instanceof ZodError) {
        const formattedErrors = err.issues.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
        }));

        return ApiResponse.error(
            res,
            'Validation Failed',
            400,
            'VALIDATION_FAILED',
            formattedErrors
        );
    }

    // Handle known operational AppErrors
    if (err instanceof AppError) {
        return ApiResponse.error(
            res,
            err.message,
            err.statusCode,
            err.code || 'OPERATIONAL_ERROR'
        );
    }

    // Handle unexpected server errors
    console.error('UNHANDLED ERROR: ', err);

    const message =
        process.env.NODE_ENV === 'development'
            ? err.message
            : 'An unexpected internal error occurred';

    return ApiResponse.error(res, message, 500, 'INTERNAL_SERVER_ERROR');
}
