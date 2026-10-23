import * as shipmentModel from "../models/shipment.model.js";
import * as deadlineModel from "../models/contentDeadline.model.js";
import * as brandModel from "../models/brand.model.js";
import * as productModel from "../models/product.model.js";

// Get dashboard summary for the logged-in user
export const getDashboard = async (userId) => {
    const [
        shipments,
        deadlines,
        brands,
        products
    ] = await Promise.all([
        shipmentModel.getShipmentsByUserId(userId),
        deadlineModel.getContentDeadlinesByUserId(userId),
        brandModel.getBrandsByUserId(userId),
        productModel.getProductsByUserId(userId)
    ]);

    const today = new Date();

    const todayString = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

    const getDateString = (value) => {
        if (!value) return null;

        if (typeof value === "string") {
            return value.slice(0, 10);
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return null;
        }

        return [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, "0"),
            String(date.getDate()).padStart(2, "0")
        ].join("-");
    };

    // -----------------------------
    // Deadline calculations
    // -----------------------------

    const completedDeadlines = deadlines.filter(
        (deadline) =>
            deadline.status === "COMPLETED" ||
            deadline.completed_at
    );

    const overdueDeadlines = deadlines.filter((deadline) => {
        if (
            deadline.status === "COMPLETED" ||
            deadline.completed_at
        ) {
            return false;
        }

        const dueDate = getDateString(deadline.due_date);

        return dueDate && dueDate < todayString;
    });

    const upcomingDeadlines = deadlines.filter((deadline) => {
        if (
            deadline.status === "COMPLETED" ||
            deadline.completed_at
        ) {
            return false;
        }

        const dueDate = getDateString(deadline.due_date);

        return dueDate && dueDate >= todayString;
    });

    // -----------------------------
    // Shipment calculations
    // -----------------------------

    const receivedShipments = shipments.filter(
        (shipment) => shipment.status === "RECEIVED"
    );

    const shippedShipments = shipments.filter(
        (shipment) => shipment.status === "SHIPPED"
    );

    // SHIPPED = currently in transit
    const activeShipments = shippedShipments.length;

    // -----------------------------
    // Product value calculation
    // -----------------------------

    const productValueByCurrency = {};

    products.forEach((product) => {
        const currency = String(product.currency || "INR").toUpperCase();
        const value = Number(product.value || 0);

        if (!productValueByCurrency[currency]) {
            productValueByCurrency[currency] = 0;
        }

        productValueByCurrency[currency] += value;
    });

    // If all products use the same currency,
    // this gives the value expected by the dashboard.
    const currencies = Object.keys(productValueByCurrency);

    const totalProductValue =
        currencies.length === 1
            ? productValueByCurrency[currencies[0]]
            : null;

    const totalProductValueCurrency =
        currencies.length === 1
            ? currencies[0]
            : null;

    // -----------------------------
    // Deadlines by week
    // -----------------------------

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

        if (day >= 1 && day <= 7) {
            deadlinesByWeek.W1++;
        } else if (day >= 8 && day <= 14) {
            deadlinesByWeek.W2++;
        } else if (day >= 15 && day <= 21) {
            deadlinesByWeek.W3++;
        } else if (day >= 22 && day <= 28) {
            deadlinesByWeek.W4++;
        } else if (day >= 29) {
            deadlinesByWeek.W5++;
        }
    });

    // -----------------------------
    // Recent shipments
    // -----------------------------

    const recentShipments = [...shipments]
        .sort((a, b) => {
            const dateA = new Date(a.shipped_at || 0).getTime();
            const dateB = new Date(b.shipped_at || 0).getTime();

            return dateB - dateA;
        })
        .slice(0, 5);

    // -----------------------------
    // Upcoming deadlines list
    // -----------------------------

    const upcomingDeadlinesList = [...upcomingDeadlines]
        .sort((a, b) =>
            String(a.due_date).localeCompare(String(b.due_date))
        )
        .slice(0, 5);

    // -----------------------------
    // Overdue deadlines list
    // -----------------------------

    const overdueDeadlinesList = [...overdueDeadlines]
        .sort((a, b) =>
            String(a.due_date).localeCompare(String(b.due_date))
        )
        .slice(0, 5);

    // -----------------------------
    // Dashboard response
    // -----------------------------

    return {
        summary: {
            totalBrands: brands.length,
            totalProducts: products.length,
            totalShipments: shipments.length,

            shippedShipments: shippedShipments.length,
            receivedShipments: receivedShipments.length,

            // Currently in transit
            activeShipments,

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

    const today = new Date();

    const todayString = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

    const getDateString = (value) => {
        if (!value) return null;

        if (typeof value === "string") {
            return value.slice(0, 10);
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return null;
        }

        return [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, "0"),
            String(date.getDate()).padStart(2, "0")
        ].join("-");
    };

    const upcoming = deadlines
        .filter((deadline) => {
            if (
                deadline.status === "COMPLETED" ||
                deadline.completed_at
            ) {
                return false;
            }

            const dueDate = getDateString(deadline.due_date);

            return dueDate && dueDate >= todayString;
        })
        .sort((a, b) =>
            String(a.due_date).localeCompare(String(b.due_date))
        );

    const overdue = deadlines
        .filter((deadline) => {
            if (
                deadline.status === "COMPLETED" ||
                deadline.completed_at
            ) {
                return false;
            }

            const dueDate = getDateString(deadline.due_date);

            return dueDate && dueDate < todayString;
        })
        .sort((a, b) =>
            String(a.due_date).localeCompare(String(b.due_date))
        );

    return {
        upcoming,
        overdue
    };
};