import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import "./SignatureHighlight.scss";

// adjust this relative path to wherever products.js actually lives
import { PRODUCTS } from "../../../Components/data/products";

gsap.registerPlugin(ScrollTrigger);

// pos = vertical position (%) of the dot on the image
const STAGES = [
  {
    key: "top",
    name: "Top Notes",
    pos: 22,
    side: "left",
    notes: "Citrus · Bergamot",
    blurb: "Bright and immediate - the first breath of the fragrance.",
  },
  {
    key: "heart",
    name: "Heart Notes",
    pos: 50,
    side: "right",
    notes: "Jasmine · Amber",
    blurb: "Warm and floral - the soul that lingers through the day.",
  },
  {
    key: "base",
    name: "Base Notes",
    pos: 78,
    side: "left",
    notes: "Musk · Sandalwood",
    blurb: "Deep and grounding - what stays on skin long after.",
  },
];

const CYCLE_MS = 3200;

function getData(product, stage) {
  const n = product?.notes?.[stage.key];
  if (!n) return { notes: stage.notes, blurb: stage.blurb };
  if (typeof n === "string") return { notes: n, blurb: stage.blurb };
  return { notes: n.notes || stage.notes, blurb: n.blurb || stage.blurb };
}

export default function SignatureHighlight() {
  const sectionRef = useRef(null);
  const swapRef = useRef(null);
  const frameRef = useRef(null);
  const imgRef = useRef(null);
  const shimmerRef = useRef(null);
  const switching = useRef(false);
  const mounted = useRef(false);
  const px = useRef(null);
  const py = useRef(null);

  const [pIndex, setPIndex] = useState(0);
  const [hover, setHover] = useState(null);
  const [cycle, setCycle] = useState(0);

  const total = PRODUCTS.length;
  const product = PRODUCTS[pIndex];
  const src = product?.homeImage || product?.images?.[0];
  const mobileSrc = product?.mobileImages?.[0];
  const accentStyle = product?.accentColor ? { "--accent": product.accentColor } : undefined;
  const active = hover !== null ? hover : cycle;

  // ---------- first entrance (when section scrolls in) ----------
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%", once: true },
      });

      tl.fromTo(
        ".js-signature__head > *",
        { y: 20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.7, ease: "power3.out", stagger: 0.1 }
      )
        .fromTo(
          ".js-signature__switcher",
          { y: 14, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out" },
          "-=0.4"
        )
        .fromTo(
          ".js-signature__frame",
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "power4.inOut" },
          "-=0.3"
        )
        .fromTo(
          ".js-signature__dot",
          { scale: 0, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 0.5, ease: "back.out(2.2)", stagger: 0.14 },
          "-=0.3"
        )
        .fromTo(
          ".js-signature__line",
          { scaleX: 0 },
          { scaleX: 1, duration: 0.7, ease: "power3.inOut", stagger: 0.14 },
          "-=0.4"
        )
        .fromTo(
          ".js-signature__callout-body",
          { y: 14, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out", stagger: 0.14 },
          "-=0.5"
        )
        .fromTo(
          ".js-signature__nav",
          { y: 14, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out" },
          "-=0.4"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ---------- product changed → new content fades in, lines redraw ----------
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        ".js-signature__frame",
        { clipPath: "inset(0% 0% 0% 0%)", scale: 0.97 },
        { scale: 1, duration: 0.8, ease: "power3.out" },
        0
      )
        .fromTo(
          ".js-signature__dot",
          { scale: 0, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 0.45, ease: "back.out(2.2)", stagger: 0.1 },
          0.15
        )
        .fromTo(
          ".js-signature__line",
          { scaleX: 0 },
          { scaleX: 1, duration: 0.6, ease: "power3.inOut", stagger: 0.1 },
          0.3
        )
        .fromTo(
          ".js-signature__callout-body",
          { y: 12, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out", stagger: 0.1 },
          0.4
        )
        .fromTo(
          shimmerRef.current,
          { xPercent: -130, autoAlpha: 1 },
          { xPercent: 130, duration: 1.1, ease: "power2.inOut" },
          0.1
        )
        .set(shimmerRef.current, { autoAlpha: 0 });

      // swap wrapper was faded out in changeProduct — bring it back
      gsap.to(swapRef.current, { autoAlpha: 1, y: 0, duration: 0.55, ease: "power3.out" });
    }, sectionRef);

    return () => ctx.revert();
  }, [pIndex]);

  // ---------- auto-highlight: notes light up one by one ----------
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (hover !== null) return;
    const t = setInterval(() => setCycle((c) => (c + 1) % STAGES.length), CYCLE_MS);
    return () => clearInterval(t);
  }, [hover]);

  // ---------- mouse parallax on the photo (desktop only) ----------
  useEffect(() => {
    if (!imgRef.current) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    px.current = gsap.quickTo(imgRef.current, "x", { duration: 0.9, ease: "power3" });
    py.current = gsap.quickTo(imgRef.current, "y", { duration: 0.9, ease: "power3" });
  }, []);

  const handleFrameMove = (e) => {
    if (!px.current) return;
    const r = frameRef.current.getBoundingClientRect();
    px.current(((e.clientX - r.left) / r.width - 0.5) * -18);
    py.current(((e.clientY - r.top) / r.height - 0.5) * -18);
  };

  const handleFrameLeave = () => {
    px.current?.(0);
    py.current?.(0);
  };

  // ---------- switch product: fade out → swap → fade in ----------
  const changeProduct = (i) => {
    const idx = (i + total) % total;
    if (idx === pIndex || switching.current) return;
    switching.current = true;
    setHover(null);
    gsap.to(swapRef.current, {
      autoAlpha: 0,
      y: -10,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        setPIndex(idx);
        setCycle(0);
        switching.current = false;
      },
    });
  };

  const handlePrev = () => changeProduct(pIndex - 1);
  const handleNext = () => changeProduct(pIndex + 1);

  return (
    <section className="js-signature" ref={sectionRef} style={accentStyle}>
      <div className="js-signature__grain" aria-hidden="true" />

      {/* ---------- header ---------- */}
      <div className="js-signature__head">
        <span className="js-signature__eyebrow">Fragrance Anatomy</span>
        <h2 className="js-signature__title">Layer by Layer</h2>
      </div>

      {/* ---------- product tabs: always ONE line ---------- */}
      <div className="js-signature__switcher" role="tablist" aria-label="Choose fragrance">
        {PRODUCTS.map((p, i) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={i === pIndex}
            className={`js-signature__switch ${i === pIndex ? "js-signature__switch--active" : ""}`}
            onClick={() => changeProduct(i)}
            data-cursor="link"
          >
            <span className="js-signature__switch-num">{String(i + 1).padStart(2, "0")}</span>
            <span className="js-signature__switch-name">{p.name}</span>
          </button>
        ))}
      </div>

      <div className="js-signature__swap" ref={swapRef}>
        <div className="js-signature__stage">
          <span className="js-signature__ghost" aria-hidden="true">
            {String(pIndex + 1).padStart(2, "0")}
          </span>

          <div className="js-signature__frame-wrap">
            <div
              className="js-signature__frame"
              ref={frameRef}
              onMouseMove={handleFrameMove}
              onMouseLeave={handleFrameLeave}
            >
              <picture>
                {mobileSrc && <source media="(max-width: 768px)" srcSet={mobileSrc} />}
                <img ref={imgRef} src={src} alt={product?.name} draggable={false} />
              </picture>

              {STAGES.map((s, i) => (
                <span
                  key={s.key}
                  className={`js-signature__band ${active === i ? "is-active" : ""}`}
                  style={{ top: `${s.pos}%` }}
                  aria-hidden="true"
                />
              ))}

              <span className="js-signature__shimmer" ref={shimmerRef} aria-hidden="true" />
            </div>

            {STAGES.map((s, i) => (
              <span
                key={s.key}
                className={`js-signature__dot ${active === i ? "is-active" : ""}`}
                style={{ top: `${s.pos}%` }}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                aria-hidden="true"
              >
                {i + 1}
              </span>
            ))}
          </div>

          <div className="js-signature__rows">
            {STAGES.map((s, i) => {
              const d = getData(product, s);
              return (
                <div
                  key={s.key}
                  className={`js-signature__row js-signature__row--${s.side} ${active === i ? "is-active" : ""}`}
                  style={{ top: `${s.pos}%` }}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                >
                  <div className="js-signature__callout">
                    <span className="js-signature__line" aria-hidden="true" />
                    <div className="js-signature__callout-body">
                      <span className="js-signature__callout-num">0{i + 1}</span>
                      <span className="js-signature__callout-name">{s.name}</span>
                      <span className="js-signature__callout-notes">{d.notes}</span>
                      <p className="js-signature__callout-blurb">{d.blurb}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ---------- bottom: progress (left) + arrows (right) ---------- */}
      <div className="js-signature__nav">
        <div className="js-signature__progress" aria-hidden="true">
          <span className="js-signature__progress-count">
            {String(pIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <span className="js-signature__progress-track">
            <span
              className="js-signature__progress-fill"
              style={{ transform: `scaleX(${(pIndex + 1) / total})` }}
            />
          </span>
        </div>

        <div className="js-signature__arrows">
          <button
            type="button"
            className="js-signature__arrow"
            onClick={handlePrev}
            aria-label="Previous fragrance"
            data-cursor="link"
          >
            <FaArrowLeftLong />
          </button>
          <button
            type="button"
            className="js-signature__arrow"
            onClick={handleNext}
            aria-label="Next fragrance"
            data-cursor="link"
          >
            <FaArrowRightLong />
          </button>
        </div>
      </div>
    </section>
  );
}