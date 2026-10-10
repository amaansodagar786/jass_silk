import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import "./HeroSection.scss";

import hero1 from "../../../assets/images/home/hero/hero.png"
import mobilehero1 from "../../../assets/images/home/hero/mobile-hero.png"

import hero2 from "../../../assets/images/home/hero/middle-hero.png"
import mobilehero2 from "../../../assets/images/home/hero/mobile-middle.png"



const desktop_hero =
    hero1;

const mobile_hero =
    mobilehero1;

const desktop_hero2 =
    hero2;

const mobile_hero2 =
    mobilehero2;

const HEADLINE_FIRST = "JASS";
const HEADLINE_REST = "SILK";

// scroll gesture reaches this fraction (0-1) before the hero "lets go"
// and hands control back to normal page scroll — NOT 100%, so the last
// bit of the gesture doesn't need to be spent just to unlock
const EXPAND_THRESHOLD = 0.85;

// ================= MIDDLE IMAGE SIZES =================
// START = size of the middle image before any scroll (default state)
// END   = size of the middle image once fully expanded
//
// >>> TO MAKE THE MOBILE DEFAULT IMAGE SMALLER OR BIGGER, CHANGE ONLY
// >>> MOBILE_START_WIDTH and MOBILE_START_HEIGHT below.
// >>> Keep the ratio about 0.66 (width / height) so the image doesn't
// >>> get cropped. Examples:
// >>>   smaller -> 240 x 363
// >>>   current -> 260 x 393
// >>>   bigger  -> 280 x 423
const MOBILE_START_WIDTH = 240;
const MOBILE_START_HEIGHT = 363;
const MOBILE_END_WIDTH = 880;
const MOBILE_END_HEIGHT = 680;

const DESKTOP_START_WIDTH = 320;
const DESKTOP_START_HEIGHT = 420;
const DESKTOP_END_WIDTH = 1500;
const DESKTOP_END_HEIGHT = 840;

