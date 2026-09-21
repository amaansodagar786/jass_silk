import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./HeroTypography.scss";

import desktop_hero from "../../../assets/images/hero/desktop_hero.png"
import mobile_hero from "../../../assets/images/hero/mobile_hero.png"
import desktop_hero2 from "../../../assets/images/hero/desktop_hero2.png"
import mobile_hero2 from "../../../assets/images/hero/mobile_hero2.png"

const HEADLINE = "JASS SILK";
const AUTOPLAY_MS = 5000;

// Slide 1 is always the typography layout below — slides 2-4 are plain
// images. Swap `desktop`/`mobile` for real product photography whenever
// it's ready; for now these are premium Unsplash placeholders.
const SLIDES = [
    { key: "intro", type: "content" },
    {
        key: "citrus",
        type: "image",
        desktop:
            desktop_hero,
        mobile:
            mobile_hero,
    },
    {
        key: "amber",
        type: "image",
        desktop:
            desktop_hero2,
        mobile:
            mobile_hero2,
    },
    {
        key: "musk",
        type: "image",
        desktop:
            desktop_hero,
        mobile:
            mobile_hero,
    },
];

// clip-path states for the diagonal wipe — both are 4-point percentage
// polygons so GSAP can interpolate point-by-point between them. HIDDEN is
// a thin angled band sitting off-screen to the left; as it tweens toward
// OPEN it grows into the full rectangle while sweeping rightward, giving
// a slanted "blade" reveal instead of a flat wipe or a plain fade.
const CLIP_OPEN = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
const CLIP_HIDDEN = "polygon(-40% 0%, -10% 0%, -40% 100%, -70% 100%)";

