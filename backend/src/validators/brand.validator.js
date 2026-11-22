export const createBrandValidator = (body = {}) => {
    const errors = [];
    const { brand_name, website, description } = body;

    if (typeof brand_name !== "string" || !brand_name.trim()) {
        errors.push("Brand name is required");
    } else if (brand_name.trim().length > 255) {
        errors.push("Brand name must not exceed 255 characters");
    }

    if (website !== undefined && website !== null && website !== "") {
        if (typeof website !== "string") {
            errors.push("Website must be a string");
        } else if (website.length > 2048) {
            errors.push("Website URL is too long");
        } else {
            try {
                const url = new URL(website);

                if (!["http:", "https:"].includes(url.protocol)) {
                    errors.push("Website must use HTTP or HTTPS");
                }
            } catch {
                errors.push("Please provide a valid website URL");
            }
        }
    }

    if (description !== undefined && description !== null) {
        if (typeof description !== "string") {
            errors.push("Description must be a string");
        } else if (description.length > 5000) {
            errors.push("Description must not exceed 5000 characters");
        }
    }

    return errors;
};

export const updateBrandValidator = (body = {}) => {
    const errors = [];

    if (Object.keys(body).length === 0) {
        errors.push("Provide at least one field to update");
    }

    const allowedFields = ["brand_name", "website", "description"];
    const unknownFields = Object.keys(body).filter(
        (key) => !allowedFields.includes(key)
    );

    if (unknownFields.length > 0) {
        errors.push(`Unsupported fields: ${unknownFields.join(", ")}`);
    }

    if ("brand_name" in body) {
        if (
            typeof body.brand_name !== "string" ||
            !body.brand_name.trim()
        ) {
            errors.push("Brand name must not be empty");
        } else if (body.brand_name.trim().length > 255) {
            errors.push("Brand name must not exceed 255 characters");
        }
    }

    if ("website" in body) {
        const value = body.website;

        if (value !== null && value !== "") {
            if (typeof value !== "string" || value.length > 2048) {
                errors.push("Website must be a valid URL string");
            } else {
                try {
                    const url = new URL(value);

                    if (!["http:", "https:"].includes(url.protocol)) {
                        errors.push("Website must use HTTP or HTTPS");
                    }
                } catch {
                    errors.push("Please provide a valid website URL");
                }
            }
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
            body.description.length > 5000
        ) {
            errors.push("Description must not exceed 5000 characters");
        }
    }

    return errors;
};
