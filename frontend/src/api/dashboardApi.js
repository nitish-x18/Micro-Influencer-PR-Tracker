// Temporary Dashboard API layer
// Backend ready hone ke baad yahin real API request add hogi.

export const getDashboardData = async () => {
  // Temporary mock response
  // Abhi backend available nahi hai.

  return {
    success: true,

    stats: {
      totalBrands: 12,
      totalProducts: 48,
      activeShipments: 8,
      upcomingDeadlines: 6,
    },

    recentShipments: [
      {
        id: 1,
        product: "Wireless Earbuds",
        brand: "Brand A",
        status: "SHIPPED",
        shipped: "24 Sep 2026",
        received: "—",
        type: "shipped",
        icon: "🎧",
      },
      {
        id: 2,
        product: "Skincare Kit",
        brand: "Glow Beauty",
        status: "DELIVERED",
        shipped: "22 Sep 2026",
        received: "26 Sep 2026",
        type: "delivered",
        icon: "🧴",
      },
      {
        id: 3,
        product: "Hair Serum",
        brand: "HairCare Co.",
        status: "PENDING",
        shipped: "—",
        received: "—",
        type: "pending",
        icon: "💧",
      },
    ],
    brands: [
      {
        id: 1,
        name: "Glow Beauty",
        products: 8,
        shipments: 4,
      },
      {
        id: 2,
        name: "HairCare Co.",
        products: 6,
        shipments: 3,
      },
      {
        id: 3,
        name: "Pure Skin",
        products: 5,
        shipments: 2,
      },
    ],

    upcomingDeadlines: [
      {
        id: 1,
        platform: "Instagram",
        platformIcon: "◎",
        product: "Skincare Kit",
        dueDate: "26 Sep 2026",
        status: "UPCOMING",
        type: "upcoming",
      },
      {
        id: 2,
        platform: "YouTube",
        platformIcon: "▶",
        product: "Wireless Earbuds",
        dueDate: "27 Sep 2026",
        status: "UPCOMING",
        type: "upcoming",
      },
      {
        id: 3,
        platform: "TikTok",
        platformIcon: "♪",
        product: "Hair Care Set",
        dueDate: "28 Sep 2026",
        status: "OVERDUE",
        type: "overdue",
      },
      {
        id: 4,
        platform: "Instagram",
        platformIcon: "◎",
        product: "Fitness Band",
        dueDate: "30 Sep 2026",
        status: "UPCOMING",
        type: "upcoming",
      },
      {
        id: 5,
        platform: "YouTube",
        platformIcon: "▶",
        product: "Travel Kit",
        dueDate: "03 Oct 2026",
        status: "UPCOMING",
        type: "upcoming",
      },
    ],
  };
};
