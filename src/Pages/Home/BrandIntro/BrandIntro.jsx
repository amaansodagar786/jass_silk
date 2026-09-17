import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./BrandIntro.scss";

gsap.registerPlugin(ScrollTrigger);

const LINES = [
    "Every Jass Silk fragrance begins",
    "with a single thread -",
    "one note strong enough to define the rest.",
];

// Pass a real product photo later via `image` — falls back to a gradient placeholder until then
export default function BrandIntro({ image = null }) {
    const sectionRef = useRef(null);
    const countRef = useRef(null);
    const mediaWrapRef = useRef(null);
    const mediaInnerRef = useRef(null);
    const rafId = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Line-by-line mask reveal
            gsap.fromTo(
                ".js-brand-intro__line",
                { yPercent: 100 },
                {
                    yPercent: 0,
                    duration: 0.9,
                    ease: "power4.out",
                    stagger: 0.15,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 70%",
                    },
                }
            );

            // Stat pullout fade/rise
            gsap.fromTo(
                ".js-brand-intro__stat, .js-brand-intro__divider",
                { y: 20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out",
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: ".js-brand-intro__stat-block",
                        start: "top 85%",
                    },
                }
            );

            // Count-up number
            const counter = { val: 0 };
            gsap.to(counter, {
                val: 6,
                duration: 1.4,
                ease: "power1.out",
                scrollTrigger: {
                    trigger: ".js-brand-intro__stat-block",
                    start: "top 85%",
                    once: true,
                },
                onUpdate: () => {
                    if (countRef.current) {
                        countRef.current.textContent = Math.floor(counter.val);
                    }
                },
            });

            // Image: clip-path reveal + parallax drift
            gsap.fromTo(
                mediaInnerRef.current,
                { clipPath: "inset(100% 0% 0% 0%)" },
                {
                    clipPath: "inset(0% 0% 0% 0%)",
                    duration: 1.1,
                    ease: "power4.inOut",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 65%",
                    },
                }
            );

            gsap.to(mediaInnerRef.current, {
                yPercent: -8,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // RAF-based mouse tilt on the image
    const handleMouseMove = (e) => {
        const wrap = mediaWrapRef.current;
        if (!wrap) return;
        const rect = wrap.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;

        cancelAnimationFrame(rafId.current);
        rafId.current = requestAnimationFrame(() => {
            gsap.to(mediaInnerRef.current, {
                rotateY: relX * 8,
                rotateX: relY * -8,
                duration: 0.6,
                ease: "power2.out",
                overwrite: true,
            });
        });
    };

    const handleMouseLeave = () => {
        cancelAnimationFrame(rafId.current);
        gsap.to(mediaInnerRef.current, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.6,
            ease: "power3.out",
            overwrite: true,
        });
    };

    return (
        <section className="js-brand-intro" ref={sectionRef}>
            <div className="js-brand-intro__inner">
                {/* Text column */}
                <div className="js-brand-intro__text">
                    <p className="js-brand-intro__statement">
                        {LINES.map((line, i) => (
                            <span className="js-brand-intro__line-wrap" key={i}>
                                <span className="js-brand-intro__line">{line}</span>
                            </span>
                        ))}
                    </p>

                    <div className="js-brand-intro__stat-block">
                        <span className="js-brand-intro__divider" aria-hidden="true" />
                        <div className="js-brand-intro__stat">
                            <span className="js-brand-intro__stat-number">
                                <span ref={countRef}>0</span>
                            </span>
                            <span className="js-brand-intro__stat-label">
                                Fragrances.<br />One Philosophy.
                            </span>
                        </div>
                    </div>
                </div>

                {/* Image column */}
                <div
                    className="js-brand-intro__media"
                    ref={mediaWrapRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="js-brand-intro__media-inner" ref={mediaInnerRef}>
                        {image ? (
                            <img src={image} alt="Jass Silk perfume bottle" />
                        ) : (
                            <div className="js-brand-intro__media-fallback" />
                        )}
                    </div>
                    <span className="js-brand-intro__corner js-brand-intro__corner--tl" aria-hidden="true" />
                    <span className="js-brand-intro__corner js-brand-intro__corner--br" aria-hidden="true" />
                </div>
            </div>
        </section>
    );
}