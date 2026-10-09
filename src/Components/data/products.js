// src/data/products.js
import home_classic from "../../assets/images/products/home/classic.png"
import home_banarasi from "../../assets/images/products/home/banarasi.png"
import home_kanjeevaram from "../../assets/images/products/home/kanjeevaram.png"
import home_paithani from "../../assets/images/products/home/paithani.png"
import home_patola from "../../assets/images/products/home/patola.png"
import home_pochampally from "../../assets/images/products/home/pochampally.png"

import classic1 from "../../assets/images/products/classic/classic1.png"
import classic2 from "../../assets/images/products/classic/classic2.png"
import classic3 from "../../assets/images/products/classic/classic3.png"
import classic4 from "../../assets/images/products/classic/classic4.png"

import patola1 from "../../assets/images/products/patola/patola1.png"
import patola2 from "../../assets/images/products/patola/patola2.png"
import patola3 from "../../assets/images/products/patola/patola3.png"
import patola4 from "../../assets/images/products/patola/patola4.png"

import paithani1 from "../../assets/images/products/paithani/paithani1.png"
import paithani2 from "../../assets/images/products/paithani/paithani2.png"
import paithani3 from "../../assets/images/products/paithani/paithani3.png"
import paithani4 from "../../assets/images/products/paithani/paithani4.png"

import banarasi1 from "../../assets/images/products/banarasi/banarasi1.png"
import banarasi2 from "../../assets/images/products/banarasi/banarasi2.jpg"
import banarasi3 from "../../assets/images/products/banarasi/banarasi3.png"
import banarasi4 from "../../assets/images/products/banarasi/banarasi4.png"

import kanjeevaram1 from "../../assets/images/products/kanjeevaram/kanjeevaram1.png"
import kanjeevaram2 from "../../assets/images/products/kanjeevaram/kanjeevaram2.png"
import kanjeevaram3 from "../../assets/images/products/kanjeevaram/kanjeevaram3.png"
import kanjeevaram4 from "../../assets/images/products/kanjeevaram/kanjeevaram4.png"

import pochampally1 from "../../assets/images/products/pochampally/pochampally1.png"
import pochampally2 from "../../assets/images/products/pochampally/pochampally2.png"
import pochampally3 from "../../assets/images/products/pochampally/pochampally3.png"
import pochampally4 from "../../assets/images/products/pochampally/pochampally4.png"

// Single source of truth for product data — used by both the home page
// showcase (1 image per card) and the single product page (gallery).
// Each product has its own gallery. images[0] is the hero on the
// product page, the rest go in the gallery grid / mobile slider.

const CLASSIC_GALLERY = [classic1, classic2, classic3, classic4];
const PATOLA_GALLERY = [patola1, patola2, patola3, patola4];
const KANJEEVARAM_GALLERY = [kanjeevaram1, kanjeevaram2, kanjeevaram3, kanjeevaram4];
const PAITHANI_GALLERY = [paithani1, paithani2, paithani3, paithani4];
const POCHAMPALLY_GALLERY = [pochampally1, pochampally2, pochampally3, pochampally4];
const BANARASI_GALLERY = [banarasi1, banarasi2, banarasi3, banarasi4];

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
        homeImage: home_classic,
        images: CLASSIC_GALLERY,
        description:
            "Dark amber wrapped in smoked oud - heavy, confident, built for rooms you want to be remembered in.",
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
        homeImage: home_patola,
        images: PATOLA_GALLERY,
        description:
            "Jasmine opening into soft musk - a bright, wearable floral built for daylight and everyday wear.",
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
        homeImage: home_kanjeevaram,
        images: KANJEEVARAM_GALLERY,
        description:
            "Citrus over cool cedar - sharp, clean, the kind of scent that wakes a room up.",
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
        homeImage: home_paithani,
        images: PAITHANI_GALLERY,
        description:
            "Warm vanilla settled over sandalwood - soft, close to skin, the scent equivalent of a good sweater.",
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
        homeImage: home_pochampally,
        images: POCHAMPALLY_GALLERY,
        description:
            "Bergamot and iris in balance - powdery, a little distant, built for someone hard to pin down.",
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
        homeImage: home_banarasi,
        images: BANARASI_GALLERY,
        description:
            "Warm spice over worn leather - bold, a little rough at the edges, meant for cold evenings.",
        proTip: "Pairs well with wool and heavier fabrics — the warmth reads stronger in winter.",
        howToUse: "Two sprays to the chest, reapply once after 6 hours if the evening runs long.",
        categories: ["Spice", "Leather", "Evening", "Bold"],
        featureCards: DEFAULT_FEATURE_CARDS,
    },
];

export function getProductById(id) {
    return PRODUCTS.find((p) => p.id === id);
}