import { useRef, useState } from "react";
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

    // Apple-style "focus" effect — slides scale/fade based on distance from center
    const applyFocus = (swiper) => {
        swiper.slides.forEach((slideEl) => {
            const p = Math.min(Math.abs(slideEl.progress || 0), 1);
            gsap.to(slideEl, {
                scale: 1 - p * 0.16,
                opacity: 1 - p * 0.55,
                duration: 0.25,
                ease: "power2.out",
                overwrite: true,
            });
        });
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
                        className="js-products__arrow"
                        onClick={() => swiperRef.current?.slidePrev()}
                        aria-label="Previous product"
                        data-cursor="link"
                    >
                        <FaArrowLeftLong />
                    </button>
                    <button
                        className="js-products__arrow"
                        onClick={() => swiperRef.current?.slideNext()}
                        aria-label="Next product"
                        data-cursor="link"
                    >
                        <FaArrowRightLong />
                    </button>
                </div>
            </div>

            <div className="js-products__swiper-wrap" data-cursor="drag">
                <Swiper
                    modules={[Navigation]}
                    onSwiper={(s) => {
                        swiperRef.current = s;
                        setActiveIndex(s.realIndex);
                        applyFocus(s);
                    }}
                    onSlideChange={handleSlideChange}
                    onProgress={applyFocus}
                    onSetTranslate={applyFocus}
                    observer
                    observeParents
                    loop
                    loopAdditionalSlides={2}
                    centeredSlides
                    watchSlidesProgress
                    speed={700}
                    spaceBetween={20}
                    slidesPerView={1.15}
                    grabCursor
                    breakpoints={{
                        640: { slidesPerView: 1.8, spaceBetween: 24 },
                        1024: { slidesPerView: 2.4, spaceBetween: 32 },
                        1400: { slidesPerView: 2.8, spaceBetween: 36 },
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