import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import gsap from "gsap";
import {
    FaLightbulb, FaWandMagicSparkles, FaArrowRight,
    FaTree, FaGem, FaClock, FaMoon, FaDroplet, FaSprayCanSparkles,
    FaArrowLeft,
} from "react-icons/fa6";
import "./NewProductPage.scss";

// adjust this relative path to wherever products.js actually lives
import { getProductById } from "../../Components/data/products";

// products.js stores featureCards as { icon: "clock", title, text } —
// this page's design calls them "specs" and wants an actual react-icon +
// just a short label, so map the icon keys to the icon set already used
// here and reuse `title` as the spec label
const SPEC_ICONS = {
    clock: <FaClock />,
    leaf: <FaTree />,
    heart: <FaGem />,
    hand: <FaMoon />,
    bottle: <FaDroplet />,
    flask: <FaSprayCanSparkles />,
};

const AUTOPLAY_DELAY = 6000;
// generic placeholder shown only if every real image on the product fails
const GENERIC_FALLBACK =
    "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1400&q=80&auto=format&fit=crop";

export default function NewProductPage() {
    const { id } = useParams();
    const product = getProductById(id);

    const [flipTip, setFlipTip] = useState(false);
    const [flipHow, setFlipHow] = useState(false);
    // Track which image URLs failed to load, so we can swap to the fallback
    const [brokenImages, setBrokenImages] = useState({});
    // Which product image each of the two crossfade layers is currently showing
    const [layerIndices, setLayerIndices] = useState([0, 1]);
    // Which layer (0 or 1) is currently the visible/top one
    const [activeImg, setActiveImg] = useState(0); // drives the dots

    const activeImgRef = useRef(0);
    const topLayerRef = useRef(0); // 0 or 1 — which DOM layer is on top right now
    const layerElRefs = [useRef(null), useRef(null)];
    const isAnimatingRef = useRef(false);
    const touchStartX = useRef(0);
    const timerRef = useRef(null);

    const images = product?.images || [];
    const TOTAL = images.length;
    const discountPct =
        product?.compareAtPrice && product.price
            ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
            : null;

    const getSrc = (index) =>
        brokenImages[index] ? GENERIC_FALLBACK : images[index];

    const handleImageError = (index) => {
        setBrokenImages((prev) => (prev[index] ? prev : { ...prev, [index]: true }));
    };

    // Smooth crossfade + gentle zoom transition. Two stacked image layers:
    // the incoming image loads into the hidden layer, then fades/scales in
    // on top while the old one fades out underneath.
    const goToImage = (newIndex) => {
        if (!TOTAL || newIndex === activeImgRef.current || isAnimatingRef.current) return;
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
        if (!TOTAL) return;
        timerRef.current = setInterval(() => {
            goToImage((activeImgRef.current + 1) % TOTAL);
        }, AUTOPLAY_DELAY);
    };

    useEffect(() => {
        if (!product) return;
        // reset gallery state whenever the :id changes (navigating between products)
        activeImgRef.current = 0;
        topLayerRef.current = 0;
        setActiveImg(0);
        setLayerIndices([0, 1 % TOTAL]);
        setBrokenImages({});
        resetAutoplay();
        return () => clearInterval(timerRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product?.id]);

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

    // no matching product for this :id — simple fallback, no crash
    if (!product) {
        return (
            <main className="js-new-product js-new-product--empty">
                <p>Product not found.</p>
                <a href="/">Back to collection</a>
            </main>
        );
    }

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
                            alt={product.name}
                            loading="eager"
                            onError={() => handleImageError(layerIndices[layer])}
                        />
                    ))}

                    <div className="js-new-product__arrows">
                        <button className="js-new-product__arrow" onClick={handlePrev} aria-label="Previous image">
                            <FaArrowLeft />
                        </button>
                        <button className="js-new-product__arrow" onClick={handleNext} aria-label="Next image">
                            <FaArrowRight />
                        </button>
                    </div>

                    <div className="js-new-product__dots">
                        {images.map((img, i) => (
                            <button
                                key={img}
                                className={`js-new-product__dot ${i === activeImg ? "js-new-product__dot--active" : ""}`}
                                onClick={() => handleDot(i)}
                                aria-label={`Show image ${i + 1}`}
                            />
                        ))}
                    </div>

                    {/* Floating price + buy pill */}
                    <a href="#" className="js-new-product__buy-pill">
                        <span className="js-new-product__buy-pill-price">
                            {product.currency}{product.price.toLocaleString("en-IN")}
                            {product.compareAtPrice && (
                                <em>{product.currency}{product.compareAtPrice.toLocaleString("en-IN")}</em>
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
                        {product.categories.map((c) => (
                            <span className="js-new-product__pill" key={c}>{c}</span>
                        ))}
                    </div>

                    <h1 className="js-new-product__name">{product.name}</h1>
                    {discountPct !== null && (
                        <span className="js-new-product__save">Save {discountPct}%</span>
                    )}

                    <p className="js-new-product__desc">{product.description}</p>

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
                                    <p>{product.proTip}</p>
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
                                    <p>{product.howToUse}</p>
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
                                <p>{product.proTip}</p>
                            </div>
                        </div>
                        <div className="js-new-product__mobile-info-item">
                            <span className="js-new-product__mobile-info-icon"><FaWandMagicSparkles /></span>
                            <div>
                                <h3>How to Use</h3>
                                <p>{product.howToUse}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Spec boxes with icons — alternating background */}
            <section className="js-new-product__specs">
                {product.featureCards.map((card, i) => (
                    <div
                        className={`js-new-product__spec-box ${i % 2 === 0
                            ? "js-new-product__spec-box--a"
                            : "js-new-product__spec-box--b"
                            }`}
                        key={card.title}
                    >
                        <span className="js-new-product__spec-icon">
                            {SPEC_ICONS[card.icon] || <FaGem />}
                        </span>
                        <span className="js-new-product__spec-label">{card.title}</span>
                    </div>
                ))}
            </section>
        </main>
    );
}