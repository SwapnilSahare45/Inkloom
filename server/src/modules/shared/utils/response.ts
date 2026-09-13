import type { Response } from 'express';

export interface SuccessResponse<T> {
    success: true;
    statusCode: number;
    data: T;
    message?: string;
}

export interface ErrorDetail {
    field?: string;
    message: string;
}

export interface ErrorResponse {
    success: false;
    statusCode: number;
    error: {
        code: string;
        message: string;
        details?: ErrorDetail[];
    };
}

export class ApiResponse {
    static success<T>(
        res: Response,
        data: T,
        message?: string,
        statusCode = 200
    ) {
        const payload: SuccessResponse<T> = {
            success: true,
            statusCode,
            data,
            ...(message && { message }),
        };

        return res.status(statusCode).json(payload);
    }

    static error(
        res: Response,
        message: string,
        statusCode = 500,
        code = 'INTERNAL_SERVER_ERROR',
        details?: ErrorDetail[]
    ) {
        const payload: ErrorResponse = {
            success: false,
            statusCode,
            error: {
                code,
                message,
                ...(details && { details }),
            },
        };

        return res.status(statusCode).json(payload);
    }
}
