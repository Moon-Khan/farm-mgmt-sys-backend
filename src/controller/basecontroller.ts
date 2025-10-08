import { Request, Response } from "express";

// Enhanced HTTP status codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
} as const;

// Standard API response interface
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
    };
    errors?: any[];
}

// Pagination interface
export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}

export class BaseController {
    protected status = HTTP_STATUS;

    // Enhanced success response with optional pagination
    protected success<T>(
        req: Request, 
        res: Response, 
        status: number, 
        data: T, 
        message: string = "Success",
        meta?: ApiResponse<T>['meta']
    ): void {
        const response: ApiResponse<T> = {
            success: true,
            message,
            data,
            ...(meta && { meta })
        };
        res.status(status).json(response);
    }

    // Enhanced error response
    protected error(
        req: Request, 
        res: Response, 
        status: number, 
        message: string,
        errors?: any[]
    ): void {
        const response: ApiResponse = {
            success: false,
            message,
            ...(errors && { errors })
        };
        res.status(status).json(response);
    }

    // Handle service errors consistently
    protected handleServiceError(
        req: Request,
        res: Response,
        error: any,
        defaultMessage: string = "An error occurred"
    ): void {
        console.error(`Service Error in ${this.constructor.name}:`, error);
        
        if (error.name === 'ValidationError') {
            this.error(req, res, this.status.UNPROCESSABLE_ENTITY, "Validation failed", error.errors);
        } else if (error.name === 'SequelizeValidationError') {
            this.error(req, res, this.status.UNPROCESSABLE_ENTITY, "Data validation failed", error.errors);
        } else if (error.name === 'SequelizeUniqueConstraintError') {
            this.error(req, res, this.status.CONFLICT, "Resource already exists");
        } else {
            this.error(req, res, this.status.INTERNAL_SERVER_ERROR, defaultMessage);
        }
    }

    // Extract pagination parameters from request
    protected getPaginationParams(req: Request): PaginationParams {
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
        const sortBy = req.query.sortBy as string || 'id';
        const sortOrder = (req.query.sortOrder as string || 'ASC').toUpperCase() as 'ASC' | 'DESC';
        
        return { page, limit, sortBy, sortOrder };
    }

    // Calculate pagination meta
    protected calculatePaginationMeta(page: number, limit: number, total: number) {
        return {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        };
    }
}