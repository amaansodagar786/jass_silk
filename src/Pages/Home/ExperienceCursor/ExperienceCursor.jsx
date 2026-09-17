import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./ExperienceCursor.scss";

export default function ExperienceCursor() {
    const sectionRef = useRef(null);
    const mistRef = useRef(null);
    const rafId = useRef(null);
    const [canHover, setCanHover] = useState(true);

    useEffect(() => {
        setCanHover(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
    }, []);

    useEffect(() => {
        if (!canHover) return;
        gsap.set(mistRef.current, { opacity: 0 });
    }, [canHover]);

    const handleMouseMove = (e) => {
        if (!canHover) return;
        const rect = sectionRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        cancelAnimationFrame(rafId.current);
        rafId.current = requestAnimationFrame(() => {
            gsap.to(mistRef.current, {
                x,
                y,
                opacity: 1,
                duration: 0.6,
                ease: "power3.out",
            });
        });
    };

    const handleMouseLeave = () => {
        cancelAnimationFrame(rafId.current);
        gsap.to(mistRef.current, { opacity: 0, duration: 0.5, ease: "power2.out" });
    };

    return (
        <section
            className="js-exp-cursor"
            ref={sectionRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {canHover && <div className="js-exp-cursor__mist" ref={mistRef} aria-hidden="true" />}
            {!canHover && <div className="js-exp-cursor__glow" aria-hidden="true" />}

            <div className="js-exp-cursor__inner">
                <span className="js-exp-cursor__eyebrow">The Feeling</span>
                <h2 className="js-exp-cursor__text">Own Your Signature Scent</h2>
                <p className="js-exp-cursor__subtitle">
                    Six threads, one you haven't worn yet - find the one that's yours.
                </p>
                <a href="#" className="js-exp-cursor__cta">Buy Now</a>
            </div>
        </section>
    );
}