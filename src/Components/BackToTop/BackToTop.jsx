import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaArrowUp } from "react-icons/fa6";
import "./BackToTop.scss";

export default function BackToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            // show after ~50% of viewport height scrolled
            setVisible(window.scrollY > window.innerHeight * 0.5);
        };
        onScroll(); // set correct state on mount (e.g. refresh mid-page)
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollToTop = (e) => {
        e.preventDefault();
        if (typeof window !== "undefined" && window.lenis) {
            window.lenis.scrollTo(0, { duration: 1.2 });
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    className="js-backtotop"
                    onClick={scrollToTop}
                    aria-label="Back to top"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                >
                    <svg className="js-backtotop__ring" viewBox="0 0 44 44" aria-hidden="true">
                        <circle cx="22" cy="22" r="20.5" />
                    </svg>
                    <FaArrowUp className="js-backtotop__icon" />
                </motion.button>
            )}
        </AnimatePresence>
    );
}