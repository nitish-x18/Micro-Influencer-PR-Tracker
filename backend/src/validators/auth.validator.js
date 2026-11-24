
const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidBody = (body) => {
    return (
        body !== null &&
        typeof body === "object" &&
        !Array.isArray(body)
    );
};

export const registerValidator = (body = {}) => {
    const errors = [];

    if (!isValidBody(body)) {
        return ["Invalid request body"];
    }

    const allowedFields = ["full_name", "email", "password"];

    const unknownFields = Object.keys(body).filter(
        (key) => !allowedFields.includes(key)
    );

    if (unknownFields.length > 0) {
        errors.push(`Unsupported fields: ${unknownFields.join(", ")}`);
    }

    const { full_name, email, password } = body;

    if (typeof full_name !== "string" || !full_name.trim()) {
        errors.push("Full name is required");
    } else if (full_name.trim().length > 100) {
        errors.push("Full name must not exceed 100 characters");
    }

    if (typeof email !== "string" || !email.trim()) {
        errors.push("Email is required");
    } else if (!isValidEmail(email.trim())) {
        errors.push("Please provide a valid email address");
    } else if (email.trim().length > 150) {
        errors.push("Email must not exceed 150 characters");
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

    if (!isValidBody(body)) {
        return ["Invalid request body"];
    }

    const allowedFields = ["email", "password"];

    const unknownFields = Object.keys(body).filter(
        (key) => !allowedFields.includes(key)
    );

    if (unknownFields.length > 0) {
        errors.push(`Unsupported fields: ${unknownFields.join(", ")}`);
    }

    const { email, password } = body;

    if (typeof email !== "string" || !email.trim()) {
        errors.push("Email is required");
    } else if (!isValidEmail(email.trim())) {
        errors.push("Please provide a valid email address");
    } else if (email.trim().length > 150) {
        errors.push("Email must not exceed 150 characters");
    }

    if (typeof password !== "string" || !password) {
        errors.push("Password is required");
    }

    return errors;
};

export const forgotPasswordValidator = (body = {}) => {
    const errors = [];

    if (!isValidBody(body)) {
        return ["Invalid request body"];
    }

    const allowedFields = ["email"];

    const unknownFields = Object.keys(body).filter(
        (key) => !allowedFields.includes(key)
    );

    if (unknownFields.length > 0) {
        errors.push(`Unsupported fields: ${unknownFields.join(", ")}`);
    }

    const { email } = body;

    if (typeof email !== "string" || !email.trim()) {
        errors.push("Email is required");
    } else if (!isValidEmail(email.trim())) {
        errors.push("Please provide a valid email address");
    } else if (email.trim().length > 150) {
        errors.push("Email must not exceed 150 characters");
    }

    return errors;
};
