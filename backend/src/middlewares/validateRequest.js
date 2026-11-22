import { apiError } from "../utils/apiError.js";

export const validateRequest = (validator) => {
    return (req, res, next) => {
        const errors = validator(req.body);

        if (!Array.isArray(errors)) {
            return next(
                new apiError(
                    500,
                    "Validator must return an array of errors"
                )
            );
        }

        if (errors.length > 0) {
            return next(
                new apiError(
                    400,
                    "Request validation failed",
                    errors
                )
            );
        }

        next();
    };
};
