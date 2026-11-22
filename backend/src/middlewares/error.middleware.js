export const errorMiddleware = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    const statusCode =
        Number.isInteger(err.statusCode) &&
        err.statusCode >= 400 &&
        err.statusCode <= 599
            ? err.statusCode
            : 500;

    const message =
        statusCode === 500
            ? "Internal server error"
            : err.message || "Request failed";

    const response = {
        success: false,
        message
    };

    if (statusCode !== 500 && Array.isArray(err.errors) && err.errors.length > 0) {
        response.errors = err.errors;
    }

    if (process.env.NODE_ENV !== "production") {
        console.error(err);
    }

    return res.status(statusCode).json(response);
};
