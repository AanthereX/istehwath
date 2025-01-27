/** @format */

import React, { memo, Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useSelector } from "react-redux";
import { Button, SelectInput } from "../../Components/FormComponents";
import { Icons } from "../../assets/icons";
import useLocalStorage from "react-use-localstorage";
import {
  countriesConstant,
  countriesConstantArabic,
  promotedSelectInputOptions,
  promotedSelectInputOptionsArabic,
} from "../../constants/constant";
import { getAllCities } from "../../Store/actions/Startup";

const FilterModal = ({
  filterModalOpen = false,
  setFilterModalOpen = () => {},
  businessTypes = [],
  setBusinessType,
  handleApply,
  businessCategories,
  setBusinessCategory,
  location,
  setLocation,
  country,
  setCountry,
  selectedBusinessType,
  selectedBusinessCategory,
  promotion,
  setPromotion,
  setPageBuyerLogs,
  setValues,
}) => {
  const { crossIcon } = Icons;
  const Labels = useSelector((state) => state?.Language?.labels);
  const [locationKey, setLocationKey] = useState("");
  const [businessCategoryKey, setBusinessCategoryKey] = useState(null);
  const [promotionCategoryKey, setPromotionCategoryKey] = useState(null);
  const [businessTypeKey, setBusinessTypeKey] = useState(null);
  const [countryTypeKey, setCountryTypeKey] = useState(null);
  const [cities, setCities] = useState([]);
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  useEffect(() => {
    setLocationKey(location);
    setCountryTypeKey(country);
    setBusinessCategoryKey(selectedBusinessCategory);
    setPromotionCategoryKey(promotion);
    setBusinessTypeKey(selectedBusinessType);
  }, []);

  const handleGetAllCitiesForFilter = () => {
    getAllCities(countryTypeKey?.value, (res) => {
      setCities(res);
    });
  };

  useEffect(() => {
    if (!!countryTypeKey?.value) {
      handleGetAllCitiesForFilter();
    }
  }, [countryTypeKey]);

  return (
    <React.Fragment>
      <Transition.Root show={filterModalOpen} as={Fragment}>
        <Dialog
          as='div'
          className={"relative z-10"}
          onClose={setFilterModalOpen}
        >
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div
              className={"fixed inset-0 bg-c_121516/80 transition-opacity"}
            />
          </Transition.Child>

          <div
            className={
              "fixed inset-0 z-10 overflow-y-auto overflow-scroll-hidden"
            }
          >
            <div
              className={
                "flex min-h-full items-center justify-center p-4 text-center sm:items-center"
              }
            >
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                enterTo='opacity-100 translate-y-0 sm:scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              >
                <Dialog.Panel className='relative w-full md:w-fit overflow-scroll-hidden overflow-y-auto modaal_box transform overflow-hidden bg-c_FFFFFF text-left transition-all'>
                  <div className='bg-c_FFFFFF md:py-4 md:px-8 py-2 px-4'>
                    <div className='relative'>
                      <img
                        src={crossIcon}
                        className={`absolute h-3 w-3 top-2 ${
                          localStorageLanguage === "eng"
                            ? "md:-right-2 right-0"
                            : "md:-left-2 left-0"
                        } cursor-pointer`}
                        onClick={() => setFilterModalOpen(false)}
                      />
                    </div>
                    <p className='md:my-6 my-10 text-center text-c_000000 text-fs_36 font-general_semiBold font-semibold'>
                      {Labels.filter}
                    </p>
                    <div className='w-full flex flex-col items-center justify-center gap-y-4'>
                      <div className='w-full flex flex-col gap-y-1'>
                        <label
                          className={`text-fs_16 text-c_000000 font-general_medium ${
                            localStorageLanguage === "eng"
                              ? "text-left"
                              : "text-right"
                          }`}
                        >
                          {Labels.country}
                        </label>
                        <SelectInput
                          placeholder={Labels.select}
                          className={"md:w-[350px] w-full"}
                          options={
                            localStorageLanguage === "eng"
                              ? countriesConstant
                              : countriesConstantArabic
                          }
                          value={countryTypeKey}
                          onChange={(e) => {
                            setCountryTypeKey(e);
                          }}
                        />
                      </div>
                      <div className='w-full flex flex-col gap-y-1'>
                        <label
                          className={`text-fs_16 text-c_000000 font-general_medium ${
                            localStorageLanguage === "eng"
                              ? "text-left"
                              : "text-right"
                          }`}
                        >
                          {Labels.city}
                        </label>
                        <SelectInput
                          placeholder={Labels.city}
                          className={"md:w-[350px] w-full"}
                          options={cities?.map((item) => {
                            return {
                              label:
                                localStorageLanguage === "eng"
                                  ? item?.name
                                  : item?.name_ar,
                              value: item?.id,
                            };
                          })}
                          value={locationKey}
                          onChange={(e) => {
                            setLocationKey(e);
                          }}
                        />
                      </div>
                      <div className='w-full flex flex-col gap-y-1'>
                        <label
                          className={`text-fs_16 text-c_000000 font-general_medium ${
                            localStorageLanguage === "eng"
                              ? "text-left"
                              : "text-right"
                          }`}
                        >
                          {Labels.businessType}
                        </label>
                        <SelectInput
                          placeholder={Labels.select}
                          className={"md:w-[350px] w-full"}
                          options={businessTypes}
                          value={businessTypeKey}
                          onChange={(e) => {
                            setBusinessTypeKey(e);
                          }}
                        />
                      </div>
                      <div className='w-full flex flex-col gap-y-1'>
                        <label
                          className={`text-fs_16 text-c_000000 font-general_medium ${
                            localStorageLanguage === "eng"
                              ? "text-left"
                              : "text-right"
                          }`}
                        >
                          {Labels.businessCategory}
                        </label>

                        <SelectInput
                          placeholder={Labels.select}
                          options={businessCategories}
                          onChange={(e) => setBusinessCategoryKey(e)}
                          value={businessCategoryKey}
                          className={"md:w-[350px] w-full"}
                        />
                      </div>
                      <div className='w-full flex flex-col gap-y-1'>
                        <label
                          className={`text-fs_16 text-c_000000 capitalize font-general_medium ${
                            localStorageLanguage === "eng"
                              ? "text-left"
                              : "text-right"
                          }`}
                        >
                          {Labels.promoted}
                        </label>

                        <SelectInput
                          placeholder={Labels.select}
                          options={
                            localStorageLanguage === "eng"
                              ? promotedSelectInputOptions
                              : promotedSelectInputOptionsArabic
                          }
                          onChange={(e) => setPromotionCategoryKey(e)}
                          value={promotionCategoryKey}
                          className={"md:w-[350px] w-full"}
                        />
                      </div>
                    </div>

                    <div className='md:py-6 pt-2 pb-2.5 px-0 md:mt-3 mt-4'>
                      <div className='flex justify-between md:gap-x-3 gap-x-1'>
                        <Button
                          variant='secondary'
                          className='md:!px-16 md:!py-2 px-12 py-2'
                          onClick={() => {
                            setFilterModalOpen(false);
                            setLocationKey("");
                            setBusinessType(null);
                            setLocation("");
                            setCountry("");
                            setCountryTypeKey(null);
                            setBusinessCategoryKey(null);
                            setPromotionCategoryKey(null);
                            setBusinessTypeKey(null);
                            setBusinessCategory(null);
                            setPromotion(null);
                            setValues((prev) => ({
                              ...prev,
                              filterPrice: "",
                              filterRevenue: "",
                              filterDateOfListing: "",
                            }));
                          }}
                        >
                          {Labels.clear}
                        </Button>
                        <Button
                          className='md:!px-16 md:!py-2 px-12 py-2'
                          onClick={() => {
                            setPageBuyerLogs(1);
                            setLocation(locationKey);
                            setBusinessType(businessTypeKey);
                            setBusinessCategory(businessCategoryKey);
                            setPromotion(promotionCategoryKey);
                            setCountry(countryTypeKey);
                            handleApply();
                          }}
                        >
                          {Labels.apply}
                        </Button>
                      </div>
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

export default memo(FilterModal);
