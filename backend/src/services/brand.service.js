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

    if (!isUpdate || data.brand_name !== undefined) {
        if (
            typeof data.brand_name !== "string" ||
            !data.brand_name.trim()
        ) {
            errors.push("Brand name is required");
        } else if (data.brand_name.trim().length > 255) {
            errors.push("Brand name must not exceed 255 characters");
        }
    }

    for (const field of ["description", "website", "logo_url"]) {
        if (
            data[field] !== undefined &&
            data[field] !== null &&
            typeof data[field] !== "string"
        ) {
            errors.push(`${field} must be a string`);
        }
    }

    if (
        typeof data.description === "string" &&
        data.description.length > 5000
    ) {
        errors.push("Description must not exceed 5000 characters");
    }

    if (typeof data.website === "string" && data.website.trim()) {
        try {
            const url = new URL(data.website.trim());

            if (!["http:", "https:"].includes(url.protocol)) {
                errors.push("Website must use HTTP or HTTPS");
            }
        } catch {
            errors.push("Website must be a valid URL");
        }
    }

    if (
        typeof data.logo_url === "string" &&
        data.logo_url.trim()
    ) {
        try {
            const url = new URL(data.logo_url.trim());

            if (!["http:", "https:"].includes(url.protocol)) {
                errors.push("Logo URL must use HTTP or HTTPS");
            }
        } catch {
            errors.push("Logo URL must be a valid URL");
        }
    }

    if (errors.length > 0) {
        throw new apiError(400, "Invalid brand data", errors);
    }
};

const getOwnedBrand = async (brandId, userId) => {
    const id = parseId(brandId, "brand ID");
    const brand = await brandModel.getBrandById(id);

    if (!brand || String(brand.user_id) !== String(userId)) {
        throw new apiError(404, "Brand not found");
    }

    return brand;
};

// Create a brand
export const createBrand = async (userId, data) => {
    validateBrandData(data);

    const result = await brandModel.createBrand(
        userId,
        data.brand_name.trim(),
        data.description ?? null,
        data.website?.trim() || null,
        data.logo_url?.trim() || null
    );

    return brandModel.getBrandById(result.insertId);
};

// Get all brands belonging to the current user
export const getBrands = async (userId) => {
    return brandModel.getBrandsByUserId(userId);
};

// Get one brand belonging to the current user
export const getBrandById = async (brandId, userId) => {
    return getOwnedBrand(brandId, userId);
};

// Update a brand
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
        brandName,
        description,
        website,
        logoUrl
    );

    return brandModel.getBrandById(existing.brand_id);
};

// Delete a brand
export const deleteBrand = async (brandId, userId) => {
    const brand = await getOwnedBrand(brandId, userId);

    const result = await brandModel.deleteBrand(brand.brand_id);

    if (!result.affectedRows) {
        throw new apiError(404, "Brand not found");
    }

    return { brand_id: brand.brand_id };
};
