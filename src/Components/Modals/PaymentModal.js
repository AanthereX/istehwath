/** @format */

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Icons } from "../../assets/icons";
import { useDispatch, useSelector } from "react-redux";
import { checkInternetConnection, getEnvVariable, kFormatter } from "../../constants/validate";
import { postPromoCodeAction } from "../../Store/actions/subscription";
import { Button, Divider, TextInput } from "../FormComponents";
import { useNavigate, useParams } from "react-router-dom";
import { addPromotedBusinessAction } from "../../Store/actions/Startup";
import { Images } from "../../assets/images";
import { SCREENS } from "../../Router/routes.constants";
import { DynamicRoutes } from "../../constants/constant";
import { VITE_APP_BASE_URL } from "../../constants/url";
import { PLATFORMS } from "./../../constants/constant";
import useLocalStorage from "react-use-localstorage";

const PaymentModal = ({
  isOpen,
  setIsOpen = () => {},
  title,
  promoPackage,
  modalDialogClassName = "",
  promoPrice,
  priceText,
  promoPackageId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const role = localStorage.getItem("role");
  const [discountPrice, setDiscountPrice] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [promoCodeSubmit, setPromoCodeSubmit] = useState(false);
  const [promoCodeSubmited, setPromoCodeSubmited] = useState("");
  const [promoCodeId, setPromoCodeId] = useState("");
  const [paid, setPaid] = useState(null);
  const [step, setStep] = useState(1);
  const [discountAmount, setDiscountAmount] = useState("");
  const [discountType, setDiscountType] = useState(null);
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const Labels = useSelector((state) => state?.Language?.labels);
  const { crossIcon } = Icons;
  const { confirm } = Images;
  const navigate = useNavigate();
  let script;
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  useEffect(() => {
    script = document.createElement("script");
    script.src = "https://cdn.moyasar.com/mpf/1.12.0/moyasar.js";
    script.onload = () => {
      Moyasar.init({
        element: ".mysr-form",
        amount: Math.round(Number(totalAmount) * 100),
        currency: "SAR",
        description: promoPackage,
        publishable_api_key: getEnvVariable('VITE_APP_PUBLISH_KEY'),
        callback_url:
          role === "buyer"
            ? `${VITE_APP_BASE_URL}/buyer/startup-detail/${
                params?.id
              }?promoteId=${promoPackageId}&promoCodeId=${
                promoCodeSubmit ? promoCodeId : ""
              }`
            : `${VITE_APP_BASE_URL}/seller/startup-detail/${
                params?.id
              }?promoteId=${promoPackageId}&promoCodeId=${
                promoCodeSubmit ? promoCodeId : ""
              }`,
        methods: ["creditcard"],
      });
    };
    document.head.appendChild(script);
  }, [step]);

  useEffect(() => {
    setTotalAmount(priceText);
  }, []);

  const handleAddPromoCode = useCallback(async () => {
    // eslint-disable-next-line no-extra-boolean-cast
    if (Boolean(checkInternetConnection(Labels))) {
      const params = {
        code: promoCode,
        platform: PLATFORMS.WEB,
        promoteId: promoPackageId,
        isPromotion: true,
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
                (res?.data?.discountValue / 100) * Number(priceText);
              if (discountedPrice <= 0) {
                setTotalAmount(0);
                setDiscountPrice(priceText);
              } else {
                const discount = Number(discountedPrice);
                setDiscountPrice(discount.toFixed(2));
                setTotalAmount((Number(priceText) - discount).toFixed(2));
              }
              setPromoCode("");
            } else {
              const discount =
                Number(priceText) - Number(res?.data?.discountValue);
              if (discount <= 0) {
                setTotalAmount(0);
                setDiscountPrice(priceText.toFixed(2));
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
  }, [
    promoCode,
    setIsLoading,
    dispatch,
    Labels,
    promoPrice,
    setTotalAmount,
    setDiscountPrice,
    setPromoCodeSubmit,
  ]);

  const handleAddPurchase = () => {
    const payload = {
      platform: "web",
      discountPrice: 0,
      startUpId: params?.id,
      promoCodeId: promoCodeSubmit ? promoCodeId : "",
      promoteId: promoPackageId,
    };
    dispatch(
      addPromotedBusinessAction(
        payload,
        (res) => {
          setPaid(res?.data);
        },
        setLoader,
        localStorageLanguage,
      ),
    );
  };

  const handleClear = () => {
    setPromoCode("");
    setPromoCodeSubmit(false);
    setTotalAmount(priceText);
    setPromoCodeSubmited("");
    setDiscountPrice("");
    setDiscountAmount("");
    setDiscountType(null);
  };

  return (
    <>
      <Transition appear show={Boolean(isOpen)} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={() => {}}>
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
          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center bg-c_7A7A7A bg-opacity-[70%]'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel
                  className={`p-5 transform bg-c_FEFEFE rounded-3xl text-center align-middle shadow-xl transition-all ${modalDialogClassName}`}
                >
                  {!!paid ? (
                    <>
                      <div className='text-lg bg-c_292929 md:!w-[60ch] flex w-full justify-center flex-col'>
                        <div className='my-8 flex justify-center items-center'>
                          <img src={confirm} alt='Confirm Email' />
                        </div>

                        <div className='flex flex-col gap-3 w-full'>
                          <span className='text-fs_36 font-general_semiBold'>
                            {Labels.congratulation}
                          </span>
                          <span className='text-black font-general_medium text-fs_24 block mt-2'>
                            {paid?.days !== 0
                              ? `${Labels.yourBusinessHasBeenPromotedFor} ${paid?.days} ${Labels.days}`
                              : Labels.notAvailable}
                          </span>
                        </div>
                      </div>
                      <div className='top-0 right-0 absolute pt-4 pr-4'>
                        <button
                          type='button'
                          className='rounded-md bg-transparent hover:outline-none focus:outline-none'
                          onClick={() =>
                            navigate(
                              role === "buyer"
                                ? SCREENS.buyerMarketplace
                                : SCREENS.sellerListing,
                            )
                          }
                        >
                          <span className='sr-only'>Close</span>
                          <img
                            src={crossIcon}
                            className='absolute h-3.5 w-3.5 right-4 top-4 cursor-pointer'
                          />
                        </button>
                      </div>
                      <div className='flex justify-center gap-3 md:flex-row flex-col mt-10'>
                        <div className=''>
                          <Button
                            variant='secondary'
                            className='min-w-[169px] '
                            onClick={() =>
                              navigate(
                                role === "buyer"
                                  ? SCREENS.buyerMarketplace
                                  : SCREENS.sellerListing,
                              )
                            }
                          >
                            {Labels.okay}
                          </Button>
                        </div>
                        <div className=''>
                          <Button
                            onClick={() => {
                              navigate(
                                role === "buyer"
                                  ? `${DynamicRoutes.buyerStartupDetails}/${params.id}`
                                  : `${DynamicRoutes.sellerStartupDetails}/${params.id}`,
                              );
                            }}
                            className={"min-w-[169px]"}
                          >
                            {Labels.viewListing}
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className='text-lg bg-c_292929 flex w-full justify-center flex-col'>
                        <div className='mt-10 md:!w-[54ch] w-full'>
                          <span className='text-black font-general_semiBold text-4xl'>
                            {step === 1 ? title : Labels.paymentMethod}
                          </span>
                        </div>
                      </div>
                      <div className='top-0 right-0 absolute hidden pt-4 pr-4 sm:block'>
                        <button
                          type='button'
                          className='rounded-md bg-transparent hover:outline-none focus:outline-none'
                          onClick={() => setIsOpen(false)}
                        >
                          <span className='sr-only'>Close</span>
                          <img
                            src={crossIcon}
                            className='absolute h-3.5 w-3.5 right-4 top-4 cursor-pointer'
                          />
                        </button>
                      </div>
                      <>
                        <div
                          className={
                            "promo_box_premium flex justify-between items-center p-6 mt-6"
                          }
                        >
                          <span className='text-c_FEFEFE text-fs_18 font-general_semiBold'>
                            {promoPackage}
                          </span>
                          <span className='text-c_FEFEFE text-fs_18 font-general_regular'>
                            {promoPrice}
                          </span>
                        </div>
                        {step === 2 ? (
                          <>
                            <div className='flex my-2.5 justify-end items-enx`x`d'>
                              <span className='text-fs_14 font-general_medium text-c_181818'>
                                {Labels.totalPricePromoCode}
                              </span>
                            </div>
                            <Divider />
                          </>
                        ) : null}

                        {step === 1 ? (
                          <>
                            <div className='grid grid-cols-12 gap-x-3 mt-4'>
                              <div className='col-span-8 md:col-span-9 flex flex-col items-start justify-start'>
                                <TextInput
                                  label={Labels.promoCode}
                                  value={promoCode}
                                  onChange={(e) => setPromoCode(e.target.value)}
                                  placeholder={Labels.promoHere}
                                  className='w-full border-[0.8px] px-3.5 py-[11px] border-c_535353 rounded-lg mt-2'
                                />
                              </div>
                              <div className='col-span-4 md:col-span-3 flex md:flex-row flex-col mt-[20px] md:mt-[28px] justify-end'>
                                <div className='flex justify-center items-center'>
                                  <Button
                                    isLoading={isLoading}
                                    onClick={handleAddPromoCode}
                                    className={
                                      "md:min-w-[150px] min-w-[100px] mt-2.5"
                                    }
                                  >
                                    {Labels.apply}
                                  </Button>
                                </div>
                              </div>
                            </div>
                            <div className='text-start mt-4'>
                              <span className='text-fs_18 font-general_semiBold block mb-4'>
                                {Labels.priceDetails}
                              </span>
                              {promoCodeSubmit ? (
                                <>
                                  <div className='flex justify-between items-center my-4'>
                                    <span className='text-fs_16 font-general_regular text-c_181818'>
                                      {Labels.promoCode}
                                    </span>
                                    <div className='flex items-center'>
                                      <span className='text-fs_16 font-general_regular text-c_18181'>
                                        {promoCodeSubmited}
                                      </span>
                                      <button
                                        className={`text-red-500 text-fs_12 ${
                                          localStorageLanguage === "eng"
                                            ? "ml-2"
                                            : "mr-2"
                                        } capitalize`}
                                        onClick={handleClear}
                                      >
                                        {Labels.remove}
                                      </button>
                                    </div>
                                  </div>
                                  <Divider />
                                </>
                              ) : null}
                              <div
                                className={`flex justify-between items-center ${
                                  promoCodeSubmit ? "my-4" : "mb-4"
                                }`}
                              >
                                <span className='text-fs_16 font-general_regular text-c_181818'>
                                  {Labels.price}
                                </span>
                                <span className='text-fs_16 font-general_regular text-c_18181'>{`${
                                  promoPrice || 0
                                }`}</span>
                              </div>
                              <Divider />
                              <div className='flex justify-between items-center my-4'>
                                <span className='text-fs_16 font-general_regular text-c_181818'>
                                  {Labels.promoDiscount}
                                </span>
                                <span
                                  dir={"ltr"}
                                  className='text-fs_16 font-general_regular text-c_18181'
                                >{`${!!discountAmount ? discountAmount : 0} ${
                                  discountType === "percentage"
                                    ? "%"
                                    : Labels.sar
                                }`}</span>
                              </div>
                              <Divider />
                              <div className='flex justify-between mt-4'>
                                <span className='text-c_181818 text-fs_16 font-general_semiBold'>
                                  {Labels.totalAmount}
                                </span>
                                <span className='text-c_181818 text-fs_16 font-general_semiBold'>
                                  {`${totalAmount || 0} ${Labels.sar}`}
                                </span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div>
                            <link
                              rel='stylesheet'
                              href='https://cdn.moyasar.com/mpf/1.12.0/moyasar.css'
                            />
                            <div className='mysr-form mt-5'></div>
                          </div>
                        )}
                        <div className='flex justify-center gap-3 md:flex-row flex-col mt-10'>
                          <div>
                            <Button
                              variant='secondary'
                              className='min-w-[169px] '
                              onClick={() => {
                                if (step === 1) {
                                  setIsOpen(false);
                                  return;
                                }
                                setStep((prev) => prev - 1);
                              }}
                            >
                              {Labels.back}
                            </Button>
                          </div>
                          {step === 1 ? (
                            <div>
                              <Button
                                onClick={() => {
                                  if (totalAmount <= 0) {
                                    handleAddPurchase();
                                    return;
                                  }
                                  setStep((prev) => prev + 1);
                                }}
                                isLoading={loader}
                                disabled={loader}
                                className={"min-w-[169px]"}
                              >
                                {Labels.pay} {`${Labels.sar} ${totalAmount}`}
                              </Button>
                            </div>
                          ) : null}
                        </div>
                      </>
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default PaymentModal;
