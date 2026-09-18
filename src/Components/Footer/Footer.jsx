import { motion } from "framer-motion";
import {
    FaInstagram, FaPinterestP, FaXTwitter,
    FaLocationDot, FaEnvelope, FaPhone,
} from "react-icons/fa6";
import "./Footer.scss";

import logo from "../../assets/images/logo/logo.png";

// adjust this relative path to wherever products.js actually lives
import { PRODUCTS } from "../../Components/data/products";

// Ornamental silk-thread divider — wavy ribbon path with gradient + knot marks, draws in on scroll
function ThreadDivider() {
    return (
        <svg className="js-footer__thread" viewBox="0 0 24 320" preserveAspectRatio="none" aria-hidden="true">
            <defs>
                <linearGradient id="threadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C9A66B" stopOpacity="0" />
                    <stop offset="15%" stopColor="#C9A66B" stopOpacity="0.9" />
                    <stop offset="85%" stopColor="#E8D5C4" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#E8D5C4" stopOpacity="0" />
                </linearGradient>
            </defs>
            <motion.path
                d="M12 0 C 20 40, 4 80, 12 120 C 20 160, 4 200, 12 240 C 18 270, 8 290, 12 320"
                fill="none"
                stroke="url(#threadGrad)"
                strokeWidth="1.4"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
            />
            {[70, 160, 250].map((y, i) => (
                <motion.circle
                    key={y}
                    cx="12" cy={y} r="2.5"
                    fill="#C9A66B"
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.4, delay: 0.5 + i * 0.25 }}
                />
            ))}
        </svg>
    );
}

export default function Footer() {
    return (
        <footer className="js-footer">
            <div className="js-footer__top">
                {/* Logo column */}
                <div className="js-footer__col js-footer__col--brand">
                    <a href="/" className="js-footer__logo" aria-label="Jass Silk — Home">
                        <img src={logo} alt="Jass Silk" />
                    </a>
                    <p className="js-footer__tagline">
                        Woven from silk, worn as scent.<br />
                        Six notes, one thread of intention.
                    </p>
                    <a href="#products" className="js-footer__cta">Buy Now</a>
                </div>

                <ThreadDivider />

                {/* Products column */}
                <div className="js-footer__col js-footer__col--products">
                    <span className="js-footer__heading">Collection</span>
                    <ul className="js-footer__products">
                        {PRODUCTS.map((p) => (
                            <li key={p.id} className="js-footer__product">
                                <a href={`/product-v2/${p.id}`}>
                                    <span className="js-footer__product-name">{p.name}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <ThreadDivider />

                {/* Contact column */}
                <div className="js-footer__col js-footer__col--contact">
                    <span className="js-footer__heading">Get in Touch</span>
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
                        <a href="#" aria-label="Instagram"><FaInstagram /></a>
                        <a href="#" aria-label="Pinterest"><FaPinterestP /></a>
                        <a href="#" aria-label="X"><FaXTwitter /></a>
                    </div>
                </div>
            </div>

            <div className="js-footer__bottom">
                <span className="js-footer__copy">
                    © {new Date().getFullYear()} Jass Perfumes. All rights reserved.
                </span>
                <span className="js-footer__credit">
                    Design &amp; Developed by <a href="#">Techorses</a>
                </span>
            </div>
        </footer>
    );
}