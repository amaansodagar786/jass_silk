import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./ExperienceCursor.scss";

const HEADLINE_WORDS = ["Own", "Your", "Signature", "Scent"];
const MAGNET_RADIUS = 240;

export default function ExperienceCursor() {
    const sectionRef = useRef(null);
    const mistRef = useRef(null);
    const rafId = useRef(null);
    const [canHover, setCanHover] = useState(true);

    const wordRefs = useRef([]);
    wordRefs.current = [];
    const addWordRef = (el) => el && wordRefs.current.push(el);
    const wordMoves = useRef([]);

    const buttonRef = useRef(null);
    const buttonMove = useRef(null);
    const rippleRef = useRef(null);

    useEffect(() => {
        setCanHover(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
    }, []);

    useEffect(() => {
        if (!canHover) return;
        gsap.set(mistRef.current, { opacity: 0 });

        wordMoves.current = wordRefs.current.map((el) => ({
            x: gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" }),
            y: gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" }),
        }));

        if (buttonRef.current) {
            buttonMove.current = {
                x: gsap.quickTo(buttonRef.current, "x", { duration: 0.4, ease: "power3" }),
                y: gsap.quickTo(buttonRef.current, "y", { duration: 0.4, ease: "power3" }),
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canHover]);

    const applyMagnet = (el, mover, mouseX, mouseY, strengthFactor) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = mouseX - cx;
        const dy = mouseY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MAGNET_RADIUS) {
            const pull = (1 - dist / MAGNET_RADIUS) * strengthFactor;
            mover.x(dx * pull);
            mover.y(dy * pull);
        } else {
            mover.x(0);
            mover.y(0);
        }
    };

    const handleMouseMove = (e) => {
        if (!canHover) return;

        // cursor mist
        const rect = sectionRef.current.getBoundingClientRect();
        cancelAnimationFrame(rafId.current);
        rafId.current = requestAnimationFrame(() => {
            gsap.to(mistRef.current, {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                opacity: 1,
                duration: 0.6,
                ease: "power3.out",
            });
        });

        // magnetic headline words
        wordRefs.current.forEach((el, i) => {
            if (wordMoves.current[i]) {
                applyMagnet(el, wordMoves.current[i], e.clientX, e.clientY, 0.4);
            }
        });

        // magnetic button
        if (buttonRef.current && buttonMove.current) {
            applyMagnet(buttonRef.current, buttonMove.current, e.clientX, e.clientY, 0.55);
        }
    };

    const handleMouseLeave = () => {
        cancelAnimationFrame(rafId.current);
        gsap.to(mistRef.current, { opacity: 0, duration: 0.5, ease: "power2.out" });
        wordMoves.current.forEach((m) => { m.x(0); m.y(0); });
        if (buttonMove.current) { buttonMove.current.x(0); buttonMove.current.y(0); }
    };

    const handleButtonClick = (e) => {
        if (!rippleRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        gsap.set(rippleRef.current, {
            left: e.clientX - rect.left,
            top: e.clientY - rect.top,
            scale: 0,
            opacity: 0.55,
        });
        gsap.to(rippleRef.current, { scale: 5, opacity: 0, duration: 0.7, ease: "power2.out" });
    };

    return (
        <section
            className="js-exp-cursor"
            ref={sectionRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div className="js-exp-cursor__grain" aria-hidden="true" />
            {canHover && <div className="js-exp-cursor__mist" ref={mistRef} aria-hidden="true" />}
            {!canHover && <div className="js-exp-cursor__glow" aria-hidden="true" />}

            <div className="js-exp-cursor__inner">
                <span className="js-exp-cursor__eyebrow">The Feeling</span>

                <h2 className="js-exp-cursor__text">
                    {HEADLINE_WORDS.map((word, i) => (
                        <span className="js-exp-cursor__word" key={word} ref={addWordRef}>
                            {word}
                            {i !== HEADLINE_WORDS.length - 1 && "\u00A0"}
                        </span>
                    ))}
                </h2>

                <p className="js-exp-cursor__subtitle">
                    Six threads, one you haven't worn yet - find the one that's yours.
                </p>

                <a
                    href="#"
                    className="js-exp-cursor__cta"
                    ref={buttonRef}
                    onClick={handleButtonClick}
                    data-cursor="buy"
                >
                    <span className="js-exp-cursor__cta-mask">
                        <span className="js-exp-cursor__cta-label js-exp-cursor__cta-label--front">Buy Now</span>
                        <span className="js-exp-cursor__cta-label js-exp-cursor__cta-label--back">Get Yours →</span>
                    </span>
                    <span className="js-exp-cursor__ripple" ref={rippleRef} aria-hidden="true" />
                </a>
            </div>
        </section>
    );
}