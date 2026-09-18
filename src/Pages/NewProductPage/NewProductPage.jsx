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
    const [activeImg, setActiveImg] = useState(0);
    const [flipTip, setFlipTip] = useState(false);
    const [flipHow, setFlipHow] = useState(false);

    const activeImgRef = useRef(0);
    const wipeRef = useRef(null);
    const touchStartX = useRef(0);
    const timerRef = useRef(null);

    const discountPct = Math.round(((PRODUCT.mrp - PRODUCT.price) / PRODUCT.mrp) * 100);
    const TOTAL = PRODUCT.images.length;

    // Diagonal wipe transition for the main image (same language as the Hero slider)
    const goToImage = (newIndex) => {
        if (newIndex === activeImgRef.current) return;
        const tl = gsap.timeline();
        tl.set(wipeRef.current, { xPercent: -130 })
            .to(wipeRef.current, { xPercent: 0, duration: 0.55, ease: "power3.inOut" })
            .call(() => {
                activeImgRef.current = newIndex;
                setActiveImg(newIndex);
            })
            .to(wipeRef.current, { xPercent: 130, duration: 0.55, ease: "power3.inOut" }, "+=0.05");
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
                    <img src={PRODUCT.images[activeImg]} alt={PRODUCT.name} />
                    <div className="js-new-product__wipe" ref={wipeRef} aria-hidden="true" />

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

                    <div className="js-new-product__flips">
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
                </div>
            </section>

            {/* Spec boxes with icons */}
            <section className="js-new-product__specs">
                {PRODUCT.specs.map((spec) => (
                    <div className="js-new-product__spec-box" key={spec.label}>
                        <span className="js-new-product__spec-icon">{spec.icon}</span>
                        <span className="js-new-product__spec-label">{spec.label}</span>
                    </div>
                ))}
            </section>
        </main>
    );
}