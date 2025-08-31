export interface ServiceResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: any[];
}

export interface PaginationOptions {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'ASC' | 'DESC';
}