import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ProductPage.scss";

gsap.registerPlugin(ScrollTrigger);

const AUTOPLAY_MS = 4000;

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
    { icon: "clock", title: "Long Lasting", text: "8+ hours of wear on skin" },
    { icon: "leaf", title: "Vegan Formula", text: "No animal-derived ingredients" },
    { icon: "heart", title: "Cruelty Free", text: "Never tested on animals" },
    { icon: "hand", title: "Hand Blended", text: "Small-batch, made in-house" },
    { icon: "bottle", title: "Glass Bottle", text: "Recyclable, refillable design" },
    { icon: "flask", title: "Perfumer Grade", text: "Fine fragrance-grade ethanol base" },
  ],
};

// small hand-drawn icon set — no external icon library dependency
function FeatureIcon({ name }) {
  const props = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  switch (name) {
    case "clock":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3.5 2" />
        </svg>
      );
    case "leaf":
      return (
        <svg {...props}>
          <path d="M20 4c-8 0-14 6-14 14 8 0 14-6 14-14z" />
          <path d="M6 18c4-4 8-8 12-12" />
        </svg>
      );
    case "heart":
      return (
        <svg {...props}>
          <path d="M12 20s-7-4.5-9.5-9C.8 7.4 3 4 6.5 4c2 0 3.5 1.2 5.5 3.5C14 5.2 15.5 4 17.5 4 21 4 23.2 7.4 21.5 11 19 15.5 12 20 12 20z" />
        </svg>
      );
    case "hand":
      return (
        <svg {...props}>
          <path d="M8 13V5.5a1.5 1.5 0 013 0V12" />
          <path d="M11 12V4.5a1.5 1.5 0 013 0V12" />
          <path d="M14 12V6a1.5 1.5 0 013 0v9" />
          <path d="M8 13l-2-1.5a1.5 1.5 0 00-2 2.2L7 18c1.5 2 3.2 3 6 3h1c3 0 5-2 5-5v-5" />
        </svg>
      );
    case "bottle":
      return (
        <svg {...props}>
          <path d="M10 2h4" />
          <path d="M10 2v4l-3 4v9a2 2 0 002 2h6a2 2 0 002-2v-9l-3-4V2" />
        </svg>
      );
    case "flask":
      return (
        <svg {...props}>
          <path d="M9 2h6" />
          <path d="M10 2v6.5L4.5 18a2 2 0 001.7 3h11.6a2 2 0 001.7-3L14 8.5V2" />
          <path d="M7 15h10" />
        </svg>
      );
    default:
      return null;
  }
}

function ArrowIcon({ direction }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d={direction === "prev" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
    </svg>
  );
}

export default function ProductPage() {
  const rootRef = useRef(null);
  const intervalRef = useRef(null);
  const [current, setCurrent] = useState(0);
  const total = PRODUCT.images.length;

  const discountPct = PRODUCT.compareAtPrice
    ? Math.round(100 - (PRODUCT.price / PRODUCT.compareAtPrice) * 100)
    : null;

  // mobile gallery autoplay — infinite loop, every 4s
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % total);
    }, AUTOPLAY_MS);
    return () => clearInterval(intervalRef.current);
  }, [total]);

  function restartAutoplay() {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % total);
    }, AUTOPLAY_MS);
  }

  function goPrev() {
    setCurrent((c) => (c - 1 + total) % total);
    restartAutoplay();
  }

  function goNext() {
    setCurrent((c) => (c + 1) % total);
    restartAutoplay();
  }

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

      {/* ---------- gallery — bento grid on desktop, arrow slider on mobile ---------- */}
      <section className="js-product__gallery js-reveal" aria-label="Product gallery">
        <div className="js-product__gallery-viewport">
          <div
            className="js-product__gallery-track"
            style={{ "--current": current }}
          >
            {PRODUCT.images.map((src, i) => (
              <div className="js-product__gallery-frame" key={i}>
                <img src={src} alt={`${PRODUCT.name} — view ${i + 1}`} />
              </div>
            ))}
          </div>

          <button
            className="js-product__gallery-arrow js-product__gallery-arrow--prev"
            type="button"
            aria-label="Previous image"
            onClick={goPrev}
          >
            <ArrowIcon direction="prev" />
          </button>
          <button
            className="js-product__gallery-arrow js-product__gallery-arrow--next"
            type="button"
            aria-label="Next image"
            onClick={goNext}
          >
            <ArrowIcon direction="next" />
          </button>
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

      {/* ---------- categories, pill tags ---------- */}
      <section className="js-product__categories js-reveal" aria-label="Categories">
        {PRODUCT.categories.map((cat) => (
          <span className="js-product__tag" key={cat}>
            {cat}
          </span>
        ))}
      </section>

      {/* ---------- feature cards, uniform "spec sheet" grid ---------- */}
      <section className="js-product__features" aria-label="Product highlights">
        <div className="js-product__features-track">
          {PRODUCT.featureCards.map((card, i) => (
            <div className="js-product__feature-card js-reveal" key={card.title}>
              <span className="js-product__feature-index" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="js-product__feature-head">
                <span className="js-product__feature-glyph">
                  <FeatureIcon name={card.icon} />
                </span>
                <span className="js-product__feature-title">{card.title}</span>
              </div>
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