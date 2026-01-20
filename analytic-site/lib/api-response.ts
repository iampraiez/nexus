export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
  };
}

export function errorResponse(error: string, message?: string): ApiResponse {
  return {
    success: false,
    error,
    message,
  };
}

export function createJsonResponse<T>(
  data: ApiResponse<T>,
  status: number = 200
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function createErrorResponse(error: string, status: number = 400): Response {
  return createJsonResponse(errorResponse(error), status);
}

export function createSuccessResponse<T>(
  data: T,
  status: number = 200,
  message?: string
): Response {
  return createJsonResponse(successResponse(data, message), status);
}
