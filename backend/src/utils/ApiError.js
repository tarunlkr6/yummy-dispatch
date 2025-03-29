class ApiError extends Error {
    constructor(statusCode, message, errors = []) {
        super(message)
        this.statusCode = statusCode
        this.success = false
        this.errors = errors

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export { ApiError }