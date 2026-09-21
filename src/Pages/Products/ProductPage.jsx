import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ProductPage.scss";

// adjust this relative path to wherever products.js actually lives
import { getProductById } from "../../Components/data/products";

gsap.registerPlugin(ScrollTrigger);

const AUTOPLAY_MS = 4000;

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

// Click ripple, shared by both Buy Now buttons — reads its own ripple
// span straight off the clicked button, no per-button refs needed
function spawnRipple(e) {
  const btn = e.currentTarget;
  const ripple = btn.querySelector(".js-product__ripple");
  if (!ripple) return;
  const rect = btn.getBoundingClientRect();
  gsap.set(ripple, { left: e.clientX - rect.left, top: e.clientY - rect.top, scale: 0, opacity: 0.5 });
  gsap.to(ripple, { scale: 6, opacity: 0, duration: 0.7, ease: "power2.out" });
}

export default function ProductPage() {
  const { id } = useParams();
  const product = getProductById(id);

  const rootRef = useRef(null);
  const intervalRef = useRef(null);
  const [current, setCurrent] = useState(0);
  const total = product?.images?.length || 0;

  const frameRefs = useRef([]);
  frameRefs.current = [];
  const addFrameRef = (el) => el && frameRefs.current.push(el);
  const frameRaf = useRef(null);

  const discountPct =
    product?.compareAtPrice && product.price
      ? Math.round(100 - (product.price / product.compareAtPrice) * 100)
      : null;

  // mobile gallery autoplay — infinite loop, every 4s
  useEffect(() => {
    if (!total) return;
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

  // scroll reveals for everything below the fold (unchanged behaviour)
  useEffect(() => {
    if (!product) return;
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
  }, [product]);

  // hero entrance — plays once on mount, above the fold so it isn't scroll-triggered
  useEffect(() => {
    if (!product) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 });
      tl.fromTo(".js-product__hero-kicker", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" })
        .fromTo(
          ".js-product__hero-media",
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "power4.inOut" },
          "-=0.3"
        )
        .fromTo(".js-product__hero-name", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
        .fromTo(
          ".js-product__hero-buy > *",
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.1 },
          "-=0.4"
        );
    }, rootRef);

    return () => ctx.revert();
  }, [product]);

  // subtle mouse-tilt on whichever bento gallery frame is being hovered
  const handleFrameMove = (e, el) => {
    const rect = el.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;

    cancelAnimationFrame(frameRaf.current);
    frameRaf.current = requestAnimationFrame(() => {
      gsap.to(el.querySelector("img"), {
        rotateY: relX * 6,
        rotateX: relY * -6,
        scale: 1.06,
        duration: 0.5,
        ease: "power2.out",
        overwrite: true,
      });
    });
  };
  const handleFrameLeave = (el) => {
    cancelAnimationFrame(frameRaf.current);
    gsap.to(el.querySelector("img"), { rotateX: 0, rotateY: 0, scale: 1, duration: 0.5, ease: "power3.out", overwrite: true });
  };

  // no matching product for this :id — simple fallback, no crash
  if (!product) {
    return (
      <main className="js-product js-product--empty">
        <p>Product not found.</p>
        <a href="/">Back to collection</a>
      </main>
    );
  }

  // Each product carries its own packaging accent color (set on the
  // product data, e.g. `accentColor: "#1FA8A0"` for Silk Classic's teal
  // box). We expose it as a CSS variable here — every accent spot in the
  // SCSS reads `var(--accent, $gold)`, so anything without a color yet
  // just falls back to the site's default gold, nothing breaks.
  const accentStyle = product.accentColor ? { "--accent": product.accentColor } : undefined;

  return (
    <main className="js-product" ref={rootRef} style={accentStyle}>
      <div className="js-product__grain" aria-hidden="true" />

      {/* ---------- opening spread ---------- */}
      <section className="js-product__hero">
        <span className="js-product__hero-kicker">{product.tagline}</span>

        <div className="js-product__hero-media">
          <img src={product.images[0]} alt={product.name} />
        </div>

        <h1 className="js-product__hero-name">{product.name}</h1>

        <div className="js-product__hero-buy">
          <div className="js-product__price">
            <span className="js-product__price-now">
              {product.currency}
              {product.price.toLocaleString("en-IN")}
            </span>
            {product.compareAtPrice && (
              <>
                <span className="js-product__price-was">
                  {product.currency}
                  {product.compareAtPrice.toLocaleString("en-IN")}
                </span>
                <span className="js-product__price-save">Save {discountPct}%</span>
              </>
            )}
          </div>
          <button className="js-product__cta" type="button" data-cursor="buy" onClick={spawnRipple}>
            Buy Now
            <span className="js-product__ripple" aria-hidden="true" />
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
            {product.images.map((src, i) => (
              <div
                className="js-product__gallery-frame"
                key={i}
                ref={addFrameRef}
                data-cursor="view"
                onMouseMove={(e) => handleFrameMove(e, e.currentTarget)}
                onMouseLeave={(e) => handleFrameLeave(e.currentTarget)}
              >
                <img src={src} alt={`${product.name} — view ${i + 1}`} />
              </div>
            ))}
          </div>

          <button
            className="js-product__gallery-arrow js-product__gallery-arrow--prev"
            type="button"
            aria-label="Previous image"
            onClick={goPrev}
            data-cursor="link"
          >
            <ArrowIcon direction="prev" />
          </button>
          <button
            className="js-product__gallery-arrow js-product__gallery-arrow--next"
            type="button"
            aria-label="Next image"
            onClick={goNext}
            data-cursor="link"
          >
            <ArrowIcon direction="next" />
          </button>
        </div>
      </section>

      {/* ---------- description, pull-quote style ---------- */}
      <section className="js-product__description js-reveal">
        <span className="js-product__description-rule" aria-hidden="true" />
        <p>{product.description}</p>
      </section>

      {/* ---------- pro tip / how to use, offset spec-sheet ---------- */}
      <section className="js-product__usage">
        <div className="js-product__usage-block js-product__usage-block--tip js-reveal">
          <span className="js-product__usage-label">Pro Tip</span>
          <p>{product.proTip}</p>
        </div>
        <div className="js-product__usage-block js-product__usage-block--how js-reveal">
          <span className="js-product__usage-label">How to Use</span>
          <p>{product.howToUse}</p>
        </div>
      </section>

      {/* ---------- categories, pill tags ---------- */}
      <section className="js-product__categories js-reveal" aria-label="Categories">
        {product.categories.map((cat) => (
          <span className="js-product__tag" key={cat}>
            {cat}
          </span>
        ))}
      </section>

      {/* ---------- feature cards, uniform "spec sheet" grid ---------- */}
      <section className="js-product__features" aria-label="Product highlights">
        <div className="js-product__features-track">
          {product.featureCards.map((card, i) => (
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
            {product.currency}
            {product.price.toLocaleString("en-IN")}
          </span>
          {product.compareAtPrice && (
            <span className="js-product__price-was">
              {product.currency}
              {product.compareAtPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>
        <button className="js-product__cta" type="button" data-cursor="buy" onClick={spawnRipple}>
          Buy Now
          <span className="js-product__ripple" aria-hidden="true" />
        </button>
      </div>
    </main>
  );
}