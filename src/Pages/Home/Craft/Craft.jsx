import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Craft.scss";

import oud from "../../../assets/images/ingredents/oud.png";
import amber from "../../../assets/images/ingredents/amber.png";
import jasmine from "../../../assets/images/ingredents/jasmine.png";
import sandalwood from "../../../assets/images/ingredents/sandalwood.png";
import musk from "../../../assets/images/ingredents/musk.png";

gsap.registerPlugin(ScrollTrigger);

const INGREDIENTS = [
    {
        key: "oud",
        name: "Oud",
        desc: "Aged agarwood, smoked and resinous - the deep root of every blend.",
        image: oud,
    },
    {
        key: "amber",
        name: "Amber",
        desc: "Warm, sun-baked resin that lingers long after the first wear.",
        image: amber,
    },
    {
        key: "jasmine",
        name: "Jasmine",
        desc: "Hand-picked at night, when the bloom is at its most fragrant.",
        image: jasmine,
    },
    {
        key: "sandalwood",
        name: "Sandalwood",
        desc: "Creamy, soft wood that grounds every top note in silk.",
        image: sandalwood,
    },
    {
        key: "musk",
        name: "Musk",
        desc: "The final whisper - clean, skin-like, impossible to forget.",
        image: musk,
    },
];

const LENS_SIZE = 130;
const ZOOM = 2.4;

export default function Craft() {
    const sectionRef = useRef(null);
    const rowRef = useRef(null);
    const lensRef = useRef(null);
    const panelRefs = useRef([]);
    panelRefs.current = [];
    const addPanelRef = (el) => el && panelRefs.current.push(el);

    const [activeIndex, setActiveIndex] = useState(0);
    const [lensImage, setLensImage] = useState(null);
    const lensX = useRef(null);
    const lensY = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".js-craft__panel",
                { y: 36, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.7,
                    ease: "power3.out",
                    stagger: 0.1,
                    scrollTrigger: { trigger: ".js-craft__row", start: "top 82%" },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    useEffect(() => {
        if (!lensRef.current) return;
        lensX.current = gsap.quickTo(lensRef.current, "x", { duration: 0.25, ease: "power3" });
        lensY.current = gsap.quickTo(lensRef.current, "y", { duration: 0.25, ease: "power3" });
    }, []);

    const finePointer = () =>
        typeof window !== "undefined" &&
        window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const handleRowMouseMove = (e) => {
        if (!finePointer()) return;
        const panelEl = e.target.closest(".js-craft__panel");
        const rowRect = rowRef.current.getBoundingClientRect();

        lensX.current?.(e.clientX - rowRect.left);
        lensY.current?.(e.clientY - rowRect.top);

        if (panelEl) {
            const idx = panelRefs.current.indexOf(panelEl);
            if (idx !== -1 && idx !== activeIndex) setActiveIndex(idx);

            const imgRect = panelEl.getBoundingClientRect();
            const relX = ((e.clientX - imgRect.left) / imgRect.width) * 100;
            const relY = ((e.clientY - imgRect.top) / imgRect.height) * 100;

            setLensImage({
                src: INGREDIENTS[idx]?.image,
                posX: relX,
                posY: relY,
            });
        }
    };

    const handleRowMouseLeave = () => setLensImage(null);

    return (
        <section className="js-craft" ref={sectionRef}>
            <div className="js-craft__grain" aria-hidden="true" />

            <div className="js-craft__head">
                <span className="js-craft__eyebrow">The Craft</span>
                <h2 className="js-craft__title">Sourced with Intention</h2>
                <p className="js-craft__intro">
                    Every Jass Silk fragrance is built from five materials, each chosen
                    for what it adds to the thread - not for what it hides.
                </p>
            </div>

            <div
                className="js-craft__row"
                ref={rowRef}
                onMouseMove={handleRowMouseMove}
                onMouseLeave={handleRowMouseLeave}
            >
                {INGREDIENTS.map((item, i) => (
                    <div
                        className={`js-craft__panel ${i === activeIndex ? "js-craft__panel--active" : ""}`}
                        key={item.key}
                        ref={addPanelRef}
                        onClick={() => setActiveIndex(i)}
                    >
                        <span className="js-craft__ghost" aria-hidden="true">
                            {item.name[0]}
                        </span>

                        <img src={item.image} alt={item.name} loading="lazy" />
                        <div className="js-craft__overlay" aria-hidden="true" />

                        <span className="js-craft__spine">{item.name}</span>

                        <div className="js-craft__detail">
                            <span className="js-craft__name">{item.name}</span>
                            <p className="js-craft__desc">{item.desc}</p>
                        </div>
                    </div>
                ))}

                {lensImage && (
                    <div
                        className="js-craft__lens"
                        ref={lensRef}
                        style={{
                            backgroundImage: `url(${lensImage.src})`,
                            backgroundPosition: `${lensImage.posX}% ${lensImage.posY}%`,
                            backgroundSize: `${ZOOM * 100}%`,
                            width: LENS_SIZE,
                            height: LENS_SIZE,
                        }}
                        aria-hidden="true"
                    />
                )}
            </div>
        </section>
    );
}