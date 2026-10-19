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

        if (Number.isNaN(date.getTime())) return null;

        return [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, "0"),
            String(date.getDate()).padStart(2, "0")
        ].join("-");
    };

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

    const receivedShipments = shipments.filter(
        (shipment) => shipment.status === "RECEIVED"
    );

    const shippedShipments = shipments.filter(
        (shipment) => shipment.status === "SHIPPED"
    );

    return {
        summary: {
            totalBrands: brands.length,
            totalProducts: products.length,
            totalShipments: shipments.length,
            shippedShipments: shippedShipments.length,
            receivedShipments: receivedShipments.length,
            totalDeadlines: deadlines.length,
            upcomingDeadlines: upcomingDeadlines.length,
            overdueDeadlines: overdueDeadlines.length,
            completedDeadlines: completedDeadlines.length
        },
        recentShipments: shipments.slice(0, 5),
        upcomingDeadlinesList: upcomingDeadlines
            .sort((a, b) =>
                String(a.due_date).localeCompare(String(b.due_date))
            )
            .slice(0, 5),
        overdueDeadlinesList: overdueDeadlines
            .sort((a, b) =>
                String(a.due_date).localeCompare(String(b.due_date))
            )
            .slice(0, 5)
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
        if (typeof value === "string") return value.slice(0, 10);

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) return null;

        return [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, "0"),
            String(date.getDate()).padStart(2, "0")
        ].join("-");
    };

    return {
        upcoming: deadlines.filter((deadline) => {
            if (
                deadline.status === "COMPLETED" ||
                deadline.completed_at
            ) {
                return false;
            }

            const dueDate = getDateString(deadline.due_date);

            return dueDate && dueDate >= todayString;
        }),
        overdue: deadlines.filter((deadline) => {
            if (
                deadline.status === "COMPLETED" ||
                deadline.completed_at
            ) {
                return false;
            }

            const dueDate = getDateString(deadline.due_date);

            return dueDate && dueDate < todayString;
        })
    };
};