export default function HeroTypography() {
    const sectionRef = useRef(null);
    const lettersRef = useRef([]);
    lettersRef.current = [];
    const slideRefs = useRef([]);
    slideRefs.current = [];
    const indexRef = useRef(0);
    const timeoutRef = useRef(null);

    // Living-diorama depth layers
    const bgRef = useRef(null);
    const slidesWrapRef = useRef(null);
    const contentInnerRef = useRef(null);
    const sheenRef = useRef(null);
    const moversRef = useRef(null);
    const [canHover, setCanHover] = useState(false);

    const addLetterRef = (el) => {
        if (el) lettersRef.current.push(el);
    };
    const addSlideRef = (el) => {
        if (el) slideRefs.current.push(el);
    };

    // one-time entrance animation for the typography slide's own content —
    // unrelated to the slider, plays once on mount same as before
    useEffect(() => {
        const tl = gsap.timeline({ delay: 0.2 });

        tl.fromTo(
            lettersRef.current,
            { yPercent: 120, opacity: 0, skewY: 6 },
            {
                yPercent: 0,
                opacity: 1,
                skewY: 0,
                duration: 1.1,
                ease: "power4.out",
                stagger: 0.045,
            }
        )
            .fromTo(
                ".js-hero-typo__rule",
                { scaleX: 0 },
                { scaleX: 1, duration: 0.9, ease: "power3.inOut" },
                "-=0.5"
            )
            .fromTo(
                ".js-hero-typo__tagline, .js-hero-typo__cta",
                { y: 16, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.7, ease: "power2.out", stagger: 0.1 },
                "-=0.4"
            );

        return () => tl.kill();
    }, []);

    // autoplay slider — diagonal clip-path wipe, direct image-to-image,
    // never renders a blank/black frame between slides
    useEffect(() => {
        const slides = slideRefs.current;
        const total = slides.length;
        let isAnimating = false;

        // in dev, React can invoke this effect twice (mount → cleanup →
        // mount) — clear out any timer a previous invocation may have left
        // running before this one schedules its own, so we never end up
        // with two autoplay loops racing each other
        clearTimeout(timeoutRef.current);
        indexRef.current = 0;

        gsap.set(slides[0], { clipPath: CLIP_OPEN, scale: 1, zIndex: total });
        gsap.set(slides.slice(1), { clipPath: CLIP_HIDDEN, scale: 1.08, zIndex: 0 });

        function goTo(next) {
            const current = indexRef.current;
            if (next === current || isAnimating) return;
            isAnimating = true;

            // bring the incoming slide to the very front, reset to its hidden
            // starting shape right before animating it in
            gsap.set(slides[next], { clipPath: CLIP_HIDDEN, scale: 1.08, zIndex: total + 1 });

            gsap
                .timeline({
                    defaults: { duration: 1.2, ease: "power3.inOut" },
                    onComplete: () => {
                        // settle stacking order so the next cycle starts clean
                        gsap.set(slides[current], { zIndex: 0, scale: 1.08, clipPath: CLIP_HIDDEN });
                        gsap.set(slides[next], { zIndex: total });
                        isAnimating = false;
                    },
                })
                .to(slides[next], { clipPath: CLIP_OPEN, scale: 1 }, 0)
                // outgoing slide gets a very subtle push-back scale for depth —
                // it stays fully opaque and visible the whole time, just slightly
                // larger, so nothing ever reads as "gone" mid-transition
                .to(slides[current], { scale: 1.06 }, 0);

            indexRef.current = next;
        }

        function scheduleNext() {
            timeoutRef.current = setTimeout(() => {
                goTo((indexRef.current + 1) % total);
                scheduleNext();
            }, AUTOPLAY_MS);
        }

        scheduleNext();

        return () => clearTimeout(timeoutRef.current);
    }, []);

    // --- Living Diorama: mouse-parallax depth layers + specular light sheen ---
    // Fine-pointer devices only — never engages on touch, so mobile stays
    // exactly as the static/autoplay experience with zero risk of jank.
    useEffect(() => {
        setCanHover(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
    }, []);

    useEffect(() => {
        if (!canHover) return;

        moversRef.current = {
            bg: {
                x: gsap.quickTo(bgRef.current, "x", { duration: 0.9, ease: "power3" }),
                y: gsap.quickTo(bgRef.current, "y", { duration: 0.9, ease: "power3" }),
            },
            slides: {
                x: gsap.quickTo(slidesWrapRef.current, "x", { duration: 0.7, ease: "power3" }),
                y: gsap.quickTo(slidesWrapRef.current, "y", { duration: 0.7, ease: "power3" }),
            },
            content: contentInnerRef.current
                ? {
                    x: gsap.quickTo(contentInnerRef.current, "x", { duration: 0.5, ease: "power3" }),
                    y: gsap.quickTo(contentInnerRef.current, "y", { duration: 0.5, ease: "power3" }),
                }
                : null,
            sheenX: gsap.quickTo(sheenRef.current, "x", { duration: 0.35, ease: "power3" }),
            sheenY: gsap.quickTo(sheenRef.current, "y", { duration: 0.35, ease: "power3" }),
        };

        const handleMove = (e) => {
            const rect = sectionRef.current.getBoundingClientRect();
            const relX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
            const relY = (e.clientY - rect.top) / rect.height - 0.5;

            const m = moversRef.current;
            m.bg.x(relX * -14);
            m.bg.y(relY * -10);
            m.slides.x(relX * -24);
            m.slides.y(relY * -16);
            m.content?.x(relX * 30);
            m.content?.y(relY * 20);

            m.sheenX(e.clientX - rect.left);
            m.sheenY(e.clientY - rect.top);
            gsap.to(sheenRef.current, { opacity: 1, duration: 0.3 });
        };

        const handleLeave = () => {
            const m = moversRef.current;
            m.bg.x(0); m.bg.y(0);
            m.slides.x(0); m.slides.y(0);
            m.content?.x(0); m.content?.y(0);
            gsap.to(sheenRef.current, { opacity: 0, duration: 0.4 });
        };

        const section = sectionRef.current;
        section.addEventListener("mousemove", handleMove);
        section.addEventListener("mouseleave", handleLeave);

        return () => {
            section.removeEventListener("mousemove", handleMove);
            section.removeEventListener("mouseleave", handleLeave);
        };
    }, [canHover]);

    return (
        <section className="js-hero-typo" ref={sectionRef}>
            <div className="js-hero-typo__bg" aria-hidden="true" ref={bgRef} />

            <div className="js-hero-typo__slides" ref={slidesWrapRef}>
                {SLIDES.map((slide) => (
                    <div className="js-hero-typo__slide" key={slide.key} ref={addSlideRef}>
                        {slide.type === "content" ? (
                            <div className="js-hero-typo__inner" ref={contentInnerRef}>
                                <h1 className="js-hero-typo__headline" aria-label={HEADLINE}>
                                    {HEADLINE.split("").map((char, i) => (
                                        <span className="js-hero-typo__letter-wrap" key={i}>
                                            <span className="js-hero-typo__letter" ref={addLetterRef}>
                                                {char === " " ? "\u00A0" : char}
                                            </span>
                                        </span>
                                    ))}
                                </h1>

                                <span className="js-hero-typo__rule" aria-hidden="true" />

                                <p className="js-hero-typo__tagline">Woven from silk, worn as scent.</p>

                                <a href="#products" className="js-hero-typo__cta">
                                    Discover the Collection
                                </a>
                            </div>
                        ) : (
                            <picture className="js-hero-typo__slide-media">
                                <source media="(max-width: 768px)" srcSet={slide.mobile} />
                                <img src={slide.desktop} alt="Jass Silk perfume" />
                            </picture>
                        )}
                    </div>
                ))}
            </div>

            {canHover && <div className="js-hero-typo__sheen" ref={sheenRef} aria-hidden="true" />}
        </section>
    );
}