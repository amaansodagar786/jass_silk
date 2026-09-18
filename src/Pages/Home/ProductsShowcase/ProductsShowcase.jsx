import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
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

    return (
        <section className="js-products" id="products">
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
                    >
                        <FaArrowLeftLong />
                    </button>
                    <button
                        className="js-products__arrow"
                        onClick={() => swiperRef.current?.slideNext()}
                        aria-label="Next product"
                    >
                        <FaArrowRightLong />
                    </button>
                </div>
            </div>

            <Swiper
                modules={[Navigation]}
                onSwiper={(s) => {
                    swiperRef.current = s;
                    setActiveIndex(s.realIndex);
                }}
                onSlideChange={handleSlideChange}
                observer
                observeParents
                loop
                loopAdditionalSlides={2}
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
                        <a href={`/product/${p.id}`} className="js-products__card">
                            <div className="js-products__media">
                                <img src={p.homeImage} alt={p.name} />
                                <span className="js-products__view">View Product</span>
                            </div>
                            <div className="js-products__info">
                                <span className="js-products__name">{p.name}</span>
                                <span className="js-products__note">{p.categories.slice(0, 2).join(" · ")}</span>
                            </div>
                        </a>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}