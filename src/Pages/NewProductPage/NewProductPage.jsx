import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import {
    FaLightbulb, FaWandMagicSparkles, FaArrowRight,
    FaChevronLeft, FaChevronRight,
    FaTree, FaGem, FaClock, FaMoon, FaDroplet, FaSprayCanSparkles,
} from "react-icons/fa6";
import "./NewProductPage.scss";

// Dummy data — replace with real client data later
const PRODUCT = {
    name: "Silk Noir",
    price: 2499,
    mrp: 3199,
    categories: ["Woody", "Oriental", "Evening Wear"],
    description:
        "A deep, resinous fragrance built around aged oud and warm amber. Silk Noir is bold without being loud — meant for evenings that matter.",
    proTip: "Apply on pulse points right after a shower, while skin is still slightly damp, for longer hold.",
    howToUse: "2-3 sprays on neck and wrists. Avoid rubbing — let it settle naturally into the skin.",
    buyLink: "#",
    images: [
        "https://images.unsplash.com/photo-1709662369900-130507781728?w=1400&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1709662369957-0cbf9f8452fc?w=1400&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1591892212776-a09de24dbe84?w=1400&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1585218334450-afcf929da36e?w=1400&q=80&auto=format&fit=crop",
    ],
    // Fallback shown if an image URL fails to load (broken link / network block)
    fallbackImage:
        "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1400&q=80&auto=format&fit=crop",
    specs: [
        { label: "Oud", icon: <FaTree /> },
        { label: "Amber", icon: <FaGem /> },
        { label: "8-10 Hrs", icon: <FaClock /> },
        { label: "Evening", icon: <FaMoon /> },
        { label: "100 ml", icon: <FaDroplet /> },
        { label: "EDP", icon: <FaSprayCanSparkles /> },
    ],
};

const AUTOPLAY_DELAY = 6000;

