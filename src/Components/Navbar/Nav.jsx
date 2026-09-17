import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Nav.scss";

// Dummy product data — replace with real data later
const PRODUCTS = [
    { id: "silk-noir", name: "Silk Noir", note: "Amber · Oud", buyLink: "#", img: null },
    { id: "silk-bloom", name: "Silk Bloom", note: "Jasmine · Musk", buyLink: "#", img: null },
    { id: "silk-dawn", name: "Silk Dawn", note: "Citrus · Cedar", buyLink: "#", img: null },
    { id: "silk-velvet", name: "Silk Velvet", note: "Vanilla · Sandalwood", buyLink: "#", img: null },
    { id: "silk-mirage", name: "Silk Mirage", note: "Bergamot · Iris", buyLink: "#", img: null },
    { id: "silk-ember", name: "Silk Ember", note: "Spice · Leather", buyLink: "#", img: null },
];

export default function Nav() {
    const [scrolled, setScrolled] = useState(false);
    const [collectionOpen, setCollectionOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const closeTimer = useRef(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [mobileOpen]);

    const openStrip = () => {
        clearTimeout(closeTimer.current);
        setCollectionOpen(true);
    };
    const scheduleClose = () => {
        closeTimer.current = setTimeout(() => setCollectionOpen(false), 150);
    };

    return (
        <>
            <header className={`js-nav ${scrolled ? "js-nav--solid" : ""}`}>
                <div className="js-nav__inner">
                    {/* Left: menu trigger (desktop = collection hover/click) */}
                    <div
                        className="js-nav__left"
                        onMouseEnter={openStrip}
                        onMouseLeave={scheduleClose}
                    >
                        <button
                            className="js-nav__collection-btn"
                            onClick={() => setCollectionOpen((v) => !v)}
                            aria-expanded={collectionOpen}
                            aria-controls="collection-strip"
                        >
                            Collection
                        </button>

                        <AnimatePresence>
                            {collectionOpen && (
                                <motion.div
                                    id="collection-strip"
                                    className="js-nav__strip"
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.25, ease: "easeOut" }}
                                    onMouseEnter={openStrip}
                                    onMouseLeave={scheduleClose}
                                >
                                    {PRODUCTS.map((p) => (
                                        <a href={`/product/${p.id}`} className="js-nav__strip-item" key={p.id}>
                                            <span className="js-nav__strip-thumb">
                                                {p.img ? <img src={p.img} alt={p.name} /> : <span className="js-nav__strip-thumb-fallback" />}
                                            </span>
                                            <span className="js-nav__strip-name">{p.name}</span>
                                            <span className="js-nav__strip-note">{p.note}</span>
                                        </a>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Center: logo */}
                    <a href="/" className="js-nav__logo">Jass Silk</a>

                    {/* Right: Buy Now CTA (desktop) + Mobile hamburger */}
                    <div className="js-nav__right">
                        <a href="#products" className="js-nav__cta">Buy Now</a>
                        <button
                            className={`js-nav__burger ${mobileOpen ? "js-nav__burger--open" : ""}`}
                            onClick={() => setMobileOpen((v) => !v)}
                            aria-label="Toggle menu"
                            aria-expanded={mobileOpen}
                        >
                            <span />
                            <span />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile / tablet full overlay menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        className="js-nav-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="js-nav-overlay__products">
                            {PRODUCTS.map((p) => (
                                <a
                                    href={`/product/${p.id}`}
                                    className="js-nav-overlay__item"
                                    key={p.id}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    <span className="js-nav-overlay__thumb">
                                        {p.img ? <img src={p.img} alt={p.name} /> : <span className="js-nav-overlay__thumb-fallback" />}
                                    </span>
                                    <span className="js-nav-overlay__text">
                                        <span className="js-nav-overlay__name">{p.name}</span>
                                        <span className="js-nav-overlay__note">{p.note}</span>
                                    </span>
                                </a>
                            ))}
                        </div>
                        <a href="#products" className="js-nav-overlay__cta" onClick={() => setMobileOpen(false)}>
                            Buy Now
                        </a>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}