/** @format */

import React, { memo, Fragment, useState, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useSelector } from "react-redux";
import { Icons } from "../../assets/icons";
import useLocalStorage from "react-use-localstorage";
import Slider from "react-slick";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const InfoIconDetailsModal = ({
  open = false,
  setOpen = () => {},
  description = "",
  verifiedIcon = null,
  businessBadge = null,
  isVerified = false,
}) => {
  const { crossIcon } = Icons;
  const sliderReference = useRef(null);
  const Labels = useSelector((state) => state?.Language?.labels);
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );
  const [step, setStep] = useState(localStorageLanguage === "eng" ? 0 : 1);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    arrows: false,
    autoplay: false,
    draggable: false,
    swipe: false,
    rtl: localStorageLanguage === "eng" ? false : true,
    afterChange: (current) => setStep(current),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
    ],
  };

  return (
    <React.Fragment>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-c_121516/80 transition-opacity' />
          </Transition.Child>

          <div className='fixed inset-0 z-10 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                enterTo='opacity-100 translate-y-0 sm:scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              >
                <Dialog.Panel className='relative modaal_box bg-c_FFFFFF transform overflow-hidden text-left transition-all !w-[400px]'>
                  <div className={"bg-c_FFFFFF py-4"}>
                    <div className={"relative"}>
                      <img
                        src={crossIcon}
                        className={
                          "absolute h-3 w-3 top-0 right-4 cursor-pointer"
                        }
                        onClick={() => setOpen(false)}
                      />
                    </div>

                    <div
                      className={
                        "relative slider-container !w-full !mx-auto my-5"
                      }
                    >
                      <Slider
                        className={"!w-full"}
                        ref={sliderReference}
                        {...settings}
                      >
                        {!!isVerified && (
                          <div
                            className={`!mx-auto w-fit cursor-pointer flex items-center justify-center ${
                              localStorageLanguage === "eng"
                                ? "md:pl-6 pl-[17px]"
                                : "md:pl-6 pl-[17px]"
                            }`}
                          >
                            <img
                              src={verifiedIcon}
                              className={
                                "!w-[80px] !select-none !h-[80px] !mx-auto"
                              }
                              draggable={false}
                            />
                            <p className='w-[32ch] md:!w-[36ch] !font-general_medium !text-fs-18 !text-center select-none mt-6'>
                              {Labels.businessIsCertifiedByTheChamberOfCommerce}
                            </p>
                          </div>
                        )}
                        {!!businessBadge && (
                          <div
                            className={`!mx-auto w-fit cursor-pointer flex items-center justify-center ${
                              localStorageLanguage === "eng"
                                ? "md:pl-6 pl-[17px]"
                                : "md:pl-6 pl-[17px]"
                            }`}
                          >
                            <img
                              src={businessBadge}
                              className={
                                "!w-[80px] !h-[80px] !select-none !mx-auto"
                              }
                              draggable={false}
                            />
                            <p className='w-[32ch] md:!w-[36ch] !font-general_medium !text-fs-18 !text-center select-none mt-6'>
                              {description}
                            </p>
                          </div>
                        )}
                      </Slider>

                      {!!isVerified && !!businessBadge ? (
                        <div
                          className={`${
                            localStorageLanguage === "eng"
                              ? "!flex !flex-row"
                              : "!flex !flex-row-reverse"
                          } items-center justify-center gap-x-3 mt-6`}
                        >
                          {!!isVerified ? (
                            <div
                              id={"prev"}
                              className={`h-fit w-fit px-2 py-2 rounded-full cursor-pointer ${
                                step === 0 ? "bg-c_20415E" : "bg-c_6B6B6B"
                              }`}
                              onClick={() => {
                                sliderReference.current.slickPrev();
                              }}
                            >
                              <IoIosArrowBack color={"#FFF"} size={10} />
                            </div>
                          ) : null}
                          {!!businessBadge ? (
                            <div
                              id={"next"}
                              className={`h-fit w-fit px-2 py-2 rounded-full cursor-pointer ${
                                step === 1 ? "bg-c_20415E" : "bg-c_6B6B6B"
                              }`}
                              onClick={() => {
                                sliderReference.current.slickNext();
                              }}
                            >
                              <IoIosArrowForward color={"#FFF"} size={10} />
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </React.Fragment>
  );
};

export default memo(InfoIconDetailsModal);
