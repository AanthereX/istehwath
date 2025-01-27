/**
 * eslint-disable no-extra-boolean-cast
 *
 * @format
 */

import { useSelector } from "react-redux";
import { Button, Divider, TextInput } from "../../../Components/FormComponents";
import { kFormatter } from "../../../constants/validate";
import { SubscriptionTypes } from "../../../constants/constant";
import useLocalStorage from "react-use-localstorage";

const PaymentDetails = ({
  title,
  priceKey,
  styleBox,
  textColor,
  setStep,
  className,
  selectedPlan,
  buttonLoading,
  handleAddPromoCode,
  setPromoCode,
  promoCode,
  promoCodeSubmit,
  promoCodeSubmited,
  handleClear,
  discountPrice,
  totalAmount,
  handleUpgrade,
  discountAmount = "",
  discountType = null,
}) => {
  const Labels = useSelector((state) => state.Language.labels);
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  return (
    <div className={`${styleBox} ${className}`}>
      <span className='text-fs_24 font-general_semiBold'>
        {Labels.paymentDetails}
      </span>

      <div
        className={`${
          selectedPlan?.name === SubscriptionTypes.PREMIUM
            ? "promo_box_premium"
            : "promo_box"
        } p-6 flex mt-4 justify-between items-center w-full`}
      >
        <span className={`text-c_FFFFFF`}>{title}</span>
        <span className={`text-c_FFFFFF`}>{priceKey}</span>
      </div>

      <div className='mt-3'>
        <span>{Labels.promoCode}</span>
        <div className='flex justify-center items-center gap-4'>
          <span className='mt-1'>
            <TextInput
              type={"text"}
              value={promoCode}
              className={`p-2 pl-4 font-general_medium font-normal text-fs_16 placeholder:text-c_535353 placeholder:font-general_regular placeholder:font-light text-c_181818 border rounded-xl w-full min-h-[49px] border-c_D9D9D9 focus:border-c_0E73D0 outline-none`}
              placeholder={Labels.promoCodeHere}
              onChange={(e) => setPromoCode(e.target.value)}
            />
          </span>
          <Button
            isLoading={buttonLoading}
            onClick={handleAddPromoCode}
            size={"xs"}
            className={`flex-1 ${
              selectedPlan?.name === SubscriptionTypes.PLATINUM
                ? "!bg-c_9E7C4F !text-white !border-none"
                : "bg-gradient-to-r from-c_1C2F40 to-c_20415E text-white"
            }`}
            variant={"none"}
          >
            {Labels.apply}
          </Button>
        </div>
      </div>

      <div className='mt-3'>
        <span className='text-fs_18 font-general_semiBold'>
          {Labels.priceDetails}
        </span>
        {promoCodeSubmit ? (
          <>
            <div className='flex justify-between items-center my-4'>
              <span className=''>{Labels.promoCode}</span>
              <div className='flex items-center'>
                <span className=''>{promoCodeSubmited}</span>
                <button
                  className={`text-red-500 text-fs_12 ${
                    localStorageLanguage === "eng" ? "ml-2" : "mr-2"
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
        <>
          <div className='flex justify-between items-center mt-4'>
            <span>{Labels.price}</span>
            <span>{priceKey}</span>
          </div>
          <div className='my-5'>
            <Divider />
          </div>
        </>

        <>
          <div className='flex justify-between items-center mt-4'>
            <span>{Labels.promoDiscount}</span>
            <span>
              {/* {discountPrice ? "-" : ""}{" "} */}
              {`${!!discountAmount ? discountAmount : 0} ${
                discountType === "percentage" ? "%" : Labels.sar
              }`}
            </span>
          </div>
          <div className='my-5'>
            <Divider />
          </div>
        </>
      </div>

      <div className='flex justify-between'>
        <span className='text-fs_16 font-general_semiBold'>
          {Labels.totalAmount}
        </span>
        <span dir={"ltr"} className='text-fs_16 font-general_semiBold'>
          {`${totalAmount ? totalAmount : 0} ${Labels.sar}`}
        </span>
      </div>

      <div className='flex justify-between gap-1 mt-8 md:flex-row flex-col'>
        <div>
          <Button
            variant={"secondary"}
            className={"min-w-[189px]"}
            onClick={() => {
              setStep((prev) => prev - 1);
              handleClear();
            }}
          >
            {Labels.back}
          </Button>
        </div>
        <div>
          <Button
            onClick={() => {
              if (Number(totalAmount) === 0) {
                handleUpgrade();
              } else {
                setStep((prev) => prev + 1);
              }
            }}
            className={`min-w-[189px] md:mt-0 mt-2 ${
              selectedPlan?.name === SubscriptionTypes.PLATINUM
                ? "!bg-c_9E7C4F !text-white !border-none"
                : "bg-gradient-to-r from-c_1C2F40 to-c_20415E text-white"
            }`}
            variant={"none"}
          >
            {Labels.pay} {`${totalAmount} ${Labels.sar}`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;
