const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const registerValidator = (body = {}) => {
    const errors = [];
    const { full_name, email, password } = body;

    if (typeof full_name !== "string" || !full_name.trim()) {
        errors.push("Full name is required");
    } else if (full_name.trim().length > 255) {
        errors.push("Full name must not exceed 255 characters");
    }

    if (typeof email !== "string" || !email.trim()) {
        errors.push("Email is required");
    } else if (!isValidEmail(email.trim())) {
        errors.push("Please provide a valid email address");
    } else if (email.trim().length > 255) {
        errors.push("Email must not exceed 255 characters");
    }

    if (typeof password !== "string" || !password) {
        errors.push("Password is required");
    } else if (password.length < 8) {
        errors.push("Password must contain at least 8 characters");
    } else if (password.length > 128) {
        errors.push("Password must not exceed 128 characters");
    }

    return errors;
};

export const loginValidator = (body = {}) => {
    const errors = [];
    const { email, password } = body;

    if (typeof email !== "string" || !email.trim()) {
        errors.push("Email is required");
    } else if (!isValidEmail(email.trim())) {
        errors.push("Please provide a valid email address");
    }

    if (typeof password !== "string" || !password) {
        errors.push("Password is required");
    }

    return errors;
};

export const forgotPasswordValidator = (body = {}) => {
    const errors = [];
    const { email } = body;

    if (typeof email !== "string" || !email.trim()) {
        errors.push("Email is required");
    } else if (!isValidEmail(email.trim())) {
        errors.push("Please provide a valid email address");
    }

    return errors;
};
