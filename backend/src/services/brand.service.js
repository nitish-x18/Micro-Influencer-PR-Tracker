
import * as brandModel from "../models/brand.model.js";
import { apiError } from "../utils/apiError.js";

const parseId = (value, fieldName = "ID") => {
    const id = String(value ?? "");

    if (!/^[1-9]\d*$/.test(id)) {
        throw new apiError(400, `Invalid ${fieldName}`);
    }

    return id;
};

const validateBrandData = (data, isUpdate = false) => {
    const errors = [];

    if (!data || typeof data !== "object" || Array.isArray(data)) {
        throw new apiError(400, "Invalid brand data");
    }

    if (!isUpdate || data.brand_name !== undefined) {
        if (
            typeof data.brand_name !== "string" ||
            !data.brand_name.trim()
        ) {
            errors.push("Brand name is required");
        } else if (data.brand_name.trim().length > 100) {
            errors.push("Brand name must not exceed 100 characters");
        }
    }

    for (const field of ["description", "website", "logo_url"]) {
        if (
            data[field] !== undefined &&
            data[field] !== null &&
            typeof data[field] !== "string"
        ) {
            errors.push(`${field} must be a string or null`);
        }
    }

    if (
        typeof data.description === "string" &&
        data.description.length > 500
    ) {
        errors.push("Description must not exceed 500 characters");
    }

    for (const field of ["website", "logo_url"]) {
        const value = data[field];

        if (typeof value === "string" && value.trim()) {
            if (value.length > 255) {
                errors.push(`${field} must not exceed 255 characters`);
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
    }

    if (errors.length > 0) {
        throw new apiError(400, "Invalid brand data", errors);
    }
};

const getOwnedBrand = async (brandId, userId) => {
    const id = parseId(brandId, "brand ID");

    const brand = await brandModel.getBrandByIdAndUserId(
        id,
        userId
    );

    if (!brand) {
        throw new apiError(404, "Brand not found");
    }

    return brand;
};

export const createBrand = async (userId, data) => {
    parseId(userId, "user ID");
    validateBrandData(data);

    const result = await brandModel.createBrand(
        userId,
        data.brand_name.trim(),
        data.description ?? null,
        data.website?.trim() || null,
        data.logo_url?.trim() || null
    );

    return getOwnedBrand(result.insertId, userId);
};

export const getBrands = async (userId) => {
    parseId(userId, "user ID");

    return brandModel.getBrandsByUserId(userId);
};

export const getBrandById = async (brandId, userId) => {
    return getOwnedBrand(brandId, userId);
};

export const updateBrand = async (brandId, userId, data) => {
    const existing = await getOwnedBrand(brandId, userId);

    validateBrandData(data, true);

    const brandName =
        data.brand_name === undefined
            ? existing.brand_name
            : data.brand_name.trim();

    const description =
        data.description === undefined
            ? existing.description
            : data.description;

    const website =
        data.website === undefined
            ? existing.website
            : data.website?.trim() || null;

    const logoUrl =
        data.logo_url === undefined
            ? existing.logo_url
            : data.logo_url?.trim() || null;

    await brandModel.updateBrand(
        existing.brand_id,
        userId,
        brandName,
        description,
        website,
        logoUrl
    );

    return getOwnedBrand(existing.brand_id, userId);
};

export const deleteBrand = async (brandId, userId) => {
    const brand = await getOwnedBrand(brandId, userId);

    const result = await brandModel.deleteBrand(
        brand.brand_id,
        userId
    );

    if (!result.affectedRows) {
        throw new apiError(404, "Brand not found");
    }

    return {
        brand_id: brand.brand_id
    };
};
