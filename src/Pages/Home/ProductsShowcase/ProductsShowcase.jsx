import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import "swiper/css";
import "./ProductsShowcase.scss";

const IMG_A = "https://images.unsplash.com/photo-1709662369900-130507781728?w=900&q=80&auto=format&fit=crop";
const IMG_B = "https://images.unsplash.com/photo-1709662369957-0cbf9f8452fc?w=900&q=80&auto=format&fit=crop";

// Dummy data — replace with real products + individual photos later
const PRODUCTS = [
    { id: "silk-noir", name: "Silk Noir", note: "Amber · Oud", img: IMG_A },
    { id: "silk-bloom", name: "Silk Bloom", note: "Jasmine · Musk", img: IMG_B },
    { id: "silk-dawn", name: "Silk Dawn", note: "Citrus · Cedar", img: IMG_A },
    { id: "silk-velvet", name: "Silk Velvet", note: "Vanilla · Sandalwood", img: IMG_B },
    { id: "silk-mirage", name: "Silk Mirage", note: "Bergamot · Iris", img: IMG_A },
    { id: "silk-ember", name: "Silk Ember", note: "Spice · Leather", img: IMG_B },
];

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
                                <img src={p.img} alt={p.name} />
                                <span className="js-products__view">View Product</span>
                            </div>
                            <div className="js-products__info">
                                <span className="js-products__name">{p.name}</span>
                                <span className="js-products__note">{p.note}</span>
                            </div>
                        </a>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* <div className="js-products__progress">
                <div className="js-products__progress-track">
                    {PRODUCTS.map((p, i) => (
                        <span
                            key={p.id}
                            className={`js-products__progress-dot ${i === activeIndex ? "js-products__progress-dot--active" : ""}`}
                        />
                    ))}
                </div>
            </div> */}
        </section>
    );
}