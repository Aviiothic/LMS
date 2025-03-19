const errorMiddleware = (error, req, res, next)=>{
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'Something Went Wrong';

    return res.status(error.statusCode).json({
        sucess: false,
        message: error.message,
        stack: error.stack
    })
}

export default errorMiddleware;