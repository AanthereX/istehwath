/**
 * eslint-disable react/prop-types
 *
 * @format
 */

import { memo } from "react";
import { Divider } from "./FormComponents";
import { useSelector } from "react-redux";
// import { formatDate } from "../constants/validate.js";
import Skeleton from "react-loading-skeleton";
import moment from "moment";
import useLocalStorage from "react-use-localstorage";

const ProfileInfoTable = ({ userDetail, loading }) => {
  const Labels = useSelector((state) => state?.Language?.labels);
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  return (
    <div className='my-6'>
      <>
        <ul className='grid grid-cols-12 mt-5'>
          <li className='col-span-5 flex justify-start text-c_b7b7b7 text-fs_16 font-general-light'>
            {Labels.firstName}
          </li>

          {/* {console.log(userDetail, "userDetail")} */}

          {loading ? (
            <Skeleton
              width={100}
              height={20}
              duration={2}
              enableAnimation={true}
              borderRadius={"0.55rem"}
            />
          ) : (
            <li className='col-span-7 flex md:justify-start justify-end items-center text-c_050405 text-fs_16 font-general-light'>
              {[null, undefined, ""].includes(userDetail?.firstName)
                ? Labels.notAvailable
                : userDetail?.firstName?.length > 20
                ? `${userDetail?.firstName?.slice(0, 19)}...`
                : userDetail?.firstName}
            </li>
          )}
        </ul>
        <div className='my-5'>
          <Divider />
        </div>
      </>
      <>
        <ul className='grid grid-cols-12 mt-5'>
          <li className='col-span-5 flex justify-start items-center text-c_b7b7b7 text-fs_16 font-general-light'>
            {Labels.lastName}
          </li>

          {loading ? (
            <Skeleton
              width={100}
              height={20}
              duration={2}
              enableAnimation={true}
              borderRadius={"0.55rem"}
            />
          ) : (
            <li className='col-span-7 flex md:justify-start justify-end items-center text-c_050405 text-fs_16 font-general-light'>
              {[null, undefined, ""].includes(userDetail?.lastName)
                ? Labels.notAvailable
                : userDetail?.lastName?.length > 20
                ? `${userDetail?.lastName?.slice(0, 19)}...`
                : userDetail?.lastName}
            </li>
          )}
        </ul>
        <div className='my-5'>
          <Divider />
        </div>
      </>
      <>
        <ul className='grid grid-cols-12 mt-5'>
          <li className='col-span-5 flex flex-grow justify-start text-c_b7b7b7 text-fs_16 font-general-light'>
            {Labels.phoneNumber}
          </li>

          {loading ? (
            <Skeleton
              width={100}
              height={20}
              duration={2}
              enableAnimation={true}
              borderRadius={"0.55rem"}
            />
          ) : (
            <li
              className={`col-span-7 flex flex-grow ${
                localStorageLanguage === "eng" ? "md:justify-start" : ""
              }  justify-end items-center text-c_050405 text-fs_16 font-general-light ${
                localStorageLanguage === "ar" ? "ltr-only" : ""
              }`}
            >
              {[null, undefined, ""].includes(userDetail?.phone)
                ? Labels.notAvailable
                : `${userDetail?.phone}`}
            </li>
          )}
        </ul>
        <div className='my-5'>
          <Divider />
        </div>
      </>
      <>
        <ul className='grid grid-cols-12 mt-5'>
          <li className='flex col-span-4 justify-start text-c_b7b7b7 whitespace-nowrap text-fs_16 font-general-light'>
            {Labels.emailAddress}
          </li>

          {loading ? (
            <Skeleton
              width={100}
              height={20}
              duration={2}
              enableAnimation={true}
              borderRadius={"0.55rem"}
            />
          ) : (
            <li
              className={`${
                localStorageLanguage === "eng" ? "pl-7" : "pr-7"
              } col-span-8 flex md:justify-start justify-end items-center text-c_050405 text-fs_16 font-general-light`}
            >
              {[null, undefined, ""].includes(userDetail?.email)
                ? Labels.notAvailable
                : userDetail?.email}
            </li>
          )}
        </ul>
        <div className='my-5'>
          <Divider />
        </div>
      </>
      <>
        <ul className='grid grid-cols-12 mt-5'>
          <li className='col-span-5 flex justify-start text-c_b7b7b7 text-fs_16 font-general-light'>
            {Labels.dateOfBirth}
          </li>

          {loading ? (
            <Skeleton
              width={100}
              height={20}
              duration={2}
              enableAnimation={true}
              borderRadius={"0.55rem"}
            />
          ) : (
            <li className='col-span-7 flex md:justify-start justify-end items-center text-c_050405 text-fs_16 font-general-light'>
              {[null, undefined, ""].includes(userDetail?.dateOfBirth)
                ? Labels.notAvailable
                : moment(userDetail?.dateOfBirth).format("DD MMMM YYYY")}
            </li>
          )}
        </ul>
        <div className='my-5'>
          <Divider />
        </div>
      </>
      <>
        <ul className='grid grid-cols-12 mt-5'>
          <li className='col-span-5 flex justify-start text-c_b7b7b7 text-fs_16 font-general-light'>
            {Labels.role}
          </li>

          {loading ? (
            <Skeleton
              width={100}
              height={20}
              duration={2}
              enableAnimation={true}
              borderRadius={"0.55rem"}
            />
          ) : (
            <li className='col-span-7 flex md:justify-start justify-end items-center text-c_050405 text-fs_16 font-general-light'>
              {[null, undefined, ""].includes(userDetail?.role)
                ? Labels.notAvailable
                : userDetail?.role}
            </li>
          )}
        </ul>
        <div className='my-5'>
          <Divider />
        </div>
      </>
      <>
        <ul className='grid grid-cols-12 mt-5'>
          <li className='col-span-5 flex justify-start text-c_b7b7b7 text-fs_16 font-general-light'>
            {Labels.city}
          </li>

          {loading ? (
            <Skeleton
              width={100}
              height={20}
              duration={2}
              enableAnimation={true}
              borderRadius={"0.55rem"}
            />
          ) : (
            <li className='col-span-7 flex md:justify-start justify-end items-center text-c_050405 text-fs_16 font-general-light'>
              {!!userDetail?.city
                ? `${
                    localStorageLanguage === "eng"
                      ? userDetail?.city?.name
                      : userDetail?.city?.name_ar
                  }`
                : Labels.notAvailable || Labels.notAvailable}
            </li>
          )}
        </ul>
        <div className='my-5'>
          <Divider />
        </div>
      </>
      <>
        <ul className='grid grid-cols-12 mt-5'>
          <li className='col-span-5 flex justify-start text-c_b7b7b7 text-fs_16 font-general-light'>
            {Labels.country}
          </li>

          {loading ? (
            <Skeleton
              width={100}
              height={20}
              duration={2}
              enableAnimation={true}
              borderRadius={"0.55rem"}
            />
          ) : (
            <li className='col-span-7 flex md:justify-start justify-end items-center text-c_050405 text-fs_16 font-general-light'>
              {!!userDetail?.country
                ? `${
                    localStorageLanguage === "eng"
                      ? userDetail?.country?.name
                      : userDetail?.country?.name_ar
                  }`
                : Labels.notAvailable || Labels.notAvailable}
            </li>
          )}
        </ul>
      </>
    </div>
  );
};

export default memo(ProfileInfoTable);
