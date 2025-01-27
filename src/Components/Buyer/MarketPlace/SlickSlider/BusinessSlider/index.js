/**
 * eslint-disable react/prop-types
 *
 * @format
 */

import { Fragment, useRef, useState } from "react";
import Slider from "react-slick";
import "./slider.style.css";
import BusinessSliderCard from "./BusinessSliderCard";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import useWindowWidth from "../../../../../hooks/useWindowWidth";
import useLocalStorage from "react-use-localstorage";
import { StartupStatus } from "../../../../../constants/constant";

const BusinessSlides = ({
  data,
  className,
  loadingGetPromoted,
  handlerCheckStartupBeforeNavigate,
}) => {
  const width = useWindowWidth();
  const sliderRef = useRef(null);
  const [showInfoIconModal, setShowInfoIconModal] = useState(false);
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  const CustomNextArrowBtn = ({ className, style, onClick }) => {
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          position: "absolute",
          right: width <= 425 ? "50px" : "-30px",
          padding: "6px",
          backgroundColor: "#FFF",
          borderRadius: "100%",
          top: width <= 425 ? "100%" : "50%",
          marginTop: width <= 425 ? "12px" : "0px",
          cursor: "pointer",
          transform: `${
            width <= 425 ? "translateX(-50%)" : "translateY(-50%)"
          } `,
          zIndex: 1,
        }}
        onClick={onClick}
      >
        <IoIosArrowForward color={"#1C2F40"} size={24} />
      </div>
    );
  };

  const CustomPrevArrowBtn = ({ className, style, onClick }) => {
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          position: "absolute",
          padding: "6px",
          backgroundColor: "#FFF",
          borderRadius: "100%",
          left: width <= 425 ? "90px" : "-30px",
          top: width <= 425 ? "100%" : "50%",
          marginTop: width <= 425 ? "12px" : "0px",
          cursor: "pointer",
          transform: `${
            width <= 425 ? "translateX(-50%)" : "translateY(-50%)"
          } `,
          zIndex: 1,
        }}
        onClick={onClick}
      >
        <IoIosArrowBack color={"#1C2F40"} size={24} />
      </div>
    );
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    initialSlide: 0,
    arrows: true,
    draggable: false,
    swipe: false,
    nextArrow: <CustomNextArrowBtn />,
    prevArrow: <CustomPrevArrowBtn />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Fragment>
      <div className='relative mt-8 2xl:pl-4 xl:pl-4 lg:pl-4 md:pl-4 pl-0'>
        <Slider ref={sliderRef} {...settings} className={className}>
          {data?.map((value, index) => {
            return (
              <div
                key={`business-slider-${index}`}
                className={`rounded-lg ${
                  data?.startUp?.status === StartupStatus.SOLD
                    ? `${
                        localStorageLanguage === "eng"
                          ? "bg-sold-out-img-eng"
                          : "bg-sold-out-img-ar"
                      } bg-no-repeat bg-center bg-[length:250px_120px]`
                    : `bg-c_FFFFFF`
                } p-6 w-72`}
                style={{ boxShadow: `7px 4px 15px -1px rgba(0, 0, 0, 0.03)` }}
                id={index}
              >
                <BusinessSliderCard
                  key={`business-slider-${index}`}
                  value={value}
                  loadingGetPromoted={loadingGetPromoted}
                  handlerCheckStartupBeforeNavigate={
                    handlerCheckStartupBeforeNavigate
                  }
                  showInfoIconModal={showInfoIconModal}
                  setShowInfoIconModal={setShowInfoIconModal}
                />
              </div>
            );
          })}
        </Slider>
      </div>
    </Fragment>
  );
};
export default BusinessSlides;
