// src/data/products.js
//
// Single source of truth for product data — used by both the home page
// showcase (1 image per card) and the single product page (6 images in
// the gallery). All images are Unsplash placeholders for now — swap
// `homeImage` / `images` for real local imports whenever photography is
// ready (same pattern ProductsShowcase.jsx already used before).

const unsplash = (id, width = 1600) =>
    `https://images.unsplash.com/${id}?w=${width}&q=80&auto=format&fit=crop`;

// shared placeholder pool — light theme only, no dark/black shots
const POOL = [
    unsplash("photo-1589493732575-11a963a7c415"), // gold bottle, floral textile
    unsplash("photo-1720967361123-9c17ec9025dc"), // bottle beside a potted plant
    unsplash("photo-1621275155732-2bff82c64fd2"), // clear glass, warm textile
    unsplash("photo-1694422789021-54bd74b39f52"), // vivid citrus tone
    unsplash("photo-1709662369957-0cbf9f8452fc"), // honey-toned pour shot
    unsplash("photo-1584841247175-4d766cefa018"), // gold accent bottle
];

// rotates the shared pool so each product's gallery starts on a
// different image — just for placeholder variety, not meaningful once
// real photography replaces this
function rotate(offset) {
    return [...POOL.slice(offset), ...POOL.slice(0, offset)];
}

// same 6 highlight cards on every product for now — edit per-product
// later if some perfumes need different claims (e.g. not vegan)
const DEFAULT_FEATURE_CARDS = [
    { icon: "clock", title: "Long Lasting", text: "8+ hours of wear on skin" },
    { icon: "leaf", title: "Vegan Formula", text: "No animal-derived ingredients" },
    { icon: "heart", title: "Cruelty Free", text: "Never tested on animals" },
    { icon: "hand", title: "Hand Blended", text: "Small-batch, made in-house" },
    { icon: "bottle", title: "Glass Bottle", text: "Recyclable, refillable design" },
    { icon: "flask", title: "Perfumer Grade", text: "Fine fragrance-grade ethanol base" },
];

export const PRODUCTS = [
    {
        id: "silk-classic",
        name: "Silk Classic",
        tagline: "Eau de Parfum · 50ml",
        currency: "₹",
        price: 3400,
        compareAtPrice: 4200,
        // teal, from the Silk Classic box packaging
        accentColor: "#1FA8A0",
        homeImage: rotate(0)[0],
        images: rotate(0),
        description:
            "Dark amber wrapped in smoked oud — heavy, confident, built for rooms you want to be remembered in.",
        proTip:
            "Layer sparingly. This one carries far, so two sprays on clothing beats four on skin.",
        howToUse:
            "Two sprays from about 15cm away. Best applied 20 minutes before stepping out.",
        categories: ["Amber", "Oud", "Evening", "Unisex"],
        featureCards: DEFAULT_FEATURE_CARDS,
    },
    {
        id: "silk-patola",
        name: "Silk Patola",
        tagline: "Eau de Parfum · 50ml",
        currency: "₹",
        price: 3200,
        compareAtPrice: 3900,
        // royal blue, from the Silk Patola box packaging
        accentColor: "#1B2A6B",
        homeImage: rotate(1)[0],
        images: rotate(1),
        description:
            "Jasmine opening into soft musk — a bright, wearable floral built for daylight and everyday wear.",
        proTip:
            "Spray on pulse points — wrists, neck, behind the ears — and let it settle before dressing.",
        howToUse:
            "Two to three sprays from about 15cm away. Reapply after 6-8 hours for a light refresh.",
        categories: ["Floral", "Musk", "Daytime", "Unisex"],
        featureCards: DEFAULT_FEATURE_CARDS,
    },
    {
        id: "silk-kanjeevaram",
        name: "Silk Kanjeevaram",
        tagline: "Eau de Parfum · 50ml",
        currency: "₹",
        price: 2900,
        compareAtPrice: null,
        // deep purple, from the Silk Kanjeevaram box packaging
        accentColor: "#4B1D6B",
        homeImage: rotate(2)[0],
        images: rotate(2),
        description:
            "Citrus over cool cedar — sharp, clean, the kind of scent that wakes a room up.",
        proTip: "Great as a first-application scent — cologne-strength, best refreshed midday.",
        howToUse: "Two sprays to the chest and one to the wrists. Reapply after 4-5 hours.",
        categories: ["Citrus", "Cedar", "Daytime", "Fresh"],
        featureCards: DEFAULT_FEATURE_CARDS,
    },
    {
        id: "silk-paithani",
        name: "Silk Paithani",
        tagline: "Eau de Parfum · 50ml",
        currency: "₹",
        price: 3600,
        compareAtPrice: 4400,
        // magenta/pink, from the Silk Paithani box packaging
        accentColor: "#C2185B",
        homeImage: rotate(3)[0],
        images: rotate(3),
        description:
            "Warm vanilla settled over sandalwood — soft, close to skin, the scent equivalent of a good sweater.",
        proTip: "Works beautifully layered under a heavier evening scent for added depth.",
        howToUse: "Two to three sprays on pulse points. Lasts 7+ hours on most skin types.",
        categories: ["Vanilla", "Sandalwood", "Evening", "Unisex"],
        featureCards: DEFAULT_FEATURE_CARDS,
    },
    {
        id: "silk-pochampally",
        name: "Silk Pochampally",
        tagline: "Eau de Parfum · 50ml",
        currency: "₹",
        price: 3100,
        compareAtPrice: 3700,
        // forest green, from the Silk Pochampally box packaging
        accentColor: "#1F4D2C",
        homeImage: rotate(4)[0],
        images: rotate(4),
        description:
            "Bergamot and iris in balance — powdery, a little distant, built for someone hard to pin down.",
        proTip: "A single spray goes further than expected — this one is deceptively strong.",
        howToUse: "One to two sprays on clothing, away from direct skin for a softer trail.",
        categories: ["Bergamot", "Iris", "Evening", "Unisex"],
        featureCards: DEFAULT_FEATURE_CARDS,
    },
    {
        id: "silk-banarasi",
        name: "Silk Banarasi",
        tagline: "Eau de Parfum · 50ml",
        currency: "₹",
        price: 3500,
        compareAtPrice: 4100,
        // deep maroon, from the Silk Banarasi box packaging
        accentColor: "#6E1220",
        homeImage: rotate(5)[0],
        images: rotate(5),
        description:
            "Warm spice over worn leather — bold, a little rough at the edges, meant for cold evenings.",
        proTip: "Pairs well with wool and heavier fabrics — the warmth reads stronger in winter.",
        howToUse: "Two sprays to the chest, reapply once after 6 hours if the evening runs long.",
        categories: ["Spice", "Leather", "Evening", "Bold"],
        featureCards: DEFAULT_FEATURE_CARDS,
    },
];

export function getProductById(id) {
    return PRODUCTS.find((p) => p.id === id);
}