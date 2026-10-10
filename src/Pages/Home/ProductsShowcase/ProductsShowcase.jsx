import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import gsap from "gsap";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import "swiper/css";
import "./ProductsShowcase.scss";

// adjust this relative path to wherever products.js actually lives
import { PRODUCTS } from "../../../Components/data/products";

export default function ProductsShowcase() {
    const swiperRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleSlideChange = (swiper) => {
        setActiveIndex(swiper.realIndex);
    };

    // Apple-style "focus" effect — slides scale/fade based on distance from center.
    // Targets the CARD inside each slide (not the slide itself) so GSAP never
    // fights Swiper over the slide's own transform.
    const applyFocus = (swiper) => {
        if (!swiper || swiper.destroyed) return;
        swiper.slides.forEach((slideEl) => {
            const card = slideEl.querySelector(".js-products__card");
            if (!card) return;
            const p = Math.min(Math.abs(slideEl.progress || 0), 1);
            gsap.to(card, {
                scale: 1 - p * 0.16,
                opacity: 1 - p * 0.55,
                duration: 0.25,
                ease: "power2.out",
                overwrite: true,
            });
        });
    };

    // Re-measure Swiper once layout, fonts and images have settled.
    // First paint can measure the container wrongly, which leaves an empty
    // gap on the right and can leave the arrows "stuck".
    useEffect(() => {
        const remeasure = () => {
            const s = swiperRef.current;
            if (!s || s.destroyed) return;
            s.update();
            applyFocus(s);
        };

        const raf = requestAnimationFrame(remeasure);
        const t = setTimeout(remeasure, 300);
        document.fonts?.ready.then(remeasure);
        window.addEventListener("load", remeasure);
        window.addEventListener("resize", remeasure);

        return () => {
            cancelAnimationFrame(raf);
            clearTimeout(t);
            window.removeEventListener("load", remeasure);
            window.removeEventListener("resize", remeasure);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handlePrev = () => {
        swiperRef.current?.slidePrev();
    };

    const handleNext = () => {
        const s = swiperRef.current;

        // TEMPORARY DEBUG — click the right arrow, check the browser console,
        // then delete this console.log once the arrow works.
        console.log({
            exists: !!s,
            allowSlideNext: s?.allowSlideNext,
            isLocked: s?.isLocked,
            animating: s?.animating,
            slides: s?.slides?.length,
            spv: s?.params?.slidesPerView,
        });

        s?.slideNext();
    };

    return (
        <section className="js-products" id="products">
            <div className="js-products__grain" aria-hidden="true" />
            <span className="js-products__ghost" aria-hidden="true">Collection</span>

            <div className="js-products__head">
                <div>
                    <span className="js-products__eyebrow">The Collection</span>
                    <h2 className="js-products__title">Six Notes, One Thread</h2>
                </div>

                <div className="js-products__nav">
                    <button
                        type="button"
                        className="js-products__arrow"
                        onClick={handlePrev}
                        aria-label="Previous product"
                        data-cursor="link"
                    >
                        <FaArrowLeftLong />
                    </button>
                    <button
                        type="button"
                        className="js-products__arrow"
                        onClick={handleNext}
                        aria-label="Next product"
                        data-cursor="link"
                    >
                        <FaArrowRightLong />
                    </button>
                </div>
            </div>

            <div className="js-products__swiper-wrap">
                <Swiper
                    modules={[Navigation]}
                    onSwiper={(s) => {
                        swiperRef.current = s;
                        setActiveIndex(s.realIndex);
                        applyFocus(s);
                        requestAnimationFrame(() => {
                            if (s.destroyed) return;
                            s.update();
                            applyFocus(s);
                        });
                    }}
                    onSlideChange={handleSlideChange}
                    onProgress={applyFocus}
                    onSetTranslate={applyFocus}
                    observer
                    observeParents
                    loop
                    centeredSlides
                    watchSlidesProgress
                    speed={700}
                    spaceBetween={20}
                    slidesPerView={1.15}
                    grabCursor
                    breakpoints={{
                        640: { slidesPerView: 1.8, spaceBetween: 24 },
                        1024: { slidesPerView: 3, spaceBetween: 32 },
                        1400: { slidesPerView: 3, spaceBetween: 20 },
                    }}
                    className="js-products__swiper"
                >
                    {PRODUCTS.map((p) => (
                        <SwiperSlide key={p.id} className="js-products__slide">
                            <a
                                href={`/product/${p.id}`}
                                className="js-products__card"
                                data-cursor="view"
                            >
                                <div className="js-products__media">
                                    <img src={p.homeImage} alt={p.name} />
                                    <span className="js-products__sweep" aria-hidden="true" />
                                    <span className="js-products__view">View Product</span>
                                </div>
                                <div className="js-products__info">
                                    <span className="js-products__name">{p.name}</span>
                                    <span className="js-products__note">
                                        {p.categories.slice(0, 2).join(" · ")}
                                    </span>
                                </div>
                            </a>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <div className="js-products__progress">
                <div className="js-products__progress-track">
                    <span className="js-products__progress-line" aria-hidden="true" />
                    {PRODUCTS.map((p, i) => (
                        <span
                            key={p.id}
                            className={`js-products__progress-dot ${i === activeIndex ? "js-products__progress-dot--active" : ""}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}