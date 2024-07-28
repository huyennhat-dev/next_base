export interface EntityErrorPayload {
  message: string;
  errors: {
    field: string;
    message: string;
  }[];
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data?: T;
}

export interface PaginatedData<T> {
  data: T[];
  total: number;
  limit: number;
  page: number;
}

export type PaginatedResponse<T> = ApiResponse<PaginatedData<T>>;
