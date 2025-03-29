
const errorHandler = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500
    err.message = err.message || "Uh! Something went wrong"

    res.status(err.statusCode).json({
        statusCode: err.statusCode,
        message: err.message,
        success: false
    });
}

export { errorHandler }