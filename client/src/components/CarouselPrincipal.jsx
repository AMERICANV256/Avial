import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import imagen2 from "../assets/img/CAROUSEL/EXCAVADORA.jpg";
import imagen3 from "../assets/img/CAROUSEL/PALA-CARGADORA.jpg";
import imagen4 from "../assets/img/VARIOS/FOTO1.jpg";
import imagen5 from "../assets/img/VARIOS/FOTO2.jpg";
import imagen6 from "../assets/img/VARIOS/americanvialfc.jpg";

export default function CarouselPrincipal() {
  return (
    <Carousel
      additionalTransfrom={0}
      arrows={false}
      autoPlaySpeed={3000}
      centerMode={false}
      className="custom-carousel"
      containerClass="custom-container"
      dotListClass="custom-dot-list"
      draggable
      focusOnSelect={false}
      infinite
      itemClass="custom-item"
      keyBoardControl
      minimumTouchDrag={80}
      pauseOnHover
      renderArrowsWhenDisabled={false}
      renderButtonGroupOutside={false}
      renderDotsOutside={false}
      responsive={{
        desktop: {
          breakpoint: {
            max: 3000,
            min: 1024,
          },
          items: 1,
        },
        mobile: {
          breakpoint: {
            max: 464,
            min: 0,
          },
          items: 1,
        },
        tablet: {
          breakpoint: {
            max: 1024,
            min: 464,
          },
          items: 1,
        },
      }}
      rewind={false}
      rewindWithAnimation={false}
      rtl={false}
      shouldResetAutoplay
      showDots={false}
      sliderClass="custom-slider"
      slidesToSlide={1}
      swipeable
      autoPlay={true}
    >
      <div className="custom-slide">
        <img src={imagen2} alt="Imagen 2" />
      </div>
      <div className="custom-slide">
        <img src={imagen3} alt="Imagen 3" />
      </div>
      <div className="custom-slide">
        <img src={imagen4} alt="Imagen 4" />
      </div>
      <div className="custom-slide">
        <img src={imagen5} alt="Imagen 5" />
      </div>
      <div className="custom-slide">
        <img src={imagen6} alt="Imagen 6" />
      </div>
    </Carousel>
  );
}
