import { useEffect, useRef, useState } from "react";
import {
    motion,
    animate,
    useInView,
    useMotionTemplate,
    useMotionValue,
    useReducedMotion,
    useSpring,
} from "framer-motion";
import {
    FaInstagram, FaPinterestP, FaXTwitter,
    FaLocationDot, FaEnvelope, FaPhone,
} from "react-icons/fa6";
import "./Footer.scss";

import logo from "../../assets/images/logo/sfp.png";

// adjust this relative path to wherever products.js actually lives
import { PRODUCTS } from "../../Components/data/products";

// Must match $preview-w / $preview-h in Footer.scss
const PREVIEW_W = 230;
const PREVIEW_H = 290;
const SPRING = { stiffness: 200, damping: 26, mass: 0.7 };

// Vertical silk thread between the collection and the info column.
// Draws itself in once when the footer scrolls into view.
function Thread() {
    return (
        <div className="js-footer__thread" aria-hidden="true">
            <svg viewBox="0 0 24 400" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="footerThreadV" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#C9A66B" stopOpacity="0" />
                        <stop offset="15%" stopColor="#C9A66B" stopOpacity="0.9" />
                        <stop offset="85%" stopColor="#E8D5C4" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#E8D5C4" stopOpacity="0.9" />
                    </linearGradient>
                </defs>
                <motion.path
                    d="M12 0 C 22 50, 2 90, 12 133 C 22 176, 2 216, 12 266 C 22 310, 2 350, 12 400"
                    fill="none"
                    stroke="url(#footerThreadV)"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 1.6, ease: "easeInOut" }}
                />
            </svg>
            {/* knots sit exactly where the path crosses the centre line (y = 133 and 266 of 400) */}
            {[33.25, 66.5].map((top, i) => (
                <motion.span
                    key={top}
                    className="js-footer__knot"
                    style={{ top: `${top}%`, x: "-50%", y: "-50%" }}
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.4, delay: 0.6 + i * 0.4 }}
                />
            ))}
        </div>
    );
}

// Horizontal thread the vertical one flows into, sitting above the wordmark.
function ThreadHorizontal() {
    return (
        <svg className="js-footer__thread-h" viewBox="0 0 1200 28" preserveAspectRatio="none" aria-hidden="true">
            <defs>
                <linearGradient id="footerThreadH" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#C9A66B" stopOpacity="0" />
                    <stop offset="12%" stopColor="#C9A66B" stopOpacity="0.9" />
                    <stop offset="88%" stopColor="#E8D5C4" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#E8D5C4" stopOpacity="0" />
                </linearGradient>
            </defs>
            <motion.path
                d="M0 14 C 100 2, 200 26, 300 14 S 500 2, 600 14 S 800 26, 900 14 S 1100 2, 1200 14"
                fill="none"
                stroke="url(#footerThreadH)"
                strokeWidth="1.4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1.8, ease: "easeInOut", delay: 0.9 }}
            />
        </svg>
    );
}

