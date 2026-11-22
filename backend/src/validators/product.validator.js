const isPositiveId = (value) => {
    if (
        !(
            typeof value === "string" ||
            typeof value === "number"
        )
    ) {
        return false;
    }

    const id = String(value);

    return /^\d+$/.test(id) && BigInt(id) > 0n;
};

const validateProductFields = (body, errors, partial = false) => {
    const allowedFields = [
        "brand_id",
        "product_name",
        "value",
        "currency"
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
        const value = body.value;

        if (
            value === undefined ||
            value === null ||
            value === "" ||
            !/^\d+(\.\d{1,2})?$/.test(String(value))
        ) {
            errors.push("Product value must be a non-negative decimal with up to 2 decimal places");
        } else {
            const numericValue = Number(value);

            if (!Number.isFinite(numericValue) || numericValue > 999999999999.99) {
                errors.push("Product value is outside the supported range");
            }
        }
    }

    if (!partial || "currency" in body) {
        if (
            typeof body.currency !== "string" ||
            !/^[A-Za-z]{3}$/.test(body.currency)
        ) {
            errors.push("Currency must be a 3-letter currency code, such as INR");
        }
    }
};

export const createProductValidator = (body = {}) => {
    const errors = [];
    validateProductFields(body, errors);
    return errors;
};

export const updateProductValidator = (body = {}) => {
    const errors = [];

    if (Object.keys(body).length === 0) {
        errors.push("Provide at least one field to update");
        return errors;
    }

    validateProductFields(body, errors, true);
    return errors;
};
