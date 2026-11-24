
const validateBrandFields = (body, errors, partial = false) => {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        errors.push("Request body must be a valid object");
        return;
    }

    const allowedFields = [
        "brand_name",
        "description",
        "website",
        "logo_url"
    ];

    const unknownFields = Object.keys(body).filter(
        (key) => !allowedFields.includes(key)
    );

    if (unknownFields.length > 0) {
        errors.push(`Unsupported fields: ${unknownFields.join(", ")}`);
    }

    if (!partial || "brand_name" in body) {
        if (
            typeof body.brand_name !== "string" ||
            !body.brand_name.trim()
        ) {
            errors.push("Brand name is required");
        } else if (body.brand_name.trim().length > 100) {
            errors.push("Brand name must not exceed 100 characters");
        }
    }

    if ("description" in body) {
        if (
            body.description !== null &&
            typeof body.description !== "string"
        ) {
            errors.push("Description must be a string or null");
        } else if (
            typeof body.description === "string" &&
            body.description.length > 500
        ) {
            errors.push("Description must not exceed 500 characters");
        }
    }

    for (const field of ["website", "logo_url"]) {
        if (!(field in body)) continue;

        const value = body[field];

        if (value === null || value === "") continue;

        if (typeof value !== "string" || value.length > 255) {
            errors.push(`${field} must be a valid URL with maximum 255 characters`);
            continue;
        }

        try {
            const url = new URL(value.trim());

            if (!["http:", "https:"].includes(url.protocol)) {
                errors.push(`${field} must use HTTP or HTTPS`);
            }
        } catch {
            errors.push(`${field} must be a valid URL`);
        }
    }
};

export const createBrandValidator = (body = {}) => {
    const errors = [];
    validateBrandFields(body, errors);
    return errors;
};

export const updateBrandValidator = (body = {}) => {
    const errors = [];

    if (
        !body ||
        typeof body !== "object" ||
        Array.isArray(body)
    ) {
        return ["Request body must be a valid object"];
    }

    if (Object.keys(body).length === 0) {
        errors.push("Provide at least one field to update");
        return errors;
    }

    validateBrandFields(body, errors, true);

    return errors;
};
