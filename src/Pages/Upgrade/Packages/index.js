/**
 * eslint-disable react/prop-types
 *
 * @format
 */

import { Button, Divider } from "../../../Components/FormComponents";
import { useSelector } from "react-redux";
import { Icons } from "../../../assets/icons";
import { useEffect, useState } from "react";
import { checkSubcritpionPurchase } from "../../../Store/actions/Startup";
import { getSingleUser } from "../../../Store/actions/users";
import toast from "react-hot-toast";
import useLocalStorage from "react-use-localstorage";
import { SubscriptionTypes } from "../../../constants/constant";
import CompleteProfileModal from "../../../Components/Modals/CompleteProfileModal";

export const Packages = ({
  title,
  priceKey,
  textColor,
  styleBox,
  setStep,
  hideButton,
  btnClassName,
  className,
  selectedPlan,
  setSelectedPlan,
  list,
  step,
  item,
  isBasicPlan = false,
  isPlatinumPlan = false,
  priceYearlyOrMonthly,
  yearlyOrMonthly,
  webPriceYearlyDiscounted,
  webPriceMonthlyDiscounted,
}) => {
  const { checkWhite, checkNewIcon } = Icons;
  const [loader, setLoader] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const Labels = useSelector((state) => state?.Language?.labels);
  const [userSubs, setUserSubs] = useState(null);
  const [user, setUser] = useState(null);
  const userStorage = JSON.parse(localStorage.getItem("user"));
  const [showCompleteProfileModal, setShowCompleteProfileModal] =
    useState(false);

  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  useEffect(() => {
    getSingleUser(
      userStorage?.id,
      (res) => {
        setUser(res);
        setUserSubs(res?.userSubscriptions);
      },
      setUserLoading,
    );
  }, []);

  return (
    <div className={`${styleBox} ${className} flex flex-col justify-between`}>
      <div>
        <div className={`flex justify-between items-center`}>
          <span
            className={`text-fs_24 bg-transparent font-general_semiBold text-${textColor}`}
          >
            {title}
          </span>
        </div>

        <div className='my-5'>
          <Divider />
        </div>

        <div className='mt-6 flex flex-col justify-evenly items-start'>
          <ul className=''>
            {list?.map((item, index) => (
              <li className='flex items-start gap-4 my-4' key={index}>
                <img
                  alt={"checkMark"}
                  className={"mt-[5px]"}
                  src={
                    isPlatinumPlan ||
                    selectedPlan?.name === SubscriptionTypes.PLATINUM
                      ? checkNewIcon
                      : checkNewIcon
                  }
                />
                <div
                  className={`text-fs_20 font-general_regular font-normal text-${textColor}`}
                >
                  <p className={`capitalize text-${textColor}`}>{item}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isBasicPlan ? null : (
        <div className='w-full flex justify-start items-start gap-3 md:flex-row flex-col'>
          <div className='w-full grid grid-cols-2 flex justify-between items-center'>
            <div className='col-span-1'>
              <Button
                isLoading={loader}
                variant={""}
                spinnerColor={"#1C2F40"}
                className={`!min-w-[170px] ${hideButton}  ${btnClassName}`}
                onClick={() => {
                  if (!!user && !user?.profileCompleted) {
                    setShowCompleteProfileModal(true);
                  } else {
                    if (step === 0) {
                      const handleSubscriptionCheck = (item, _userSubs) => {
                        if (
                          _userSubs?.find((ele) => ele?.status)?.subscription
                            ?.name === SubscriptionTypes.PLATINUM &&
                          item?.name === SubscriptionTypes.PREMIUM
                        ) {
                          setStep((prev) => prev);
                          toast.error(
                            Labels.youAlreadyHaveAPlatinumSubscriptionYouCantDownGrade,
                          );
                        } else {
                          setStep((prev) => prev + 1);
                        }
                      };
                      checkSubcritpionPurchase(
                        item?.id,
                        (res) => {
                          setSelectedPlan(item);
                          handleSubscriptionCheck(item, userSubs);
                        },
                        setLoader,
                        yearlyOrMonthly,
                        localStorageLanguage,
                      );
                    }
                  }
                }}
              >
                {Labels.buyThis}
              </Button>
            </div>

            {step === 0 && yearlyOrMonthly === "yearly" ? (
              <div
                className={`col-span-1 flex flex-col items-end justify-end gap-x-2`}
              >
                <span
                  className={`text-fs_22 font-general_semiBold line-through text-${textColor}`}
                >{`${priceKey}`}</span>
                {!!webPriceYearlyDiscounted &&
                webPriceYearlyDiscounted !== 0 ? (
                  <span
                    className={`text-fs_22 font-general_semiBold text-${textColor}`}
                  >
                    {`${webPriceYearlyDiscounted} ${Labels.sar}`}
                  </span>
                ) : null}
              </div>
            ) : step === 0 && yearlyOrMonthly === "monthly" ? (
              <div
                className={`col-span-1 flex flex-col items-end justify-end gap-x-2`}
              >
                <span
                  className={`text-fs_22 font-general_semiBold ${
                    !!webPriceMonthlyDiscounted &&
                    webPriceMonthlyDiscounted !== 0
                      ? "line-through"
                      : ""
                  } text-${textColor}`}
                >{`${priceKey}`}</span>
                {!!webPriceMonthlyDiscounted &&
                webPriceMonthlyDiscounted !== 0 ? (
                  <span
                    className={`text-fs_22 font-general_semiBold text-${textColor}`}
                  >
                    {`${webPriceMonthlyDiscounted} ${Labels.sar}`}
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      )}
      {!!showCompleteProfileModal && (
        <CompleteProfileModal
          title={Labels.yourProfileIsNotCompleted}
          tagLine={
            !user?.profileCompleted
              ? Labels.yourProfileDescriptionIfProfileNotCompleted
              : Labels.yourProfileDesc
          }
          showCompleteProfileModal={showCompleteProfileModal}
          setShowCompleteProfileModal={setShowCompleteProfileModal}
          setUserDetail={setUser}
        />
      )}
    </div>
  );
};