export default function NewProductPage() {
    const [flipTip, setFlipTip] = useState(false);
    const [flipHow, setFlipHow] = useState(false);
    // Track which image URLs failed to load, so we can swap to the fallback
    const [brokenImages, setBrokenImages] = useState({});
    // Which product image each of the two crossfade layers is currently showing
    const [layerIndices, setLayerIndices] = useState([0, 1 % PRODUCT.images.length]);
    // Which layer (0 or 1) is currently the visible/top one
    const [activeImg, setActiveImg] = useState(0); // drives the dots

    const activeImgRef = useRef(0);
    const topLayerRef = useRef(0); // 0 or 1 — which DOM layer is on top right now
    const layerElRefs = [useRef(null), useRef(null)];
    const isAnimatingRef = useRef(false);
    const touchStartX = useRef(0);
    const timerRef = useRef(null);

    const discountPct = Math.round(((PRODUCT.mrp - PRODUCT.price) / PRODUCT.mrp) * 100);
    const TOTAL = PRODUCT.images.length;

    const getSrc = (index) =>
        brokenImages[index] ? PRODUCT.fallbackImage : PRODUCT.images[index];

    const handleImageError = (index) => {
        setBrokenImages((prev) => (prev[index] ? prev : { ...prev, [index]: true }));
    };

    // Smooth crossfade + gentle zoom transition (replaces the old diagonal wipe).
    // Two stacked image layers: the incoming image loads into the hidden layer,
    // then fades/scales in on top while the old one fades out underneath —
    // no clip-path or hard cuts, so there's nothing left to glitch.
    const goToImage = (newIndex) => {
        if (newIndex === activeImgRef.current || isAnimatingRef.current) return;
        isAnimatingRef.current = true;

        const top = topLayerRef.current;
        const bottom = 1 - top;

        setLayerIndices((prev) => {
            const next = [...prev];
            next[bottom] = newIndex;
            return next;
        });

        const topEl = layerElRefs[top].current;
        const bottomEl = layerElRefs[bottom].current;

        // Let the new src paint in on the hidden layer first, then crossfade.
        requestAnimationFrame(() => {
            gsap.set(bottomEl, { opacity: 0, scale: 1.06, zIndex: 2 });
            gsap.set(topEl, { zIndex: 1 });

            const tl = gsap.timeline({
                onComplete: () => {
                    activeImgRef.current = newIndex;
                    setActiveImg(newIndex);
                    topLayerRef.current = bottom;
                    isAnimatingRef.current = false;
                },
            });
            tl.to(bottomEl, { opacity: 1, scale: 1, duration: 0.9, ease: "power2.out" }, 0)
              .to(topEl, { opacity: 0, duration: 0.7, ease: "power1.out" }, 0)
              .to(topEl, { scale: 1.04, duration: 0.9, ease: "power2.out" }, 0);
        });
    };

    const resetAutoplay = () => {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            goToImage((activeImgRef.current + 1) % TOTAL);
        }, AUTOPLAY_DELAY);
    };

    useEffect(() => {
        resetAutoplay();
        return () => clearInterval(timerRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handlePrev = () => {
        goToImage((activeImgRef.current - 1 + TOTAL) % TOTAL);
        resetAutoplay();
    };
    const handleNext = () => {
        goToImage((activeImgRef.current + 1) % TOTAL);
        resetAutoplay();
    };
    const handleDot = (i) => {
        goToImage(i);
        resetAutoplay();
    };

    const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
    const handleTouchEnd = (e) => {
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(delta) < 40) return;
        if (delta < 0) handleNext();
        else handlePrev();
    };

    return (
        <main className="js-new-product">
            <section className="js-new-product__hero">
                <div
                    className="js-new-product__image-wrap"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    {[0, 1].map((layer) => (
                        <img
                            key={layer}
                            ref={layerElRefs[layer]}
                            className="js-new-product__slide-img"
                            style={{
                                opacity: layer === topLayerRef.current ? 1 : 0,
                                zIndex: layer === topLayerRef.current ? 1 : 0,
                            }}
                            src={getSrc(layerIndices[layer])}
                            alt={PRODUCT.name}
                            loading="eager"
                            onError={() => handleImageError(layerIndices[layer])}
                        />
                    ))}

                    <div className="js-new-product__arrows">
                        <button className="js-new-product__arrow" onClick={handlePrev} aria-label="Previous image">
                            <FaChevronLeft />
                        </button>
                        <button className="js-new-product__arrow" onClick={handleNext} aria-label="Next image">
                            <FaChevronRight />
                        </button>
                    </div>

                    <div className="js-new-product__dots">
                        {PRODUCT.images.map((img, i) => (
                            <button
                                key={img}
                                className={`js-new-product__dot ${i === activeImg ? "js-new-product__dot--active" : ""}`}
                                onClick={() => handleDot(i)}
                                aria-label={`Show image ${i + 1}`}
                            />
                        ))}
                    </div>

                    {/* Floating price + buy pill */}
                    <a href={PRODUCT.buyLink} className="js-new-product__buy-pill">
                        <span className="js-new-product__buy-pill-price">
                            ₹{PRODUCT.price.toLocaleString("en-IN")}
                            {PRODUCT.mrp > PRODUCT.price && (
                                <em>₹{PRODUCT.mrp.toLocaleString("en-IN")}</em>
                            )}
                        </span>
                        <span className="js-new-product__buy-pill-cta">
                            Buy Now <FaArrowRight />
                        </span>
                    </a>
                </div>

                {/* Floating glass info card */}
                <div className="js-new-product__glass">
                    <div className="js-new-product__categories">
                        {PRODUCT.categories.map((c) => (
                            <span className="js-new-product__pill" key={c}>{c}</span>
                        ))}
                    </div>

                    <h1 className="js-new-product__name">{PRODUCT.name}</h1>
                    {PRODUCT.mrp > PRODUCT.price && (
                        <span className="js-new-product__save">Save {discountPct}%</span>
                    )}

                    <p className="js-new-product__desc">{PRODUCT.description}</p>

                    {/* Desktop: interactive flip cards */}
                    <div className="js-new-product__flips js-new-product__flips--desktop">
                        <button
                            className={`js-new-product__flip ${flipTip ? "js-new-product__flip--active" : ""}`}
                            onClick={() => setFlipTip((v) => !v)}
                            type="button"
                        >
                            <div className="js-new-product__flip-inner">
                                <div className="js-new-product__flip-face js-new-product__flip-front">
                                    <FaLightbulb />
                                    <span>Pro Tip</span>
                                </div>
                                <div className="js-new-product__flip-face js-new-product__flip-back">
                                    <p>{PRODUCT.proTip}</p>
                                </div>
                            </div>
                        </button>

                        <button
                            className={`js-new-product__flip ${flipHow ? "js-new-product__flip--active" : ""}`}
                            onClick={() => setFlipHow((v) => !v)}
                            type="button"
                        >
                            <div className="js-new-product__flip-inner">
                                <div className="js-new-product__flip-face js-new-product__flip-front">
                                    <FaWandMagicSparkles />
                                    <span>How to Use</span>
                                </div>
                                <div className="js-new-product__flip-face js-new-product__flip-back">
                                    <p>{PRODUCT.howToUse}</p>
                                </div>
                            </div>
                        </button>
                    </div>

                    {/* Mobile: plain visible info blocks, no tap/flip needed */}
                    <div className="js-new-product__mobile-info">
                        <div className="js-new-product__mobile-info-item">
                            <span className="js-new-product__mobile-info-icon"><FaLightbulb /></span>
                            <div>
                                <h3>Pro Tip</h3>
                                <p>{PRODUCT.proTip}</p>
                            </div>
                        </div>
                        <div className="js-new-product__mobile-info-item">
                            <span className="js-new-product__mobile-info-icon"><FaWandMagicSparkles /></span>
                            <div>
                                <h3>How to Use</h3>
                                <p>{PRODUCT.howToUse}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Spec boxes with icons — alternating background */}
            <section className="js-new-product__specs">
                {PRODUCT.specs.map((spec, i) => (
                    <div
                        className={`js-new-product__spec-box ${
                            i % 2 === 0
                                ? "js-new-product__spec-box--a"
                                : "js-new-product__spec-box--b"
                        }`}
                        key={spec.label}
                    >
                        <span className="js-new-product__spec-icon">{spec.icon}</span>
                        <span className="js-new-product__spec-label">{spec.label}</span>
                    </div>
                ))}
            </section>
        </main>
    );
}