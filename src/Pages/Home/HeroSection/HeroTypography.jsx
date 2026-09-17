import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./HeroTypography.scss";

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
            "https://images.unsplash.com/photo-1621275155732-2bff82c64fd2?w=1800&q=80&auto=format&fit=crop",
        mobile:
            "https://images.unsplash.com/photo-1694422789021-54bd74b39f52?w=900&h=1200&q=80&auto=format&fit=crop&crop=entropy",
    },
    {
        key: "amber",
        type: "image",
        desktop:
            "https://images.unsplash.com/photo-1589493732575-11a963a7c415?w=1800&q=80&auto=format&fit=crop",
        mobile:
            "https://images.unsplash.com/photo-1709662369957-0cbf9f8452fc?w=900&h=1200&q=80&auto=format&fit=crop&crop=entropy",
    },
    {
        key: "musk",
        type: "image",
        desktop:
            "https://images.unsplash.com/photo-1584841247175-4d766cefa018?w=1800&q=80&auto=format&fit=crop",
        mobile:
            "https://images.unsplash.com/photo-1584841247175-4d766cefa018?w=900&h=1200&q=80&auto=format&fit=crop&crop=entropy",
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
    const lettersRef = useRef([]);
    lettersRef.current = [];
    const slideRefs = useRef([]);
    slideRefs.current = [];
    const indexRef = useRef(0);
    const timeoutRef = useRef(null);

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

    return (
        <section className="js-hero-typo">
            <div className="js-hero-typo__bg" aria-hidden="true" />

            <div className="js-hero-typo__slides">
                {SLIDES.map((slide) => (
                    <div className="js-hero-typo__slide" key={slide.key} ref={addSlideRef}>
                        {slide.type === "content" ? (
                            <div className="js-hero-typo__inner">
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
        </section>
    );
}