
import * as shipmentModel from "../models/shipment.model.js";
import * as deadlineModel from "../models/contentDeadline.model.js";
import * as brandModel from "../models/brand.model.js";
import * as productModel from "../models/product.model.js";

// Convert dates to YYYY-MM-DD
const getDateString = (value) => {
    if (!value) return null;

    if (typeof value === "string") {
        return value.slice(0, 10);
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

// Get today's date
const getTodayDate = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

// Check whether a deadline is completed
const isCompleted = (deadline) => {
    return (
        deadline.status === "COMPLETED" ||
        deadline.completed_at !== null
    );
};

// Get dashboard summary
export const getDashboard = async (userId) => {
    const [
        shipments,
        deadlines,
        brands,
        products,
        recentShipments
    ] = await Promise.all([
        shipmentModel.getShipmentsByUserId(userId),
        deadlineModel.getContentDeadlinesByUserId(userId),
        brandModel.getBrandsByUserId(userId),
        productModel.getProductsByUserId(userId),
        shipmentModel.getRecentShipmentsByUserId(userId, 5)
    ]);

    const today = getTodayDate();

    // Deadline calculations
    const completedDeadlines = deadlines.filter(isCompleted);

    const overdueDeadlines = deadlines.filter((deadline) => {
        if (isCompleted(deadline)) return false;

        const dueDate = getDateString(deadline.due_date);

        return dueDate !== null && dueDate < today;
    });

    const upcomingDeadlines = deadlines.filter((deadline) => {
        if (isCompleted(deadline)) return false;

        const dueDate = getDateString(deadline.due_date);

        return dueDate !== null && dueDate >= today;
    });

    // Shipment calculations
    const receivedShipments = shipments.filter(
        (shipment) => shipment.status === "RECEIVED"
    );

    const shippedShipments = shipments.filter(
        (shipment) => shipment.status === "SHIPPED"
    );

    // Product value grouped by currency
    const productValueByCurrency = {};

    products.forEach((product) => {
        const currency = String(product.currency || "INR").toUpperCase();
        const value = Number(product.value || 0);

        productValueByCurrency[currency] =
            (productValueByCurrency[currency] || 0) + value;
    });

    const currencies = Object.keys(productValueByCurrency);

    const totalProductValue =
        currencies.length === 1
            ? Number(productValueByCurrency[currencies[0]].toFixed(2))
            : null;

    const totalProductValueCurrency =
        currencies.length === 1 ? currencies[0] : null;

    // Deadlines grouped by calendar week of the month
    const deadlinesByWeek = {
        W1: 0,
        W2: 0,
        W3: 0,
        W4: 0,
        W5: 0
    };

    upcomingDeadlines.forEach((deadline) => {
        const dueDate = getDateString(deadline.due_date);

        if (!dueDate) return;

        const day = Number(dueDate.slice(8, 10));
        const week = Math.ceil(day / 7);

        deadlinesByWeek[`W${week}`]++;
    });

    // Upcoming deadlines
    const upcomingDeadlinesList = [...upcomingDeadlines]
        .sort((a, b) =>
            getDateString(a.due_date).localeCompare(
                getDateString(b.due_date)
            )
        )
        .slice(0, 5);

    // Overdue deadlines
    const overdueDeadlinesList = [...overdueDeadlines]
        .sort((a, b) =>
            getDateString(a.due_date).localeCompare(
                getDateString(b.due_date)
            )
        )
        .slice(0, 5);

    return {
        summary: {
            totalBrands: brands.length,
            totalProducts: products.length,
            totalShipments: shipments.length,

            shippedShipments: shippedShipments.length,
            receivedShipments: receivedShipments.length,
            activeShipments: shippedShipments.length,

            totalDeadlines: deadlines.length,
            upcomingDeadlines: upcomingDeadlines.length,
            overdueDeadlines: overdueDeadlines.length,
            completedDeadlines: completedDeadlines.length,

            totalProductValue,
            totalProductValueCurrency,
            productValueByCurrency,

            deadlinesByWeek
        },

        recentShipments,
        upcomingDeadlinesList,
        overdueDeadlinesList
    };
};

// Get dashboard deadline lists
export const getDashboardDeadlines = async (userId) => {
    const deadlines =
        await deadlineModel.getContentDeadlinesByUserId(userId);

    const today = getTodayDate();

    const upcoming = deadlines
        .filter((deadline) => {
            if (isCompleted(deadline)) return false;

            const dueDate = getDateString(deadline.due_date);

            return dueDate !== null && dueDate >= today;
        })
        .sort((a, b) =>
            getDateString(a.due_date).localeCompare(
                getDateString(b.due_date)
            )
        );

    const overdue = deadlines
        .filter((deadline) => {
            if (isCompleted(deadline)) return false;

            const dueDate = getDateString(deadline.due_date);

            return dueDate !== null && dueDate < today;
        })
        .sort((a, b) =>
            getDateString(a.due_date).localeCompare(
                getDateString(b.due_date)
            )
        );

    return {
        upcoming,
        overdue
    };
};