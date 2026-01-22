export type ApiResponse<T = void> = {
    success: boolean;
    message: string;
    data?: T;
};
