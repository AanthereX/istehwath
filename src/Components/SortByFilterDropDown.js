/**
 * eslint-disable react/prop-types
 *
 * @format
 */

import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useSelector } from "react-redux";
import { Divider } from "./FormComponents";
import { Icons } from "../assets/icons";
import useLocalStorage from "react-use-localstorage";
import { getPrimaryColor } from "../utils/utility";

const SortByFilterDropDown = ({
  className,
  setMenuOpen,
  menuOpen,
  setValues,
  values,
  setPageBuyerLogs,
}) => {
  const Labels = useSelector((state) => state?.Language?.labels);
  const { sortByIcon } = Icons;
  const role = localStorage.getItem("role");

  const isPriceDisabled =
    Boolean(values?.filterRevenue) || Boolean(values?.filterDateOfListing);
  const isRevenueDisabled =
    Boolean(values?.filterPrice) || Boolean(values?.filterDateOfListing);
  const isDateDisabled =
    Boolean(values?.filterPrice) || Boolean(values?.filterRevenue);
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  return (
    <>
      <Menu
        as={"div"}
        className={`${className} relative`}
        open={menuOpen}
        onClose={() => {}}
      >
        <div>
          <Menu.Button
            onClick={() => setMenuOpen((prev) => !prev)}
            className={`w-fit h-fit ${getPrimaryColor(
              role,
              "bg-c_BDA585",
              "bg-c_1F3C55",
            )}  px-[14px] py-[17px] rounded-xl relative focus:outline-none`}
          >
            <img src={sortByIcon} className={`transition-all ease-linear`} />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
        >
          <Menu.Items
            className={`absolute top-16 ${
              localStorageLanguage === "eng"
                ? " md:right-0 -right-8"
                : " md:left-0 -left-8"
            } z-10 w-[18rem] origin-top-right rounded-xl bg-c_FFFFFF py-1 shadow-lg focus:outline-none outline-none`}
          >
            <Menu.Item>
              {({ active }) => (
                <div className='w-full px-4 py-4'>
                  <p className='mb-2 capitalize font-general_medium text-c_000000 text-fs_13'>
                    {Labels.price}
                  </p>
                  <div className='flex flex-col items-start justify-center gap-y-2'>
                    <div className='flex items-start justify-center gap-x-2'>
                      <div className='my-auto'>
                        <input
                          defaultChecked={
                            values.filterPrice === "LowToHigh" ? true : false
                          }
                          className={`w-4 block h-4 mt-1 border accent-c_1C2F40 ${
                            !!isPriceDisabled
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer opacity-100"
                          } form-checkbox`}
                          disabled={isPriceDisabled}
                          type={"radio"}
                          name={"sortByPrice"}
                          id={"lowToHigh"}
                          onClick={() => {
                            setPageBuyerLogs(1);
                            setValues((prev) => ({
                              ...prev,
                              filterPrice: "LowToHigh",
                            }));
                          }}
                        />
                      </div>
                      <label
                        htmlFor={"sortByPrice"}
                        className={`${
                          !!isPriceDisabled
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer opacity-100"
                        } text-fs_16 font-general_regular ${
                          values?.filterPrice === "LowToHigh"
                            ? "text-c_000000"
                            : "text-c_ACACAC"
                        }`}
                      >
                        {Labels.lowToHigh}
                      </label>
                    </div>
                    <div
                      className={`flex items-start justify-center my-auto gap-x-2`}
                    >
                      <div className='my-auto'>
                        <input
                          defaultChecked={
                            values.filterPrice === "HighToLow" ? true : false
                          }
                          className={`w-4 block h-4 mt-1 border accent-c_1C2F40 ${
                            !!isPriceDisabled
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer opacity-100"
                          } form-checkbox`}
                          disabled={isPriceDisabled}
                          type={"radio"}
                          name={"sortByPrice"}
                          id={"highToLow"}
                          onClick={() => {
                            setPageBuyerLogs(1);
                            setValues((prev) => ({
                              ...prev,
                              filterPrice: "HighToLow",
                            }));
                          }}
                        />
                      </div>
                      <label
                        htmlFor={"sortByPrice"}
                        className={`${
                          !!isPriceDisabled
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer opacity-100"
                        } text-fs_16 font-general_regular ${
                          values?.filterPrice === "HighToLow"
                            ? "text-c_000000"
                            : "text-c_ACACAC"
                        }`}
                      >
                        {Labels.highToLow}
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </Menu.Item>
            <div className='my-[2px] px-3'>
              <Divider />
            </div>
            <Menu.Item>
              {({ active }) => (
                <div className='w-full px-4 py-4'>
                  <p className='mb-2 capitalize font-general_medium text-c_000000 text-fs_13'>
                    {Labels.revenue}
                  </p>
                  <div className='flex flex-col items-start justify-center gap-y-2'>
                    <div className='flex items-start justify-center gap-x-2'>
                      <div className='my-auto'>
                        <input
                          defaultChecked={
                            values.filterRevenue === "LowToHigh" ? true : false
                          }
                          className={`w-4 h-4 mt-1 border accent-c_1C2F40 ${
                            !!isRevenueDisabled
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer opacity-100"
                          } form-checkbox`}
                          disabled={isRevenueDisabled}
                          type={"radio"}
                          name={"sortByRevenue"}
                          id={"lowToHighRev"}
                          onClick={() => {
                            setPageBuyerLogs(1);
                            setValues((prev) => ({
                              ...prev,
                              filterRevenue: "LowToHigh",
                            }));
                          }}
                        />
                      </div>
                      <label
                        htmlFor={"sortByRevenue"}
                        className={`${
                          !!isRevenueDisabled
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer opacity-100"
                        } text-fs_16 font-general_regular ${
                          values?.filterRevenue === "LowToHigh"
                            ? "text-c_000000"
                            : "text-c_ACACAC"
                        }`}
                      >
                        {Labels.lowToHigh}
                      </label>
                    </div>
                    <div className='flex items-start justify-center gap-x-2'>
                      <div className='my-auto'>
                        <input
                          defaultChecked={
                            values.filterRevenue === "HighToLow" ? true : false
                          }
                          className={`w-4 h-4 mt-1 border accent-c_1C2F40 ${
                            !!isRevenueDisabled
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer opacity-100"
                          } form-checkbox`}
                          disabled={isRevenueDisabled}
                          type={"radio"}
                          name={"sortByRevenue"}
                          id={"highToLowRev"}
                          onClick={() => {
                            setPageBuyerLogs(1);
                            setValues((prev) => ({
                              ...prev,
                              filterRevenue: "HighToLow",
                            }));
                          }}
                        />
                      </div>
                      <label
                        htmlFor={"sortByRevenue"}
                        className={`${
                          !!isRevenueDisabled
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer opacity-100"
                        } text-fs_16 font-general_regular ${
                          values?.filterRevenue === "HighToLow"
                            ? "text-c_000000"
                            : "text-c_ACACAC"
                        }`}
                      >
                        {Labels.highToLow}
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </Menu.Item>
            <div className='my-[2px] px-3'>
              <Divider />
            </div>
            <Menu.Item>
              {({ active }) => (
                <div className='w-full px-4 py-4'>
                  <p className='mb-2 capitalize font-general_medium text-c_000000 text-fs_13'>
                    {Labels.dateOfListing}
                  </p>
                  <div className='flex flex-col items-start justify-center gap-y-2'>
                    <div className='flex items-start justify-center gap-x-2'>
                      <div className='my-auto'>
                        <input
                          defaultChecked={
                            values.filterDateOfListing === "LowToHigh"
                              ? true
                              : false
                          }
                          className={`w-4 h-4 mt-1 border accent-c_1C2F40 ${
                            !!isDateDisabled
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer opacity-100"
                          } form-checkbox`}
                          disabled={isDateDisabled}
                          type={"radio"}
                          name={"sortByDate"}
                          id={"lowToHighDate"}
                          onClick={() => {
                            setPageBuyerLogs(1);
                            setValues((prev) => ({
                              ...prev,
                              filterDateOfListing: "LowToHigh",
                            }));
                          }}
                        />
                      </div>
                      <label
                        htmlFor={"sortByDate"}
                        className={`${
                          !!isDateDisabled
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer opacity-100"
                        } text-fs_16 font-general_regular ${
                          values?.filterDateOfListing === "LowToHigh"
                            ? "text-c_000000"
                            : "text-c_ACACAC"
                        }`}
                      >
                        {Labels.lowToHigh}
                      </label>
                    </div>
                    <div className='flex items-start justify-center gap-x-2'>
                      <div className='my-auto'>
                        <input
                          defaultChecked={
                            values.filterDateOfListing === "HighToLow"
                              ? true
                              : false
                          }
                          className={`w-4 h-4 mt-1 border accent-c_1C2F40 ${
                            !!isDateDisabled
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer opacity-100"
                          } form-checkbox`}
                          disabled={isDateDisabled}
                          type={"radio"}
                          name={"sortByDate"}
                          id={"highToLowDate"}
                          onClick={() => {
                            setPageBuyerLogs(1);
                            setValues((prev) => ({
                              ...prev,
                              filterDateOfListing: "HighToLow",
                            }));
                          }}
                        />
                      </div>
                      <label
                        htmlFor={"sortByDate"}
                        className={`${
                          !!isDateDisabled
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer opacity-100"
                        } text-fs_16 font-general_regular ${
                          values?.filterDateOfListing === "HighToLow"
                            ? "text-c_000000"
                            : "text-c_ACACAC"
                        }`}
                      >
                        {Labels.highToLow}
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
};

export default SortByFilterDropDown;
