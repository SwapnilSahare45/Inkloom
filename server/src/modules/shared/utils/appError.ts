export class AppError extends Error {
    public readonly statusCode: number;
    public readonly code?: string;
    public readonly isOptional: boolean;

    constructor(message: string, statusCode: number, code?: string) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOptional = true;

        // Restore correct prototype chain for Custom Errors
        Object.setPrototypeOf(this, new.target.prototype);

        // Capture stack trace excluding constructor call from the trace
        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message: string, code = 'BAD_REQUEST'): AppError {
        return new AppError(message, 400, code);
    }

    static unauthorized(
        message = 'Unauthorized access',
        code = 'UNAUTHORIZED'
    ): AppError {
        return new AppError(message, 401, code);
    }

    static forbidden(
        message = 'Forbidden resource',
        code = 'FORBIDDEN'
    ): AppError {
        return new AppError(message, 403, code);
    }

    static notFound(
        message = 'Resource not found',
        code = 'NOT_FOUND'
    ): AppError {
        return new AppError(message, 404, code);
    }

    static conflict(message: string, code = 'CONFLICT'): AppError {
        return new AppError(message, 409, code);
    }

    static internal(
        message = 'Internal server error',
        code = 'INTERNAL_SERVER_ERROR'
    ): AppError {
        return new AppError(message, 500, code);
    }
}
