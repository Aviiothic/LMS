class AppError extends Error {  // ✅ Change 'error' to 'Error'
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
  
      // Capture stack trace
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export default AppError;
  