// Error handling utilities

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function handleError(error: any) {
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      message: error.message,
    };
  }
  
  console.error('Unexpected error:', error);
  return {
    statusCode: 500,
    message: 'Internal server error',
  };
}
