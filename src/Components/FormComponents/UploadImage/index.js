/**
 * eslint-disable react/prop-types
 *
 * @format
 */

/**
 * eslint-disable react/prop-types
 *
 * @format
 */

/**
 * eslint-disable react/prop-types
 *
 * @format
 */

import { useRef } from "react";
import { Images } from "../../../assets/images";
import { useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";
import { Oval } from "react-loader-spinner";

export default function UploadImage({
  value,
  loading,
  onChange,
  handleRemoveImageObj,
  uploadFileLoader,
}) {
  const Labels = useSelector((state) => state?.Language?.labels);
  const { UploadImg } = Images;
  const profilePicRef = useRef(null);

  const handleRemove = () => {
    if (profilePicRef.current) {
      profilePicRef.current.value = "";
    }
    handleRemoveImageObj();
  };

  const handleClick = () => {
    profilePicRef.current.click();
  };

  return (
    <div className='w-full flex flex-row justify-between items-center gap-10 mb-1'>
      <div className='w-full flex flex-grow flex-row gap-4 items-center justify-start'>
        {loading ? (
          <Skeleton
            circle
            height={90}
            width={90}
            duration={2}
            enableAnimation={true}
          />
        ) : value && uploadFileLoader ? (
          <Oval
            height={80}
            width={80}
            color='#1C2F40'
            wrapperStyle={{}}
            wrapperClass=''
            visible={true}
            ariaLabel='oval-loading'
            secondaryColor='#1C2F40'
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        ) : (
          <div className=''>
            <div className='flex justify-center items-center'>
              <img
                className='!w-[72px] md:!w-[89px] !h-[72px] md:!h-[89px] border border-c_1F3A52 rounded-full object-cover'
                accept={"image/jpeg, image/png"}
                src={
                  value?.profilePictureURL || value?.profilePicture || UploadImg
                }
              />
            </div>
          </div>
        )}
        <span className='block md:hidden lg:block font-general_medium text-fs_16 text-c_181818'>
          {Labels.profilePicture}
        </span>
      </div>
      <div>
        <span
          className={`${
            value?.profilePicture || value?.profilePictureURL
              ? "text-c_FF3333"
              : "text-c_0E73D0"
          } cursor-pointer capitalize font-general_medium text-fs_16`}
          onClick={
            value?.profilePicture || value?.profilePictureURL
              ? handleRemove
              : handleClick
          }
        >
          {value?.profilePicture || value?.profilePictureURL
            ? Labels.remove
            : Labels.upload}
        </span>
        <div>
          <input
            type={"file"}
            accept={"image/*"}
            onChange={onChange}
            ref={profilePicRef}
            hidden
          />
        </div>
      </div>
    </div>
  );
}
