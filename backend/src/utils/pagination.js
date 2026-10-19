const getPagination = (query = {}) => {
    const parsedPage = Number.parseInt(query.page, 10);
    const parsedLimit = Number.parseInt(query.limit, 10);

    const page =
        Number.isInteger(parsedPage) && parsedPage > 0
            ? parsedPage
            : 1;

    const limit =
        Number.isInteger(parsedLimit) && parsedLimit > 0
            ? Math.min(parsedLimit, 100)
            : 10;

    const offset = (page - 1) * limit;

    return {
        page,
        limit,
        offset
    };
};

const getPaginationMeta = (totalItems, page, limit) => {
    const total = Math.max(0, Number(totalItems) || 0);

    return {
        totalItems: total,
        currentPage: page,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit)
    };
};

export {
    getPagination,
    getPaginationMeta
};
