
const MAX_PRODUCT_VALUE = 99999999.99;

const isPositiveId = (value) => {
    if (typeof value !== "string" && typeof value !== "number") {
        return false;
    }

    return /^[1-9]\d*$/.test(String(value));
};

const validateProductFields = (body, errors, partial = false) => {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        errors.push("Request body must be a valid object");
        return;
    }

    const allowedFields = [
        "brand_id",
        "product_name",
        "value",
        "currency",
        "description"
    ];

    const unknownFields = Object.keys(body).filter(
        (key) => !allowedFields.includes(key)
    );

    if (unknownFields.length > 0) {
        errors.push(`Unsupported fields: ${unknownFields.join(", ")}`);
    }

    if (!partial || "brand_id" in body) {
        if (!isPositiveId(body.brand_id)) {
            errors.push("A valid brand ID is required");
        }
    }

    if (!partial || "product_name" in body) {
        if (
            typeof body.product_name !== "string" ||
            !body.product_name.trim()
        ) {
            errors.push("Product name is required");
        } else if (body.product_name.trim().length > 255) {
            errors.push("Product name must not exceed 255 characters");
        }
    }

    if (!partial || "value" in body) {
        const value = Number(body.value);

        if (
            body.value === undefined ||
            body.value === null ||
            body.value === "" ||
            !/^\d+(\.\d{1,2})?$/.test(String(body.value)) ||
            !Number.isFinite(value) ||
            value < 0 ||
            value > MAX_PRODUCT_VALUE
        ) {
            errors.push(
                "Product value must be between 0 and 99999999.99 with up to 2 decimal places"
            );
        }
    }

    if (!partial || "currency" in body) {
        if (
            typeof body.currency !== "string" ||
            !/^[A-Za-z]{3}$/.test(body.currency.trim())
        ) {
            errors.push(
                "Currency must be a 3-letter currency code, such as INR"
            );
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
            body.description.length > 1000
        ) {
            errors.push("Description must not exceed 1000 characters");
        }
    }
};

export const createProductValidator = (body = {}) => {
    const errors = [];

    validateProductFields(body, errors);

    return errors;
};

export const updateProductValidator = (body = {}) => {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        return ["Request body must be a valid object"];
    }

    if (Object.keys(body).length === 0) {
        return ["Provide at least one field to update"];
    }

    if ("brand_id" in body) {
        return ["Brand reassignment is not supported during product update"];
    }

    const errors = [];

    validateProductFields(body, errors, true);

    return errors;
};
