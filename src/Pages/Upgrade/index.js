/** @format */

import React, { useEffect, useState } from "react";
import CommonLayout from "../MarketPlace/CommonLayout/CommonLayout";
import { useDispatch, useSelector } from "react-redux";
import { Packages } from "./Packages";
import PaymentDetails from "./PaymentDetails";
import AddCard from "./AddCard";
import {
  getSubscriptionTypes,
  postPromoCodeAction,
} from "../../Store/actions/subscription";
import { PLATFORMS, SubscriptionTypes } from "../../constants/constant";
import { checkInternetConnection, kFormatter } from "../../constants/validate";
import useLocalStorage from "react-use-localstorage";
import { userSubscriptionAction } from "../../Store/actions/Startup";
import { getQueryParams } from "../../utils/utility";
import ConfirmPaymentModal from "../../Components/Modals/ConfirmPaymentModal";
import PaymentFailedModal from "../../Components/Modals/PaymentFailedModal";
import { useNavigate } from "react-router-dom";
import { SCREENS } from "../../Router/routes.constants";
import { Button } from "../../Components/FormComponents";
import ApiLoader from "../../Components/Spinner/ApiLoader";

const Upgrade = () => {
  const Labels = useSelector((state) => state.Language.labels);
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionType, setSubscriptionType] = useState([]);
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );
  const dispatch = useDispatch();
  const [discountPrice, setDiscountPrice] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [promoCodeSubmit, setPromoCodeSubmit] = useState(false);
  const [promoCodeSubmited, setPromoCodeSubmited] = useState("");
  const [isUpgradeSubsLoading, setIsUpgradeSubsLoading] = useState(false);
  const [promoCodeId, setPromoCodeId] = useState("");
  const [paid, setPaid] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [subscriptionName, setSubscriptionName] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [discountType, setDiscountType] = useState(null);
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [yearlyOrMonthly, setYearlyOrMonthly] = useState("monthly");
  const sortOrder =
    localStorageLanguage === "eng"
      ? ["Basic", "Premium", "Platinum"]
      : ["أساسي", "بريميوم", "بلاتينيوم"];

  // sorting the subscription
  const sortedSubscriptionType = subscriptionType?.sort((a, b) => {
    const nameA = localStorageLanguage === "eng" ? a.name : a.name_ar;
    const nameB = localStorageLanguage === "eng" ? b.name : b.name_ar;
    return sortOrder.indexOf(nameA) - sortOrder.indexOf(nameB);
  });

  useEffect(() => {
    if (selectedPlan && selectedPlan?.webPrice) {
      setTotalAmount(
        yearlyOrMonthly === "monthly" &&
          !!selectedPlan?.webPriceMonthlyDiscounted
          ? selectedPlan?.webPriceMonthlyDiscounted
          : yearlyOrMonthly === "monthly"
          ? selectedPlan?.webPriceMonthly
          : yearlyOrMonthly === "yearly" && !!selectedPlan?.webPriceDiscounted
          ? selectedPlan?.webPriceDiscounted
          : selectedPlan?.webPrice,
      );
    }
  }, [
    selectedPlan?.webPrice,
    selectedPlan?.webPriceMonthly,
    selectedPlan?.webPriceDiscounted,
    selectedPlan?.webPriceMonthlyDiscounted,
  ]);

  useEffect(() => {
    const queryString = window.location.search;
    // Call the function to get the query parameters
    const queryParams = getQueryParams(queryString);

    // Access individual parameters
    const subscriptionId = queryParams?.subscriptionId;
    const id = queryParams?.id;
    const status = queryParams?.status;
    const amount = queryParams?.amount;
    const subscriptionName = queryParams?.subscriptionName;
    const promoteId = queryParams?.promoCodeId;
    const type = queryParams?.type;

    setSubscriptionName(subscriptionName);
    // Convert amount to a number if needed
    const numericAmount = parseInt(amount, 10);
    const paymentToken = localStorage.getItem("payment_token");
    localStorage.removeItem("payment_token");
    if (status === "paid") {
      let payload;
      if (promoteId) {
        payload = {
          discountPrice: numericAmount / 100,
          subscriptionId: subscriptionId,
          promoCode: promoteId,
          transactionId: id,
          platform: "web",
          token: paymentToken,
          status: true,
          type: type,
        };
      } else {
        payload = {
          discountPrice: numericAmount / 100,
          subscriptionId: subscriptionId,
          transactionId: id,
          status: true,
          token: paymentToken,
          platform: "web",
          type: type,
        };
      }
      userSubscriptionAction(
        payload,
        (res) => {
          setPaid(true);
        },
        localStorageLanguage,
      );
    } else if (status === "failed") {
      setPaymentFailed(true);
    }
  }, []);

  const handleAddPromoCode = async () => {
    // eslint-disable-next-line no-extra-boolean-cast
    if (checkInternetConnection(Labels)) {
      const params = {
        code: promoCode,
        platform: PLATFORMS.WEB,
        // subscriptionId: selectedPlan?.id,
        isPromotion: false,
        isYearly: yearlyOrMonthly === "monthly" ? false : true,
      };
      dispatch(
        postPromoCodeAction(
          params,
          (res) => {
            setPromoCodeId(res?.data?.id);
            setPromoCodeSubmit(true);
            setPromoCodeSubmited(promoCode);
            setDiscountAmount(res?.data?.discountValue);
            setDiscountType(res?.data?.discountType);
            if (res?.data?.discountType === "percentage") {
              const discountedPrice =
                (res?.data?.discountValue / 100) *
                Number(
                  yearlyOrMonthly === "monthly"
                    ? `${
                        !!selectedPlan?.webPriceMonthlyDiscounted &&
                        selectedPlan?.webPriceMonthlyDiscounted !== 0
                          ? selectedPlan?.webPriceMonthlyDiscounted
                          : selectedPlan?.webPriceMonthly
                      }`
                    : yearlyOrMonthly === "yearly"
                    ? `${
                        !!selectedPlan?.webPriceDiscounted &&
                        selectedPlan?.webPriceDiscounted !== 0
                          ? selectedPlan?.webPriceDiscounted
                          : selectedPlan?.webPrice
                      }`
                    : "",
                );
              if (discountedPrice <= 0) {
                setTotalAmount(0);
                setDiscountPrice(
                  yearlyOrMonthly === "monthly"
                    ? `${
                        !!selectedPlan?.webPriceMonthlyDiscounted &&
                        selectedPlan?.webPriceMonthlyDiscounted !== 0
                          ? selectedPlan?.webPriceMonthlyDiscounted
                          : selectedPlan?.webPriceMonthly
                      }`
                    : yearlyOrMonthly === "yearly"
                    ? `${
                        !!selectedPlan?.webPriceDiscounted &&
                        selectedPlan?.webPriceDiscounted !== 0
                          ? selectedPlan?.webPriceDiscounted
                          : selectedPlan?.webPrice
                      }`
                    : "",
                );
              } else {
                const discount = Number(discountedPrice);
                setDiscountPrice(discount.toFixed(2));
                setTotalAmount(
                  (
                    Number(
                      yearlyOrMonthly === "monthly"
                        ? `${
                            !!selectedPlan?.webPriceMonthlyDiscounted &&
                            selectedPlan?.webPriceMonthlyDiscounted !== 0
                              ? selectedPlan?.webPriceMonthlyDiscounted
                              : selectedPlan?.webPriceMonthly
                          }`
                        : yearlyOrMonthly === "yearly"
                        ? `${
                            !!selectedPlan?.webPriceDiscounted &&
                            selectedPlan?.webPriceDiscounted !== 0
                              ? selectedPlan?.webPriceDiscounted
                              : selectedPlan?.webPrice
                          }`
                        : "",
                    ) - discount
                  ).toFixed(2),
                );
              }
              setPromoCode("");
            } else {
              const discount =
                Number(
                  yearlyOrMonthly === "monthly"
                    ? `${
                        !!selectedPlan?.webPriceMonthlyDiscounted &&
                        selectedPlan?.webPriceMonthlyDiscounted !== 0
                          ? selectedPlan?.webPriceMonthlyDiscounted
                          : selectedPlan?.webPriceMonthly
                      }`
                    : yearlyOrMonthly === "yearly"
                    ? `${
                        !!selectedPlan?.webPriceDiscounted &&
                        selectedPlan?.webPriceDiscounted !== 0
                          ? selectedPlan?.webPriceDiscounted
                          : selectedPlan?.webPrice
                      }`
                    : "",
                ) - Number(res?.data?.discountValue);
              if (discount <= 0) {
                setTotalAmount(0);
                setDiscountPrice(
                  yearlyOrMonthly === "monthly"
                    ? `${
                        !!selectedPlan?.webPriceMonthlyDiscounted &&
                        selectedPlan?.webPriceMonthlyDiscounted !== 0
                          ? selectedPlan?.webPriceMonthlyDiscounted
                          : selectedPlan?.webPriceMonthly
                      }`
                    : yearlyOrMonthly === "yearly"
                    ? `${
                        !!selectedPlan?.webPriceDiscounted &&
                        selectedPlan?.webPriceDiscounted !== 0
                          ? selectedPlan?.webPriceDiscounted
                          : selectedPlan?.webPrice
                      }`
                    : "",
                );
              } else {
                setDiscountPrice(discount.toFixed(2));
                setTotalAmount(discount.toFixed(2));
              }
              setPromoCode("");
            }
          },
          setIsLoading,
          localStorageLanguage,
        ),
      );
    }
  };

  useEffect(() => {
    handleGetSubscriptionTypes();
  }, []);

  const handleUpgrade = (subscriptionId) => {
    setIsUpgradeSubsLoading(true);
    const payload = {
      discountPrice: 0,
      subscriptionId: subscriptionId,
      status: true,
      platform: "web",
      promoCode: promoCodeSubmit ? promoCodeId : "",
    };
    userSubscriptionAction(
      payload,
      (res) => {
        setIsUpgradeSubsLoading(false);
        setPaid(true);
      },
      localStorageLanguage,
    );
  };

  const handleGetSubscriptionTypes = () => {
    getSubscriptionTypes((res) => {
      setSubscriptionType(res);
    }, setIsLoading);
  };

  return (
    <CommonLayout>
      <ApiLoader block={isLoading || isUpgradeSubsLoading}>
        <div className='mx-auto md:w-full w-full pt-2 p-4 lg:px-8'>
          <div className='flex justify-center items-center'>
            <span className='text-fs_40 font-general_semiBold'>
              {Labels.joinSubscription}
            </span>
          </div>

          {step === 0 ? (
            <div className='mx-auto w-fit flex justify-center items-center gap-x-1 bg-c_FEFEFE shadow-md py-1 px-1.5 rounded-[12px] mt-6'>
              <Button
                variant={
                  yearlyOrMonthly === "monthly" ? "primary" : "secondary-light"
                }
                className={`w-[160px] min-w-[160px] transition-all ease-in-out h-[42px] min-h-[49px] capitalize rounded-[16px] leading-5 ${
                  yearlyOrMonthly === "monthly"
                    ? `text-white`
                    : `text-c_181818 hover:opacity-80`
                } `}
                onClick={() => {
                  setYearlyOrMonthly("monthly");
                }}
              >
                <p
                  className={`w-fit text-center mx-auto font-general_regular font-normal gap-x-[10px] !text-fs_24 px-4 capitalize ${
                    yearlyOrMonthly === "monthly"
                      ? "text-white/85"
                      : "text-c_A6A6A6"
                  }`}
                >
                  {Labels.monthly}
                </p>
              </Button>
              <Button
                variant={
                  yearlyOrMonthly === "yearly" ? "primary" : "secondary-light"
                }
                className={`w-[160px] min-w-[160px] transition-all ease-in-out h-[42px] min-h-[49px] capitalize rounded-[12px] leading-5 ${
                  yearlyOrMonthly === "yearly"
                    ? `text-white`
                    : "text-c_181818 hover:opacity-80"
                } `}
                onClick={() => {
                  setYearlyOrMonthly("yearly");
                }}
              >
                <p
                  className={`w-fit text-center mx-auto font-general_regular font-normal gap-x-[10px] !text-fs_24 px-4 capitalize ${
                    yearlyOrMonthly === "yearly"
                      ? "text-white/85"
                      : "text-c_A6A6A6"
                  }`}
                >
                  {Labels.yearly}
                </p>
              </Button>
            </div>
          ) : null}

          <div className='w-full flex justify-center mt-10 md:mt-20 gap-x-6'>
            {step === 0 ? (
              <div className='w-full flex flex-col md:flex-col lg:flex-row xl:flex-row 2xl:flex-row items-center justify-center lg:gap-x-4 gap-y-6'>
                {sortedSubscriptionType?.map((item, index) => {
                  return (
                    <React.Fragment key={`subscription-${index}`}>
                      <Packages
                        item={item}
                        list={
                          localStorageLanguage === "eng"
                            ? item?.description.split(",")
                            : item?.description_ar.split("،")
                        }
                        title={
                          localStorageLanguage === "eng"
                            ? item?.name
                            : item?.name_ar
                        }
                        priceKey={
                          item?.name === "Basic" || item?.name_ar === "أساسي"
                            ? `${Labels.free}`
                            : `${
                                yearlyOrMonthly === "monthly"
                                  ? item?.webPriceMonthly
                                  : item?.webPrice
                              } ${Labels.sar}`
                        }
                        price={
                          yearlyOrMonthly === "monthly"
                            ? item?.webPriceMonthly
                            : item?.webPrice
                        }
                        priceYearlyOrMonthly={item?.webPriceMonthly}
                        textColor={
                          item?.name === SubscriptionTypes.BASIC
                            ? "c_1e374e"
                            : "c_FFFFFF"
                        }
                        styleBox={
                          item?.name === SubscriptionTypes.PREMIUM
                            ? "premium_Box"
                            : item?.name === SubscriptionTypes.PLATINUM
                            ? "platinum_Box"
                            : "basic_Box"
                        }
                        btnClassName={
                          item?.name === SubscriptionTypes.BASIC
                            ? "bg-c_1e374e text-white"
                            : "bg-c_FFFFFF text-c_1e374e"
                        }
                        className={
                          "md:w-[440px] lg:w-[310px] xl:w-[400px] 2xl:w-[440px] w-full"
                        }
                        isBasicPlan={
                          item?.name === SubscriptionTypes.BASIC ? true : false
                        }
                        isPlatinumPlan={
                          item?.name === SubscriptionTypes.PLATINUM
                            ? true
                            : false
                        }
                        step={step}
                        setStep={setStep}
                        btnBgColor={"c_FFFFFF"}
                        btnTextColor={"c_1e374e"}
                        yearlyOrMonthly={yearlyOrMonthly}
                        setSelectedPlan={setSelectedPlan}
                        webPriceYearlyDiscounted={item?.webPriceDiscounted}
                        webPriceMonthlyDiscounted={
                          item?.webPriceMonthlyDiscounted
                        }
                      />
                    </React.Fragment>
                  );
                })}
              </div>
            ) : step === 1 ? (
              <div className='flex md:flex-row flex-col items-center justify-center md:gap-x-6 gap-y-6'>
                <Packages
                  title={`${Labels.whyChoose} ${
                    localStorageLanguage === "eng"
                      ? selectedPlan?.name
                      : selectedPlan?.name_ar
                  }`}
                  textColor={"c_FFFFFF"}
                  styleBox={
                    selectedPlan?.name === SubscriptionTypes.PREMIUM
                      ? "premium_Box"
                      : "platinum_Box"
                  }
                  className={"md:w-[440px] w-full"}
                  step={step}
                  setStep={setStep}
                  hideButton={"hidden"}
                  selectedPlan={selectedPlan}
                  setSelectedPlan={setSelectedPlan}
                  list={
                    localStorageLanguage === "eng"
                      ? selectedPlan?.description.split(",")
                      : selectedPlan?.description_ar.split("،")
                  }
                  item={selectedPlan}
                  yearlyOrMonthly={yearlyOrMonthly}
                />

                <PaymentDetails
                  title={
                    localStorageLanguage === "eng"
                      ? selectedPlan?.name
                      : selectedPlan?.name_ar
                  }
                  handleAddPromoCode={handleAddPromoCode}
                  promoCode={promoCode}
                  setPromoCode={setPromoCode}
                  priceKey={
                    yearlyOrMonthly === "monthly"
                      ? `${
                          !!selectedPlan?.webPriceMonthlyDiscounted &&
                          selectedPlan?.webPriceMonthlyDiscounted !== 0
                            ? selectedPlan?.webPriceMonthlyDiscounted
                            : selectedPlan?.webPriceMonthly
                        } ${Labels.sar}`
                      : yearlyOrMonthly === "yearly"
                      ? `${
                          !!selectedPlan?.webPriceDiscounted &&
                          selectedPlan?.webPriceDiscounted !== 0
                            ? selectedPlan?.webPriceDiscounted
                            : selectedPlan?.webPrice
                        } ${Labels.sar}`
                      : ""
                  }
                  price={
                    yearlyOrMonthly === "monthly"
                      ? selectedPlan?.webPriceMonthly
                      : selectedPlan?.webPrice
                  }
                  styleBox={"payment_box"}
                  className={"md:w-[440px] w-full"}
                  textColor={"c_FFFFFF"}
                  step={step}
                  setStep={setStep}
                  selectedPlan={selectedPlan}
                  buttonLoading={isLoading}
                  promoCodeSubmit={promoCodeSubmit}
                  discountPrice={discountPrice}
                  discountAmount={discountAmount}
                  discountType={discountType}
                  totalAmount={totalAmount || "0"}
                  promoCodeSubmited={promoCodeSubmited}
                  handleUpgrade={() => handleUpgrade(selectedPlan?.id)}
                  handleClear={() => {
                    setPromoCode("");
                    setPromoCodeSubmit(false);
                    let total;
                    if (yearlyOrMonthly === "monthly") {
                      if (
                        !!selectedPlan?.webPriceMonthlyDiscounted &&
                        selectedPlan?.webPriceMonthlyDiscounted !== 0
                      ) {
                        total = selectedPlan?.webPriceMonthlyDiscounted;
                      } else {
                        total = selectedPlan?.webPriceMonthly;
                      }
                    } else if (yearlyOrMonthly === "yearly") {
                      if (
                        !!selectedPlan?.webPriceDiscounted &&
                        selectedPlan?.webPriceDiscounted !== 0
                      ) {
                        total = selectedPlan?.webPriceDiscounted;
                      } else {
                        total = selectedPlan?.webPrice;
                      }
                    }
                    setTotalAmount(total);
                    setPromoCodeSubmited("");
                    setDiscountPrice("");
                    setDiscountAmount("");
                    setDiscountType(null);
                  }}
                />
              </div>
            ) : step === 2 ? (
              <div className='flex md:flex-row flex-col items-start justify-center md:gap-x-6 gap-y-6'>
                <Packages
                  title={`${Labels.whyChoose} ${
                    localStorageLanguage === "eng"
                      ? selectedPlan?.name
                      : selectedPlan?.name_ar
                  }`}
                  list={
                    localStorageLanguage === "eng"
                      ? selectedPlan?.description.split(",")
                      : selectedPlan?.description_ar.split("،")
                  }
                  item={selectedPlan}
                  bg={"c_1e374e"}
                  textColor={"c_FFFFFF"}
                  styleBox={
                    selectedPlan?.name === SubscriptionTypes.PREMIUM
                      ? "premium_Box"
                      : "platinum_Box"
                  }
                  className={"md:w-[440px] w-full"}
                  step={step}
                  setStep={setStep}
                  hideButton={"hidden"}
                />

                <AddCard
                  type={yearlyOrMonthly}
                  title={
                    localStorageLanguage === "eng"
                      ? selectedPlan?.name
                      : selectedPlan?.name_ar
                  }
                  priceKey={
                    yearlyOrMonthly === "monthly"
                      ? `${
                          !!selectedPlan?.webPriceMonthlyDiscounted &&
                          selectedPlan?.webPriceMonthlyDiscounted !== 0
                            ? selectedPlan?.webPriceMonthlyDiscounted
                            : selectedPlan?.webPriceMonthly
                        } ${Labels.sar}`
                      : yearlyOrMonthly === "yearly"
                      ? `${
                          !!selectedPlan?.webPriceDiscounted &&
                          selectedPlan?.webPriceDiscounted !== 0
                            ? selectedPlan?.webPriceDiscounted
                            : selectedPlan?.webPrice
                        } ${Labels.sar}`
                      : ""
                  }
                  price={
                    yearlyOrMonthly === "monthly"
                      ? selectedPlan?.webPriceMonthly
                      : selectedPlan?.webPrice
                  }
                  styleBox={"payment_box"}
                  textColor={"c_FFFFFF"}
                  step={step}
                  setStep={setStep}
                  totalAmount={totalAmount}
                  selectedPlan={selectedPlan}
                  promoCodeId={promoCodeId}
                  promoPackageId={selectedPlan?.id}
                  promoCodeSubmit={promoCodeSubmit}
                  discountPrice={discountPrice}
                  name={
                    localStorageLanguage === "eng"
                      ? selectedPlan?.name
                      : selectedPlan?.name_ar
                  }
                />
              </div>
            ) : null}
          </div>
        </div>
        {paid && (
          <ConfirmPaymentModal
            showConfirmPaymentModal={paid}
            title={`${Labels.yourProfileIsPlatinum} ${
              selectedPlan
                ? localStorageLanguage === "eng"
                  ? selectedPlan?.name.toLocaleLowerCase()
                  : selectedPlan?.name_ar.toLocaleLowerCase()
                : subscriptionName?.toLocaleLowerCase()
            }`}
            setShowConfirmPaymentModal={() => {
              Number(totalAmount) === 0
                ? navigate(SCREENS.buyerMarketplace)
                : setPaid((prev) => !prev);
            }}
          />
        )}
        {paymentFailed ? (
          <PaymentFailedModal
            isOpen={paymentFailed}
            setIsOpen={setPaymentFailed}
          />
        ) : null}
      </ApiLoader>
    </CommonLayout>
  );
};

export default Upgrade;
