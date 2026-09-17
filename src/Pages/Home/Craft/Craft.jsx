import { useEffect, useRef } from "react";
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

export default function Craft() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".js-craft__card",
                { y: 36, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.7,
                    ease: "power3.out",
                    stagger: 0.12,
                    scrollTrigger: {
                        trigger: ".js-craft__grid",
                        start: "top 82%",
                    },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="js-craft" ref={sectionRef}>
            <div className="js-craft__head">
                <span className="js-craft__eyebrow">The Craft</span>
                <h2 className="js-craft__title">Sourced with Intention</h2>
                <p className="js-craft__intro">
                    Every Jass Silk fragrance is built from five materials, each chosen
                    for what it adds to the thread - not for what it hides.
                </p>
            </div>

            <div className="js-craft__grid">
                {INGREDIENTS.map((item) => (
                    <div className="js-craft__card" key={item.key}>
                        <span className="js-craft__icon">
                            <img
                                src={item.image}
                                alt={item.name}
                                loading="lazy"
                            />
                        </span>
                        <span className="js-craft__name">{item.name}</span>
                        <p className="js-craft__desc">{item.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}