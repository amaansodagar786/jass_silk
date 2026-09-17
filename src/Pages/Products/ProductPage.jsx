import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ProductPage.scss";

gsap.registerPlugin(ScrollTrigger);

// swap every field below with real client data + real photography —
// this is all placeholder content so the layout can be reviewed as-is
const PRODUCT = {
    name: "Jass Silk",
    tagline: "Eau de Parfum · 50ml",
    currency: "₹",
    price: 3200,
    compareAtPrice: 4200,
    description:
        "A quiet kind of luxury — warm amber threaded through cool jasmine, finished with a hush of sandalwood. Built for the moment right before you walk into a room.",
    proTip:
        "Spray on pulse points — wrists, neck, behind the ears — and let it settle for a minute before you dress.",
    howToUse:
        "Two to three sprays from about 15cm away is plenty. Reapply after 6-8 hours for an evening refresh.",
    categories: ["Woody", "Evening", "Unisex", "Amber", "Long-lasting"],
    images: [
        "https://images.unsplash.com/photo-1589493732575-11a963a7c415?w=1600&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1720967361123-9c17ec9025dc?w=1600&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1621275155732-2bff82c64fd2?w=1600&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1694422789021-54bd74b39f52?w=1600&q=80&auto=format&fit=crop",
    ],
    featureCards: [
        { glyph: "8H", title: "Long Lasting", text: "8+ hours of wear on skin" },
        { glyph: "VG", title: "Vegan Formula", text: "No animal-derived ingredients" },
        { glyph: "CF", title: "Cruelty Free", text: "Never tested on animals" },
        { glyph: "HB", title: "Hand Blended", text: "Small-batch, made in-house" },
        { glyph: "GL", title: "Glass Bottle", text: "Recyclable, refillable design" },
        { glyph: "PG", title: "Perfumer Grade", text: "Fine fragrance-grade ethanol base" },
    ],
};

export default function ProductPage() {
    const rootRef = useRef(null);

    const discountPct = PRODUCT.compareAtPrice
        ? Math.round(100 - (PRODUCT.price / PRODUCT.compareAtPrice) * 100)
        : null;

    useEffect(() => {
        const ctx = gsap.context(() => {
            const reveals = gsap.utils.toArray(".js-reveal");
            reveals.forEach((el) => {
                gsap.fromTo(
                    el,
                    { autoAlpha: 0, y: 32 },
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.9,
                        ease: "power3.out",
                        scrollTrigger: { trigger: el, start: "top 85%" },
                    }
                );
            });
        }, rootRef);

        return () => ctx.revert();
    }, []);

    return (
        <main className="js-product" ref={rootRef}>
            {/* ---------- opening spread ---------- */}
            <section className="js-product__hero">
                <span className="js-product__hero-kicker">{PRODUCT.tagline}</span>

                <div className="js-product__hero-media">
                    <img src={PRODUCT.images[0]} alt={PRODUCT.name} />
                </div>

                <h1 className="js-product__hero-name">{PRODUCT.name}</h1>

                <div className="js-product__hero-buy">
                    <div className="js-product__price">
                        <span className="js-product__price-now">
                            {PRODUCT.currency}
                            {PRODUCT.price.toLocaleString("en-IN")}
                        </span>
                        {PRODUCT.compareAtPrice && (
                            <>
                                <span className="js-product__price-was">
                                    {PRODUCT.currency}
                                    {PRODUCT.compareAtPrice.toLocaleString("en-IN")}
                                </span>
                                <span className="js-product__price-save">Save {discountPct}%</span>
                            </>
                        )}
                    </div>
                    <button className="js-product__cta" type="button">
                        Buy Now
                    </button>
                </div>
            </section>

            {/* ---------- filmstrip gallery ---------- */}
            <section className="js-product__gallery js-reveal" aria-label="Product gallery">
                <div className="js-product__gallery-track">
                    {PRODUCT.images.map((src, i) => (
                        <div className="js-product__gallery-frame" key={i}>
                            <img src={src} alt={`${PRODUCT.name} — view ${i + 1}`} />
                        </div>
                    ))}
                </div>
            </section>

            {/* ---------- description, pull-quote style ---------- */}
            <section className="js-product__description js-reveal">
                <span className="js-product__description-rule" aria-hidden="true" />
                <p>{PRODUCT.description}</p>
            </section>

            {/* ---------- pro tip / how to use, offset spec-sheet ---------- */}
            <section className="js-product__usage">
                <div className="js-product__usage-block js-product__usage-block--tip js-reveal">
                    <span className="js-product__usage-label">Pro Tip</span>
                    <p>{PRODUCT.proTip}</p>
                </div>
                <div className="js-product__usage-block js-product__usage-block--how js-reveal">
                    <span className="js-product__usage-label">How to Use</span>
                    <p>{PRODUCT.howToUse}</p>
                </div>
            </section>

            {/* ---------- categories, scattered tags ---------- */}
            <section className="js-product__categories js-reveal" aria-label="Categories">
                {PRODUCT.categories.map((cat, i) => (
                    <span className="js-product__tag" key={cat} style={{ "--i": i }}>
                        {cat}
                    </span>
                ))}
            </section>

            {/* ---------- feature cards, bento strip ---------- */}
            <section className="js-product__features" aria-label="Product highlights">
                <div className="js-product__features-track">
                    {PRODUCT.featureCards.map((card, i) => (
                        <div
                            className={`js-product__feature-card js-reveal ${i % 3 === 0 ? "js-product__feature-card--tall" : ""
                                }`}
                            key={card.title}
                        >
                            <span className="js-product__feature-glyph">{card.glyph}</span>
                            <span className="js-product__feature-title">{card.title}</span>
                            <span className="js-product__feature-text">{card.text}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ---------- sticky mobile buy bar ---------- */}
            <div className="js-product__mobile-bar">
                <div className="js-product__price js-product__price--compact">
                    <span className="js-product__price-now">
                        {PRODUCT.currency}
                        {PRODUCT.price.toLocaleString("en-IN")}
                    </span>
                    {PRODUCT.compareAtPrice && (
                        <span className="js-product__price-was">
                            {PRODUCT.currency}
                            {PRODUCT.compareAtPrice.toLocaleString("en-IN")}
                        </span>
                    )}
                </div>
                <button className="js-product__cta" type="button">
                    Buy Now
                </button>
            </div>
        </main>
    );
}