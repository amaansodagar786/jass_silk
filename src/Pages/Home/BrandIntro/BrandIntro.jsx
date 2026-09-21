import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./BrandIntro.scss";

gsap.registerPlugin(ScrollTrigger);

const LINES = [
    "Every Jass Silk fragrance begins",
    "with a single thread —",
    "one note strong enough to define the rest.",
];

// Pass a real product photo later via `image` — falls back to a gradient placeholder until then
export default function BrandIntro({ image = null }) {
    const sectionRef = useRef(null);
    const countRef = useRef(null);
    const mediaWrapRef = useRef(null);
    const mediaInnerRef = useRef(null);
    const frameRectRef = useRef(null);
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
                    scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
                }
            );

            // Seal badge fade/rise + slow ring spin starts once visible
            gsap.fromTo(
                ".js-brand-intro__seal",
                { y: 20, opacity: 0, scale: 0.9 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    ease: "back.out(1.6)",
                    scrollTrigger: { trigger: ".js-brand-intro__seal", start: "top 85%" },
                }
            );

            // Count-up number
            const counter = { val: 0 };
            gsap.to(counter, {
                val: 6,
                duration: 1.4,
                ease: "power1.out",
                scrollTrigger: { trigger: ".js-brand-intro__seal", start: "top 85%", once: true },
                onUpdate: () => {
                    if (countRef.current) countRef.current.textContent = Math.floor(counter.val);
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
                    scrollTrigger: { trigger: sectionRef.current, start: "top 65%" },
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

            // Animated gold frame — draws around the image as it reveals
            const rectEl = frameRectRef.current;
            if (rectEl) {
                const length = rectEl.getTotalLength();
                gsap.set(rectEl, { strokeDasharray: length, strokeDashoffset: length });
                gsap.to(rectEl, {
                    strokeDashoffset: 0,
                    duration: 1.3,
                    ease: "power3.inOut",
                    scrollTrigger: { trigger: sectionRef.current, start: "top 65%" },
                });
            }
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
            <div className="js-brand-intro__grain" aria-hidden="true" />
            <span className="js-brand-intro__ghost" aria-hidden="true">Silk</span>

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

                    {/* Wax-seal style badge instead of a plain stat row */}
                    <div className="js-brand-intro__seal">
                        <span className="js-brand-intro__seal-ring" aria-hidden="true" />
                        <span className="js-brand-intro__seal-number">
                            <span ref={countRef}>0</span>
                        </span>
                        <span className="js-brand-intro__seal-label">Fragrances<br />One Philosophy</span>
                    </div>
                </div>

                {/* Image column */}
                <div
                    className="js-brand-intro__media"
                    ref={mediaWrapRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    data-cursor="view"
                >
                    <div className="js-brand-intro__media-inner" ref={mediaInnerRef}>
                        {image ? (
                            <img src={image} alt="Jass Silk perfume bottle" />
                        ) : (
                            <div className="js-brand-intro__media-fallback" />
                        )}
                        <span className="js-brand-intro__tag">Crafted in Small Batches</span>
                    </div>

                    <svg className="js-brand-intro__frame" aria-hidden="true">
                        <rect x="1" y="1" width="99%" height="99%" ref={frameRectRef} />
                    </svg>
                </div>
            </div>
        </section>
    );
}