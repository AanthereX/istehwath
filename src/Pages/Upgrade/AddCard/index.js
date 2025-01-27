/** @format */

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Divider } from "../../../Components/FormComponents";
import { VITE_APP_BASE_URL } from "../../../constants/url";
import { SubscriptionTypes } from "../../../constants/constant";
import { getEnvVariable } from "../../../constants/validate";

const AddCard = ({
  title,
  priceKey,
  styleBox,
  textColor,
  name,
  totalAmount,
  promoPackageId,
  promoCodeId,
  promoCodeSubmit,
  selectedPlan,
  discountPrice,
  type,
}) => {
  const Labels = useSelector((state) => state.Language.labels);

  let script;

  useEffect(() => {
    script = document.createElement("script");
    script.src = "https://cdn.moyasar.com/mpf/1.12.0/moyasar.js";
    script.onload = () => {
      Moyasar.init({
        element: ".mysr-form",
        amount: Number(totalAmount) * 100,
        currency: "SAR",
        description: name,
        publishable_api_key: getEnvVariable('VITE_APP_PUBLISH_KEY'),
        callback_url: `${VITE_APP_BASE_URL}/buyer/upgrade?subscriptionId=${promoPackageId}&promoCodeId=${
          promoCodeSubmit ? promoCodeId : ""
        }&subscriptionName=${name}&type=${type}`,
        methods: ["creditcard"],
        credit_card: {
          save_card: true,
        },
        on_completed: function (payment) {
          return new Promise(function (resolve, reject) {
            localStorage.setItem("payment_token", payment?.source?.token);
            resolve();
          });
        },
      });
    };
    document.head.appendChild(script);
  }, []);

  return (
    <div className={`${styleBox}`}>
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
        <span className={`text-${textColor}`}>{title}</span>
        <span
          className={`text-${textColor}`}
        >{`${totalAmount} ${Labels.sar}`}</span>
      </div>

      <div className='text-end mt-4'>
        <span className='text-fs_14 font-general_normal font-normal text-c_181818'>
          {Labels.totalPricePromoCode}
        </span>
        <div className='my-5'>
          <Divider />
        </div>
      </div>

      <div>
        <div>
          <link
            rel='stylesheet'
            href='https://cdn.moyasar.com/mpf/1.12.0/moyasar.css'
          />
          <div className='mysr-form mt-5'>
            <span className='text-center block text-fs_12 text-[rgba(7,89,133,1)] font-general_medium font-medium'>
              {Labels.saveCardInformation}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCard;
