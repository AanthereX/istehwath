/** @format */

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Button, Divider, PasswordInput, TextInput } from "../FormComponents";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SelectInput from "../FormComponents/Select";
import { Images } from "../../assets/images";
import { Icons } from "../../assets/icons";
import { SCREENS } from "../../Router/routes.constants";
import { checkInternetConnection, kFormatter } from "../../constants/validate";
import { postPromoCodeAction } from "../../Store/actions/subscription";
import useLocalStorage from "react-use-localstorage";

export default function DraftModal({
  isOpen,
  setIsOpen = () => {},
  children,
  title,
  tagLine,
  seasonLogo,
  openTitle,
  promoPackage,
  modalDialogClassName = "",
  promoPrice,
  priceText,
}) {
  const { confirm, cancel, visa } = Images;
  const dispatch = useDispatch();
  const { rejectIcon, crossIcon } = Icons;
  const Labels = useSelector((state) => state?.Language?.labels);
  const [promoCode, setPromoCode] = useState("");
  const navigation = useNavigate();
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [promoPayment, setPromoPayment] = useState(false);
  const [promoPaid, setPromoPaid] = useState(false);
  const [status, setStatus] = useState(false);
  const [defaultNum, setDefaultNum] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const role = localStorage.getItem("role");
  const [discountPrice, setDiscountPrice] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [promoCodeSubmit, setPromoCodeSubmit] = useState(false);
  const [promoCodeSubmited, setPromoCodeSubmited] = useState("");
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  useEffect(() => {
    setTotalAmount(priceText);
  }, []);

  const handleAddPromoCode = useCallback(async () => {
    // eslint-disable-next-line no-extra-boolean-cast
    if (Boolean(checkInternetConnection(Labels))) {
      const params = {
        code: promoCode,
      };
      dispatch(
        postPromoCodeAction(
          params,
          (res) => {
            setPromoCodeSubmit(true);
            setPromoCodeSubmited(promoCode);
            if (res?.data?.promoCode?.discountType === "percentage") {
              const discountedPrice =
                (res?.data?.promoCode?.discountValue / 100) * Number(priceText);
              if (discountedPrice <= 0) {
                setTotalAmount(0);
                setDiscountPrice(priceText);
              } else {
                const discount = Number(discountedPrice);
                setDiscountPrice(discount);
                setTotalAmount(discount);
              }
              setPromoCode("");
            } else {
              const discount =
                Number(priceText) - Number(res?.data?.promoCode?.discountValue);
              if (discount <= 0) {
                setTotalAmount(0);
                setDiscountPrice(priceText);
              } else {
                setDiscountPrice(discount);
                setTotalAmount(discount);
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

  const handleClear = () => {
    setPromoCode("");
    setPromoCodeSubmit(false);
    setTotalAmount(priceText);
    setPromoCodeSubmited("");
    setDiscountPrice("");
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
                  <div className='text-lg bg-c_292929 flex w-full justify-center flex-col'>
                    <img src={seasonLogo} className='' />

                    <div className='mt-10 md:!w-[54ch] w-full'>
                      <span className='text-black font-general_semiBold text-4xl'>
                        {title}
                      </span>
                    </div>

                    <div className='mt-2 md:!w-[54ch] w-full'>
                      <span className='text-black font-general_light text-base'>
                        {tagLine}
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
                  {openTitle == "password" && (
                    <div className='xl:p-10 py-10 px-2'>
                      <div className='mt-10'>
                        <TextInput placeholder={Labels.oldPassword} />
                      </div>
                      <div className='mt-10'>
                        <PasswordInput placeholder={Labels.newPassword} />
                      </div>
                      <div className='mt-10'>
                        <PasswordInput placeholder={Labels.confirmPassword} />
                      </div>
                      <div className='flex justify-center gap-3 md:flex-row flex-col mt-10'>
                        <div className=''>
                          <Button
                            variant='secondary'
                            className='min-w-[169px] '
                            onClick={() => setIsOpen(false)}
                          >
                            {Labels.cancel}
                          </Button>
                        </div>
                        <div className=''>
                          <Button
                            onClick={() => setConfirmPassword(!confirmPassword)}
                            className='min-w-[169px]'
                          >
                            {Labels.save}
                          </Button>
                          {confirmPassword && (
                            <DraftModal
                              isOpen={confirmPassword}
                              setIsOpen={setConfirmPassword}
                              openTitle='confirmPassword'
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {openTitle == "confirmPassword" && (
                    <div className='xl:p-10 py-10 px-2'>
                      <div className='my-4 flex justify-center items-center'>
                        <img src={confirm} alt='Confirm Password' />
                      </div>

                      <div className='flex flex-col gap-3 mt-8'>
                        <span className='text-fs_36 font-general_semiBold'>
                          {" "}
                          {Labels.passwordChanged}
                        </span>
                        <span className='text-c_7C7C7C text-fs_16'>
                          {Labels.yourPasswordHasBeenChangedSuccessfully}
                        </span>
                      </div>
                    </div>
                  )}
                  {openTitle == "language" && (
                    <div className='xl:p-10 py-10 px-2'>
                      <div className='my-8'>
                        <SelectInput placeholder={Labels.english} />
                      </div>
                      <div className='flex justify-center gap-8 mt-8 md:flex-row flex-col'>
                        <div className=''>
                          <Button
                            variant='secondary'
                            className='min-w-[169px] '
                            onClick={() => setIsOpen(false)}
                          >
                            {Labels.cancel}
                          </Button>
                        </div>
                        <div className=''>
                          <Button
                            onClick={() =>
                              navigation(`${SCREENS.buyerSetting}`)
                            }
                            className='min-w-[169px]'
                          >
                            {Labels.save}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  {openTitle == "rejected" && (
                    <>
                      <div className='flex items-center text-start gap-4'>
                        <div>
                          <img src={cancel} />
                        </div>
                        <div>
                          <span className='text-fs_24 font-general_semiBold'>
                            {Labels.rejectedError}
                          </span>
                        </div>
                      </div>

                      <div className='text-start mt-6'>
                        <span className='text-fs_16 font-general_medium text-c_181818'>
                          {Labels.reasonByAdmin}
                        </span>
                      </div>

                      <div className='bg-c_f9f9f9 text-start mt-6 p-3'>
                        <div>
                          <span className='text-start text-fs_20 font-general_semiBold'>
                            {Labels.rejectionTitle}
                          </span>
                        </div>
                        <div>
                          <span>{Labels.rejectionDescription}</span>
                        </div>
                      </div>
                      <div className='flex gap-3 md:flex-row flex-col mt-4'>
                        <div className=''>
                          <Button
                            onClick={() =>
                              navigation(`${SCREENS.buyerSetting}`)
                            }
                            className='min-w-[169px]'
                          >
                            {Labels.contactUs}
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                  {openTitle == "promo" && (
                    <>
                      <div className='promo_box flex justify-between items-center p-6 mt-6 '>
                        <span className='text-c_FEFEFE text-fs_18 font-general_semiBold'>
                          {promoPackage}
                        </span>
                        <span className='text-c_FEFEFE text-fs_18 font-general_regular'>
                          {promoPrice}
                        </span>
                      </div>

                      <div className='grid grid-cols-4 gap-x-3 mt-4'>
                        <div className='col-span-3 items-start justify-start'>
                          <TextInput
                            label={Labels.promoCode}
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            placeholder={Labels.promoHere}
                            className='w-full border-[0.8px] px-3.5 py-[11px] border-c_535353 rounded-lg mt-2'
                          />
                        </div>
                        <div className='flex md:flex-row flex-col mt-5 justify-end'>
                          <div className='flex justify-center items-center'>
                            <Button
                              isLoading={isLoading}
                              onClick={handleAddPromoCode}
                              className='min-w-[150px] mt-2.5'
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
                              <span className='text-fs_16 font-general_light text-c_181818'>
                                {Labels.promoCode}
                              </span>
                              <div className='flex items-center'>
                                <span className='text-fs_16 font-general_light text-c_18181'>
                                  {promoCodeSubmited}
                                </span>
                                <button
                                  className='text-red-500 text-fs_12 ml-2'
                                  onClick={handleClear}
                                >
                                  {Labels.clear}
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
                          <span className='text-fs_16 font-general_light text-c_181818'>
                            {Labels.price}
                          </span>
                          <span className='text-fs_16 font-general_light text-c_18181'>{`${
                            promoPrice || 0
                          }`}</span>
                        </div>
                        <Divider />
                        <div className='flex justify-between items-center my-4'>
                          <span className='text-fs_16 font-general_light text-c_181818'>
                            {Labels.promoDiscount}
                          </span>
                          <span className='text-fs_16 font-general_light text-c_18181'>{`${
                            discountPrice || 0
                          } ${Labels.sar}`}</span>
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
                      <div className='flex justify-center gap-3 md:flex-row flex-col mt-10'>
                        <div className=''>
                          <Button
                            variant='secondary'
                            className='min-w-[169px] '
                            onClick={() => setIsOpen(false)}
                          >
                            {Labels.back}
                          </Button>
                        </div>
                        <div className=''>
                          <Button
                            onClick={() => setPromoPayment(!promoPayment)}
                            className='min-w-[169px]'
                          >
                            {Labels.pay} {`${totalAmount} ${Labels.sar}`}
                          </Button>
                          {promoPayment && (
                            <DraftModal
                              isOpen={promoPayment}
                              setIsOpen={setPromoPayment}
                              openTitle='Payment method'
                              title={Labels.paymentMethod}
                              promoPackage={promoPackage}
                              promoPrice={promoPrice}
                            />
                          )}
                        </div>
                      </div>
                    </>
                  )}
                  {openTitle == "Payment method" && (
                    <div>
                      <div className='promo_box flex justify-between items-center p-6 mt-6 '>
                        <span className='text-c_FEFEFE text-fs_18 font-general_semiBold'>
                          {promoPackage}
                        </span>
                        <span className='text-c_FEFEFE text-fs_18 font-general_regular'>
                          {promoPrice}
                        </span>
                      </div>
                      <div className='mt-4 text-right'>
                        <span className='text-c_181818 fs-'>
                          {Labels.totalPricePromoCode}
                        </span>
                        <Divider />
                      </div>

                      <div className='text-start mt-6'>
                        <span className='text-fs_18 font-general_semiBold'>
                          {Labels.addNewCard}
                        </span>
                        <div className='mt-6'>
                          <TextInput
                            placeholder={Labels.cardNum}
                            label={Labels.cardLabel}
                          />
                        </div>
                      </div>
                      <div className='mt-6'>
                        <img src={visa} alt='visa-card' />
                      </div>

                      <div className='flex justify-between items-center mt-6 gap-3'>
                        <div className='w-full'>
                          <TextInput label={Labels.expiryDate} />
                        </div>

                        <div className='w-full'>
                          <TextInput label={Labels.securityCode} />
                        </div>
                      </div>

                      <div>
                        <div className='w-full'>
                          <TextInput label={Labels.billingAddress} />
                        </div>

                        <div className='w-full'>
                          <TextInput label={Labels.countryRegion} />
                        </div>
                      </div>

                      <div className='flex justify-center gap-3 md:flex-row flex-col mt-10'>
                        <div className=''>
                          <Button
                            variant='secondary'
                            className='min-w-[169px] '
                            onClick={() => setIsOpen(false)}
                          >
                            {Labels.back}
                          </Button>
                        </div>
                        <div className=''>
                          <Button
                            onClick={() => setPromoPaid(!promoPaid)}
                            className='min-w-[169px]'
                          >
                            {Labels.promoPay}
                          </Button>
                          {promoPaid && (
                            <DraftModal
                              isOpen={promoPaid}
                              setIsOpen={setPromoPaid}
                              openTitle='congrats promo'
                              promoPackage={promoPackage}
                              promoPrice={promoPrice}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {openTitle == "congrats promo" && (
                    <div className='xl:p-10 py-10 px-2'>
                      <div className='my-4 flex justify-center items-center'>
                        <img src={confirm} alt='Confirm Password' />
                      </div>

                      <div className='flex flex-col gap-3 mt-8'>
                        <span className='text-fs_36 font-general_semiBold'>
                          {" "}
                          {Labels.congratulation}
                        </span>
                        <span className='text-fs_24 font-general_medium'>
                          {Labels.yourStartupPromotedForDays}
                        </span>
                      </div>

                      <div className='flex justify-center gap-3 md:flex-row flex-col mt-10'>
                        <div className=''>
                          <Button
                            variant='secondary'
                            className='min-w-[169px] '
                            onClick={() => setIsOpen(false)}
                          >
                            {Labels.okay}
                          </Button>
                        </div>
                        <div className=''>
                          <Button
                            onClick={() =>
                              navigation(
                                `${
                                  role === "buyer"
                                    ? SCREENS.buyerStartupDetail
                                    : SCREENS.sellerStartupDetail
                                }`,
                              )
                            }
                            className='min-w-[169px]'
                          >
                            {Labels.viewListing}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  {openTitle == "buyer reject" && (
                    <div className='xl:p-10 py-10 px-2'>
                      <div className='my-4 flex justify-center items-center'>
                        <img src={rejectIcon} alt='Reject Icon' />
                      </div>

                      <div className='flex flex-col gap-3 mt-4'>
                        <span className='text-fs_32 font-general_semiBold'>
                          {" "}
                          {Labels.rejectRequest}
                        </span>
                        <span className='text-fs_16 text-c_181818 font-general_medium'>
                          {Labels.rejectTagline}
                        </span>
                      </div>

                      <div className='flex justify-center gap-3 md:flex-row flex-col mt-10'>
                        <div className=''>
                          <Button
                            variant='secondary'
                            className='min-w-[169px] '
                            onClick={() => setIsOpen(false)}
                          >
                            {Labels.cancel}
                          </Button>
                        </div>
                        <div className=''>
                          <Button
                            onClick={() => {
                              setStatus(!status);
                            }}
                            className='min-w-[169px]'
                          >
                            {Labels.yesReject}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  {openTitle == "buyer accept" && (
                    <div className='xl:p-10 py-6 px-10'>
                      <div className='justify-center gap-3 md:flex-row flex-col'>
                        <div className=''>
                          <Button
                            className='min-w-[169px]'
                            onClick={() => setDefaultNum(!defaultNum)}
                          >
                            {Labels.sendDefaultPhone}
                          </Button>
                          {defaultNum && (
                            <DraftModal
                              isOpen={defaultNum}
                              setIsOpen={setDefaultNum}
                              openTitle='default number'
                              title={Labels.sendDetailsToBuyer}
                              tagLine={Labels.sendPhoneNumber}
                            />
                          )}
                        </div>
                        <div className='mt-4'>
                          <Button
                            onClick={() => {
                              setStatus(!status);
                            }}
                            className='min-w-[169px]'
                          >
                            {Labels.sendOtherPhone}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  {openTitle == "default number" && (
                    <div className='xl:p-10 py-6 px-10'>
                      <div className='justify-center gap-3 md:flex-row flex-col'>
                        <div className=''>
                          <TextInput placeholder='Enter Phone Number' />
                        </div>
                        <div className='mt-4'>
                          <Button
                            onClick={() => {
                              setIsDone(!isDone);
                            }}
                            className='min-w-[169px]'
                          >
                            {Labels.sendOtherPhone}
                          </Button>

                          {isDone && (
                            <DraftModal
                              isOpen={isDone}
                              setIsOpen={setIsDone}
                              openTitle='Phone selected'
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {openTitle == "Phone selected" && (
                    <div className='xl:p-10 py-10 px-2'>
                      <div className='my-4 flex justify-center items-center'>
                        <img src={confirm} alt='Confirm Password' />
                      </div>

                      <div className='flex flex-col gap-3 '>
                        <span className='text-fs_36 font-general_semiBold'>
                          {" "}
                          {Labels.detailsSendToBuyer}
                        </span>
                        <span className='text-c_7C7C7C text-fs_16'>
                          {Labels.yourDetailSend}
                        </span>
                      </div>
                    </div>
                  )}
                  {openTitle == "confirmPayment" && (
                    <div className='xl:p-10 py-10 px-2'>
                      <div className='my-8 flex justify-center items-center'>
                        <img src={confirm} alt='Confirm Email' />
                      </div>

                      <div className='flex flex-col gap-3'>
                        <span className='text-fs_36 font-general_semiBold'>
                          {Labels.congratulation}
                        </span>
                        <span className='text-c_7C7C7C text-fs_16'>
                          {Labels.yourProfileIsPlatinum}
                        </span>
                      </div>

                      <div className='flex justify-center items-center mt-6'>
                        <div className='justify-center gap-3 md:flex-row flex-col'>
                          <div className='mt-4'>
                            <Button
                              onClick={() =>
                                navigation(
                                  `${
                                    role === "buyer"
                                      ? SCREENS.buyerStartupDetail
                                      : SCREENS.sellerStartupDetail
                                  }`,
                                )
                              }
                              className='min-w-[169px]'
                            >
                              {Labels.viewUpdatedListing}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {children ? <div className='p-6 my-4'>{children}</div> : null}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
