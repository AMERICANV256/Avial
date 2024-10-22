import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import xcmg from "../assets/img/MARCAS/XCMG.png";
import crybsa from "../assets/img/MARCAS/CRYBSA.png";
import magni from "../assets/img/MARCAS/MAGNI.png";
import wecan from "../assets/img/MARCAS/WEOCAN.png";
import mst from "../assets/img/MARCAS/MST.png";

export default function CarouselMarcas() {
  return (
    <Carousel
      additionalTransfrom={0}
      autoPlaySpeed={3000}
      arrows={false}
      centerMode
      className=""
      containerClass="container"
      dotListClass=""
      draggable
      focusOnSelect={false}
      infinite
      itemClass=""
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
          items: 3,
          partialVisibilityGutter: 40,
        },
        mobile: {
          breakpoint: {
            max: 464,
            min: 0,
          },
          items: 1,
          partialVisibilityGutter: 30,
        },
        tablet: {
          breakpoint: {
            max: 1024,
            min: 464,
          },
          items: 2,
          partialVisibilityGutter: 30,
        },
      }}
      rewind={false}
      rewindWithAnimation={false}
      rtl={false}
      shouldResetAutoplay
      showDots={false}
      sliderClass=""
      slidesToSlide={1}
      swipeable
      autoPlay={true}
    >
      <img
        src={mst}
        style={{ marginTop: "25px" }}
        className="carouselmarcaimage"
      />
      <img
        src={xcmg}
        className="carouselmarcaimage"
        style={{ marginTop: "10px" }}
      />
      <img
        src={crybsa}
        style={{ marginTop: "15px" }}
        className="carouselmarcaimage"
      />
      <img
        src={magni}
        className="carouselmarcaimage"
        style={{ marginTop: "10px" }}
      />
      <img
        src={wecan}
        style={{ marginTop: "20px" }}
        className="carouselmarcaimage"
      />
    </Carousel>
  );
}