export default function HeroSection() {
    const sectionRef = useRef(null);
    const touchStartYRef = useRef(0);

    const [scrollProgress, setScrollProgress] = useState(0);
    const [showContent, setShowContent] = useState(false);
    const [mediaFullyExpanded, setMediaFullyExpanded] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Lenis (smooth-scroll) runs its own virtual scroll loop and does NOT
    // reliably respect a plain wheel-event preventDefault() — it just
    // keeps scrolling the page underneath regardless, which is exactly
    // why the hero was letting the page fall straight through to the
    // next section. It has to be explicitly stopped/started via its own
    // API while this hero owns the scroll gesture.
    //
    // Lenis might not be attached to `window` yet at the exact moment
    // this component mounts — it depends on wherever Lenis is created
    // elsewhere in the app, and that can easily happen slightly *after*
    // this effect runs. That race is exactly why the lock worked
    // sometimes and not others. Retry briefly (up to ~2s) until it
    // actually shows up, then stop it immediately since the hero starts
    // collapsed.
    useEffect(() => {
        let cancelled = false;
        let attempts = 0;

        function tryStop() {
            if (cancelled) return;
            const lenis = window.lenis;
            if (lenis) {
                if (!mediaFullyExpanded) lenis.stop();
                return;
            }
            attempts += 1;
            if (attempts < 40) setTimeout(tryStop, 50);
        }
        tryStop();

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // This assumes a Lenis instance is exposed at `window.lenis` — a very
    // common setup (assigning it there right after `new Lenis()` in
    // wherever Lenis is initialized in this project, e.g. App.jsx). If
    // it's stored differently (a ref, a context, etc.), swap the
    // `window.lenis` reads below for however it's actually accessed —
    // everything else here stays the same.
    useEffect(() => {
        const lenis = window.lenis;
        if (!lenis) return;

        if (mediaFullyExpanded) {
            lenis.start();
        } else {
            lenis.stop();
        }

        return () => {
            lenis.start();
        };
    }, [mediaFullyExpanded]);

    // Scroll/touch-jacked expand — while the media hasn't reached
    // EXPAND_THRESHOLD, wheel and touch input drive `scrollProgress`
    // instead of the page actually scrolling. Once the threshold is hit,
    // normal page scroll (and Lenis) takes back over; scrolling up again
    // from the very top collapses it back.
    useEffect(() => {
        const handleWheel = (e) => {
            if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
                setMediaFullyExpanded(false);
                window.lenis?.stop();
                e.preventDefault();
            } else if (!mediaFullyExpanded) {
                // live check, every single event — doesn't matter whether
                // Lenis was ready when this component mounted or not
                window.lenis?.stop();
                e.preventDefault();
                const delta = e.deltaY * 0.0009;
                const next = Math.min(Math.max(scrollProgress + delta, 0), 1);
                setScrollProgress(next);

                if (next >= EXPAND_THRESHOLD) {
                    setMediaFullyExpanded(true);
                    setShowContent(true);
                    window.lenis?.start();
                } else if (next < EXPAND_THRESHOLD - 0.1) {
                    setShowContent(false);
                }
            }
        };

        const handleTouchStart = (e) => {
            touchStartYRef.current = e.touches[0].clientY;
        };

        const handleTouchMove = (e) => {
            if (!touchStartYRef.current) return;
            const touchY = e.touches[0].clientY;
            const deltaY = touchStartYRef.current - touchY;

            if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
                setMediaFullyExpanded(false);
                window.lenis?.stop();
                e.preventDefault();
            } else if (!mediaFullyExpanded) {
                window.lenis?.stop();
                e.preventDefault();
                const factor = deltaY < 0 ? 0.008 : 0.005;
                const next = Math.min(Math.max(scrollProgress + deltaY * factor, 0), 1);
                setScrollProgress(next);

                if (next >= EXPAND_THRESHOLD) {
                    setMediaFullyExpanded(true);
                    setShowContent(true);
                    window.lenis?.start();
                } else if (next < EXPAND_THRESHOLD - 0.1) {
                    setShowContent(false);
                }

                touchStartYRef.current = touchY;
            }
        };

        const handleTouchEnd = () => {
            touchStartYRef.current = 0;
        };

        // keep the page pinned to the top while the hero still "owns" the
        // scroll gesture, so the expand effect can't be scrolled past
        const handleScroll = () => {
            if (!mediaFullyExpanded) window.scrollTo(0, 0);
        };

        window.addEventListener("wheel", handleWheel, { passive: false });
        window.addEventListener("scroll", handleScroll);
        window.addEventListener("touchstart", handleTouchStart, { passive: false });
        window.addEventListener("touchmove", handleTouchMove, { passive: false });
        window.addEventListener("touchend", handleTouchEnd);

        return () => {
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, [scrollProgress, mediaFullyExpanded]);

    // visual growth is normalized against EXPAND_THRESHOLD, not the raw
    // 0-1 gesture value — so the media is fully expanded exactly when the
    // hero unlocks, rather than only 85% grown at that point
    const visualProgress = Math.min(scrollProgress / EXPAND_THRESHOLD, 1);

    // media box grows from its START size to its END size (separate
    // values for mobile and desktop — see the constants at the top)
    const startWidth = isMobile ? MOBILE_START_WIDTH : DESKTOP_START_WIDTH;
    const startHeight = isMobile ? MOBILE_START_HEIGHT : DESKTOP_START_HEIGHT;
    const endWidth = isMobile ? MOBILE_END_WIDTH : DESKTOP_END_WIDTH;
    const endHeight = isMobile ? MOBILE_END_HEIGHT : DESKTOP_END_HEIGHT;

    const mediaWidth = startWidth + visualProgress * (endWidth - startWidth);
    const mediaHeight = startHeight + visualProgress * (endHeight - startHeight);

    // a slight extra zoom on the image itself, on top of the box growing —
    // this is the "live/zoom" feel, not just a resizing frame
    const imgScale = 1.18 - visualProgress * 0.18;
    // the two headline words fly apart and off-screen as the media expands
    const textTranslateVw = visualProgress * (isMobile ? 55 : 42);

    return (
        <section className="js-hero-section" ref={sectionRef}>
            {/* Background layer — one static image, dims slightly as you scroll in */}
            <motion.div
                className="js-hero-section__bg"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 - visualProgress * 0.7 }}
                transition={{ duration: 0.1 }}
            >
                <picture>
                    <source media="(max-width: 768px)" srcSet={mobile_hero} />
                    <img src={desktop_hero} alt="" aria-hidden="true" />
                </picture>
                <div className="js-hero-section__bg-scrim" />
            </motion.div>

            <div className="js-hero-section__stage">
                {/* Center media — expands + zooms on scroll */}
                <div
                    className="js-hero-section__media"
                    style={{ width: `${mediaWidth}px`, height: `${mediaHeight}px` }}
                >
                    {/* scroll-driven zoom lives here */}
                    <div
                        className="js-hero-section__media-inner"
                        style={{ transform: `scale(${imgScale})` }}
                    >
                        {/* continuous slow "Ken Burns" zoom lives on the img
                            itself via CSS animation — a separate element
                            from the one JS controls above, so the two
                            transforms never fight each other and the image
                            always feels like it's gently, endlessly alive */}
                        <picture>
                            <source media="(max-width: 768px)" srcSet={mobile_hero2} />
                            <img
                                className="js-hero-section__media-img"
                                src={desktop_hero2}
                                alt="Jass Silk perfume"
                            />
                        </picture>
                    </div>
                    <motion.div
                        className="js-hero-section__media-scrim"
                        initial={{ opacity: 0.55 }}
                        animate={{ opacity: 0.55 - visualProgress * 0.4 }}
                        transition={{ duration: 0.2 }}
                    />
                </div>

                {/* Headline — the two halves part ways as the media grows */}
                <div className="js-hero-section__headline" aria-label={`${HEADLINE_FIRST} ${HEADLINE_REST}`}>
                    <span
                        className="js-hero-section__word"
                        style={{ transform: `translateX(-${textTranslateVw}vw)` }}
                    >
                        {HEADLINE_FIRST}
                    </span>
                    <span
                        className="js-hero-section__word"
                        style={{ transform: `translateX(${textTranslateVw}vw)` }}
                    >
                        {HEADLINE_REST}
                    </span>
                </div>
            </div>

            {/* Revealed once the media has fully expanded */}
            <motion.div
                className="js-hero-section__content"
                initial={{ opacity: 0 }}
                animate={{ opacity: showContent ? 1 : 0 }}
                transition={{ duration: 0.6 }}
            >
                <p className="js-hero-section__tagline">Woven from silk, worn as scent.</p>
                <a href="#products" className="js-hero-section__cta">
                    Discover the Collection
                </a>
            </motion.div>
        </section>
    );
}