export default function Footer() {
    const reduce = useReducedMotion();
    const markRef = useRef(null);
    const [active, setActive] = useState(null); // product currently hovered

    // ── Product preview: follows the mouse with a soft spring ─────────────
    const px = useMotionValue(-1000);
    const py = useMotionValue(-1000);
    const sx = useSpring(px, SPRING);
    const sy = useSpring(py, SPRING);

    const handleFooterMove = (e) => {
        const maxX = window.innerWidth - PREVIEW_W - 16;
        const maxY = window.innerHeight - PREVIEW_H - 16;
        px.set(Math.min(e.clientX + 80, maxX));
        py.set(Math.min(Math.max(e.clientY - PREVIEW_H / 2, 16), maxY));
    };

    // ── Wordmark spotlight: gold light that follows the mouse ─────────────
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const glow = useMotionValue(0);
    // rgb values are $gold (201,166,107) and $blush (232,213,196)
    const spotlight = useMotionTemplate`radial-gradient(circle 360px at ${mx}px ${my}px, rgba(201,166,107,0.95), rgba(232,213,196,0.45) 40%, rgba(201,166,107,0) 72%)`;

    const handleMarkMove = (e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
    };

    // One intro moment: the light sweeps across the wordmark once
    const markInView = useInView(markRef, { once: true, amount: 0.6 });
    useEffect(() => {
        if (!markInView || reduce || !markRef.current) return;
        const w = markRef.current.offsetWidth;
        const h = markRef.current.offsetHeight;
        my.set(h * 0.5);
        const a = animate(mx, [-240, w + 240], { duration: 2.6, ease: "easeInOut" });
        const b = animate(glow, [0, 1, 1, 0], { duration: 2.6, times: [0, 0.15, 0.85, 1] });
        return () => {
            a.stop();
            b.stop();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [markInView]);

    return (
        <footer className="js-footer" onMouseMove={handleFooterMove}>
            <div className="js-footer__top">
                {/* Collection — big names, hover reveals the product image at the cursor */}
                <nav className="js-footer__collection" aria-label="Collection">
                    <span className="js-footer__label">The Collection</span>
                    <ul className="js-footer__products" onMouseLeave={() => setActive(null)}>
                        {PRODUCTS.map((p) => (
                            <li
                                key={p.id}
                                className={`js-footer__product ${active && active.id !== p.id ? "js-footer__product--dim" : ""}`}
                                onMouseEnter={() => setActive(p)}
                            >
                                <a
                                    href={`/product/${p.id}`}
                                    className="js-footer__product-link"
                                    data-cursor="view"
                                    onFocus={() => setActive(p)}
                                    onBlur={() => setActive(null)}
                                >
                                    <span className="js-footer__product-name">{p.name}</span>
                                    {/* <span className="js-footer__product-note">
                                        {p.categories.slice(0, 2).join(" · ")}
                                    </span> */}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <Thread />

                {/* Info */}
                <div className="js-footer__info">
                    <p className="js-footer__tagline">
                        Woven from silk, worn as scent.<br />
                        Six notes, one thread of intention.
                    </p>

                    <a href="#products" className="js-footer__cta" data-cursor="buy">Buy Now</a>

                    <ul className="js-footer__contact-list">
                        <li>
                            <FaLocationDot className="js-footer__contact-icon" />
                            <span>Alkapuri, Vadodara, Gujarat</span>
                        </li>
                        <li>
                            <FaEnvelope className="js-footer__contact-icon" />
                            <a href="mailto:hello@jassperfumes.com">info@jassperfumes.com</a>
                        </li>
                        <li>
                            <FaPhone className="js-footer__contact-icon" />
                            <a href="tel:+910000000000">+91 00000 00000</a>
                        </li>
                    </ul>

                    <div className="js-footer__socials">
                        <a href="#" aria-label="Instagram" data-cursor="link"><FaInstagram /></a>
                        <a href="#" aria-label="Pinterest" data-cursor="link"><FaPinterestP /></a>
                        <a href="#" aria-label="X" data-cursor="link"><FaXTwitter /></a>
                    </div>
                </div>
            </div>

            <ThreadHorizontal />

            {/* Giant wordmark — the logo image used as a mask, lit by a gold spotlight */}
            <motion.div
                className="js-footer__mark-wrap"
                initial={{ opacity: 0, y: reduce ? 0 : 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
                <a
                    href="/"
                    className="js-footer__mark"
                    aria-label="Jass Silk — Home"
                    data-cursor="link"
                    ref={markRef}
                    style={{ "--logo": `url("${logo}")` }}
                    onMouseMove={handleMarkMove}
                    onMouseEnter={() => animate(glow, 1, { duration: 0.3 })}
                    onMouseLeave={() => animate(glow, 0, { duration: 0.6 })}
                >
                    {/* invisible copy of the logo — only here to give the box the logo's exact shape */}
                    <img className="js-footer__mark-size" src={logo} alt="" />
                    <span className="js-footer__mark-base" aria-hidden="true" />
                    <motion.span
                        className="js-footer__mark-glow"
                        aria-hidden="true"
                        style={{ background: spotlight, opacity: glow }}
                    />
                </a>
            </motion.div>

            <div className="js-footer__bottom">
                <span className="js-footer__copy">
                    © {new Date().getFullYear()} Jass Perfumes. All rights reserved.
                </span>
                <span className="js-footer__credit">
                    Design &amp; Developed by <a href="https://techorses.com">Techorses</a>
                </span>
            </div>

            {/* Floating product image — one stack, images crossfade as you move between names */}
            <motion.div
                className="js-footer__preview"
                style={{ x: sx, y: sy }}
                animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.92 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                aria-hidden="true"
            >
                {PRODUCTS.map((p) => (
                    <img
                        key={p.id}
                        src={p.homeImage}
                        alt=""
                        className={`js-footer__preview-img ${active && active.id === p.id ? "js-footer__preview-img--on" : ""}`}
                    />
                ))}
            </motion.div>
        </footer>
    );
}