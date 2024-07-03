export default class ApiError extends Error {
  public statusCode: number;
  public isPublic: boolean;

  constructor(message, statusCode, isPublic = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isPublic = isPublic;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
