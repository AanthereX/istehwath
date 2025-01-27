/** @format */

import { useState, useEffect } from "react";
import useLocalStorage from "react-use-localstorage";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Images } from "../../../assets/images";
import CommonLayout from "../CommonLayout/CommonLayout";
import { getHireExpertAction } from "../../../Store/actions/HireExpert";
import { DynamicRoutes, Roles } from "../../../constants/constant";
import Skeleton from "react-loading-skeleton";
import moment from "moment";
import NoDataAvailable from "../../../Components/NoDataAvailable";
import ApiLoader from "../../../Components/Spinner/ApiLoader";
import SkeletonLoader from "../../../Components/SkeletonLoader";

const HireExpert = () => {
  const { nexttab, nextgold } = Images;
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const Labels = useSelector((state) => state?.Language?.labels);
  const [loading, setLoading] = useState(false);
  const [apiHit, setApiHit] = useState(false);
  const [experts, setExperts] = useState([]);
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  useEffect(() => {
    handleGetHireExpert();
  }, []);

  const handleGetHireExpert = () => {
    getHireExpertAction(
      (res) => {
        setExperts(res);
      },
      setLoading,
      setApiHit,
    );
  };

  return (
    <CommonLayout>
      <div
        className={
          "min-h-screen mx-auto !max-w-[1600px] w-full pt-2 pb-6 px-6 md:px-10 lg:px-24"
        }
      >
        <div className={"flex justify-center items-center"}>
          <span className={"text-fs_40 font-general_semiBold"}>
            {Labels.hireExperts}
          </span>
        </div>
        {experts?.length > 1 ? (
          <div className='mt-10 flex justify-start items-center'>
            <span className='text-fs_32 font-general_semiBold'>
              {Labels.whatHelpYouNeed}
            </span>
          </div>
        ) : (
          <></>
        )}

        {experts?.length < 1 && !loading && !!apiHit ? (
          <NoDataAvailable text={Labels.noExpertsAvailableAtTheMoment} />
        ) : (
          <></>
        )}

        <div className='w-full grid grid-cols-12 md:gap-10 gap-y-4 mt-10'>
          {experts
            ?.sort((a, b) => moment(b?.createdAt) - moment(a?.createdAt))
            ?.map((expert) => {
              return (
                <div
                  key={`${expert?.id}`}
                  className='w-full main_box md:col-span-6 col-span-12 flex justify-between items-center gap-8 md:p-8 p-4'
                >
                  <div className='flex flex-col justify-between items-start gap-y-3.5'>
                    <SkeletonLoader
                      width={300}
                      height={20}
                      loading={loading}
                      borderRadius={"0.75rem"}
                    >
                      <span className='text-fs_24 font-general_semiBold capitalize'>
                        {localStorageLanguage === "eng"
                          ? expert?.title.length > 28
                            ? `${expert?.title.slice(0, 28)}...`
                            : expert?.title
                          : expert?.title_ar?.length > 28
                          ? `${expert?.title_ar?.slice(0, 28)}...`
                          : expert?.title_ar}
                      </span>
                    </SkeletonLoader>

                    <SkeletonLoader
                      width={180}
                      height={20}
                      loading={loading}
                      borderRadius={"0.75rem"}
                    >
                      <span className='text-c_737373 text-fs_16'>
                        {localStorageLanguage === "eng"
                          ? expert?.description.length > 90
                            ? `${expert?.description.slice(0, 90)}..`
                            : expert?.description
                          : expert?.description_ar?.length > 90
                          ? `${expert?.description_ar?.slice(0, 90)}..`
                          : expert?.description_ar}
                      </span>
                    </SkeletonLoader>
                  </div>

                  <SkeletonLoader
                    width={50}
                    height={50}
                    loading={loading}
                    borderRadius={"0.75rem"}
                  >
                    <button
                      onClick={() =>
                        navigate(
                          `${
                            role === "buyer"
                              ? `${DynamicRoutes.buyerHireForm}/${expert?.id}`
                              : `${DynamicRoutes.sellerHireForm}/${expert?.id}`
                          }`,
                        )
                      }
                      className={`mt-auto cursor-pointer w-[49px] h-[49px] min-h-[49px] min-w-[49px] ${
                        localStorageLanguage === "eng" ? "" : "rotate-180"
                      }`}
                    >
                      <img
                        src={role === Roles.BUYER ? nextgold : nexttab}
                        alt={"forwardicon"}
                      />
                    </button>
                  </SkeletonLoader>
                </div>
              );
            })}
        </div>
      </div>
    </CommonLayout>
  );
};

export default HireExpert;
