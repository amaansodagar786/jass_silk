import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import "./Nav.scss";
import logo from "../../assets/images/logo/sfp.png";

// adjust this relative path to wherever products.js actually lives
import { PRODUCTS } from "../../Components/data/products";

const EASE = [0.22, 1, 0.36, 1];

// `darkHero` = page starts with a dark hero, so the bar uses light text until scrolled.
// Left undefined, it switches on automatically for the home page ("/") only.
export default function Nav({ darkHero }) {
    const [scrolled, setScrolled] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [collectionOpen, setCollectionOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeId, setActiveId] = useState(PRODUCTS[0]?.id);
    const closeTimer = useRef(null);

    const isDarkHero =
        darkHero ?? (typeof window !== "undefined" && window.location.pathname === "/");

    // Gold thread under the bar = page scroll progress.
    // Computed by hand (not useScroll) so it works on any framer-motion version.
    const rawProgress = useMotionValue(0);
    const progress = useSpring(rawProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

    useEffect(() => {
        let lastY = window.scrollY;

        const onScroll = () => {
            const y = window.scrollY;
            setScrolled(y > 40);

            const max = document.documentElement.scrollHeight - window.innerHeight;
            rawProgress.set(max > 0 ? Math.min(Math.max(y / max, 0), 1) : 0);

            // hide when scrolling down (after the first 200px), show when scrolling up
            const delta = y - lastY;
            if (Math.abs(delta) > 6) {
                setHidden(delta > 0 && y > 200);
                lastY = y;
            }
        };

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // lock page scroll while the mobile menu is open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [mobileOpen]);

    // Escape closes whatever is open
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") {
                setCollectionOpen(false);
                setMobileOpen(false);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    useEffect(() => () => clearTimeout(closeTimer.current), []);

    const openPanel = () => {
        clearTimeout(closeTimer.current);
        setCollectionOpen(true);
    };
    const keepPanel = () => clearTimeout(closeTimer.current);
    const scheduleClose = () => {
        clearTimeout(closeTimer.current);
        closeTimer.current = setTimeout(() => setCollectionOpen(false), 180);
    };

    const headerClass = [
        "js-nav",
        scrolled && "js-nav--solid",
        collectionOpen && "js-nav--open",
        mobileOpen && "js-nav--menu",
        // light text/logo while the bar sits transparent over the dark hero
        isDarkHero && !scrolled && !collectionOpen && !mobileOpen && "js-nav--light",
        hidden && !collectionOpen && !mobileOpen && "js-nav--hidden",
    ].filter(Boolean).join(" ");

    return (
        <>
            {/* Dims the page under the collection panel (desktop only) */}
            <AnimatePresence>
                {collectionOpen && (
                    <motion.div
                        className="js-nav__scrim"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setCollectionOpen(false)}
                        aria-hidden="true"
                    />
                )}
            </AnimatePresence>

            <header
                className={headerClass}
                onMouseEnter={keepPanel}
                onMouseLeave={scheduleClose}
                onBlur={(e) => {
                    // keyboard users tabbing out of the nav close the panel
                    if (!e.currentTarget.contains(e.relatedTarget)) setCollectionOpen(false);
                }}
            >
                <div className="js-nav__inner">
                    {/* Left: collection trigger (desktop) */}
                    <div className="js-nav__left" onMouseEnter={openPanel}>
                        <button
                            className="js-nav__collection-btn"
                            onClick={openPanel}
                            aria-expanded={collectionOpen}
                            aria-controls="collection-panel"
                            data-cursor="link"
                        >
                            COLLECTION
                        </button>
                    </div>

                    {/* Center: logo */}
                    <a href="/" className="js-nav__logo" aria-label="Jass Silk — Home" data-cursor="link">
                        <img src={logo} alt="Jass Silk" />
                    </a>

                    {/* Right: Buy Now (desktop) + hamburger (tablet / mobile) */}
                    <div className="js-nav__right">
                        <a href="#products" className="js-nav__cta" data-cursor="buy">Buy Now</a>
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

                {/* Full-width collection panel: names on the left, product image on the right */}
                <AnimatePresence>
                    {collectionOpen && (
                        <motion.div
                            id="collection-panel"
                            className="js-nav__panel"
                            initial={{ clipPath: "inset(0 0 100% 0)" }}
                            animate={{ clipPath: "inset(0 0 0% 0)" }}
                            exit={{ clipPath: "inset(0 0 100% 0)" }}
                            transition={{ duration: 0.45, ease: EASE }}
                        >
                            <div className="js-nav__panel-inner">
                                <ul className="js-nav__panel-list">
                                    {PRODUCTS.map((p, i) => (
                                        <motion.li
                                            key={p.id}
                                            initial={{ opacity: 0, y: 14 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.45, ease: EASE, delay: 0.12 + i * 0.05 }}
                                        >
                                            <a
                                                href={`/product/${p.id}`}
                                                className={`js-nav__panel-link ${activeId === p.id ? "js-nav__panel-link--active" : ""}`}
                                                data-cursor="view"
                                                onMouseEnter={() => setActiveId(p.id)}
                                                onFocus={() => setActiveId(p.id)}
                                                onClick={() => setCollectionOpen(false)}
                                            >
                                                <span className="js-nav__panel-name">{p.name}</span>
                                                {/* <span className="js-nav__panel-note">
                                                    {p.categories.slice(0, 2).join(" · ")}
                                                </span> */}
                                            </a>
                                        </motion.li>
                                    ))}
                                </ul>

                                <div className="js-nav__panel-media" aria-hidden="true">
                                    {PRODUCTS.map((p) => (
                                        <img
                                            key={p.id}
                                            src={p.homeImage}
                                            alt=""
                                            className={`js-nav__panel-img ${activeId === p.id ? "js-nav__panel-img--on" : ""}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.span className="js-nav__progress" style={{ scaleX: progress }} aria-hidden="true" />
            </header>

            {/* Mobile / tablet full-screen menu.
                data-lenis-prevent stops Lenis smooth-scroll from scrolling the page behind it. */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        className="js-nav-overlay"
                        data-lenis-prevent
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="js-nav-overlay__products">
                            {PRODUCTS.map((p, i) => (
                                <motion.a
                                    href={`/product/${p.id}`}
                                    className="js-nav-overlay__item"
                                    key={p.id}
                                    onClick={() => setMobileOpen(false)}
                                    initial={{ opacity: 0, y: 18 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, ease: EASE, delay: 0.1 + i * 0.06 }}
                                >
                                    <span className="js-nav-overlay__thumb">
                                        <img src={p.homeImage} alt={p.name} />
                                    </span>
                                    <span className="js-nav-overlay__text">
                                        <span className="js-nav-overlay__name">{p.name}</span>
                                        <span className="js-nav-overlay__note">
                                            {p.categories.slice(0, 2).join(" · ")}
                                        </span>
                                    </span>
                                </motion.a>
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