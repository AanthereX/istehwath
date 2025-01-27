/** @format */

import moment from "moment";
import { DealStatus, FileTypes, Roles } from "../constants/constant";
import { Images } from "../assets/images";

const getFileTypeByUrl = (url) => {
  const value = url?.split(".");
  return value[value.length - 1];
};

const getFileTypeIcon = (value) => {
  const { attachmentImg } = Images;
  return getFileTypeByUrl(value) === FileTypes.PDF
    ? attachmentImg
    : [FileTypes.DOC, FileTypes.DOCX].includes(getFileTypeByUrl(value))
    ? attachmentImg
    : attachmentImg;
};

const getFileNameByUrl = (url) => {
  const value = url?.split("/");
  return value[value.length - 1];
};

const getPrimaryColor = (role, buyerColor = "bg-c_BDA585", sellerColor) => {
  return `${role === Roles.BUYER ? buyerColor : sellerColor}`;
};

function getFileExtension(url) {
  const fileName = url.split("/").pop();
  const fileExtension = fileName.split(".").pop().toLowerCase();
  return fileExtension;
}

const checkStartupStatus = (status, StartupStatus, Labels) => {
  return status === StartupStatus.ACCEPTED
    ? Labels.accepted
    : status === StartupStatus.UNDERREVIEW
    ? Labels.underReview
    : status === StartupStatus.DENIED
    ? Labels.rejected
    : status === StartupStatus.DRAFT
    ? Labels.draft
    : status === StartupStatus.ALL
    ? ""
    : Labels.sold;
};

const checkDealsStatus = (status, StartupStatus, Labels) => {
  return status === DealStatus.APPROVED
    ? Labels.approved
    : status === DealStatus.FAVORITE
    ? Labels.favorite
    : status === DealStatus.INITIATED
    ? Labels.requested
    : status === StartupStatus.ALL
    ? ""
    : "";
};

const getMaxSubscription = (localStorageLanguage, userSubscriptions) => {
  const subscriptionPriority =
    localStorageLanguage === "eng"
      ? ["Basic", "Premium", "Platinum"]
      : ["بلاتينيوم", "بريميوم", "أساسي"];

  let maxSubscription = null;

  userSubscriptions?.forEach((subscriptionObj) => {
    if (!!subscriptionObj?.status) {
      const subscriptionName =
        localStorageLanguage === "eng"
          ? subscriptionObj?.subscription?.name
          : subscriptionObj?.subscription?.name_ar;
      if (
        !maxSubscription ||
        subscriptionPriority?.trim()?.indexOf(subscriptionName) >
          subscriptionPriority?.trim()?.indexOf(maxSubscription)
      ) {
        maxSubscription = subscriptionName;
      }
    }
  });
  return maxSubscription;
};

const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

const getQueryParams = (queryString) => {
  const params = {};
  const queryStringWithoutQuestionMark = queryString.substring(1);
  const keyValuePairs = queryStringWithoutQuestionMark.split("&");

  keyValuePairs.forEach((pair) => {
    const [key, value] = pair.split("=");
    params[key] = decodeURIComponent(value);
  });

  return params;
};

const cleanEmptyProperty = (obj) => {
  for (var propName in obj) {
    if (obj[propName] === "" || obj[propName] === undefined) {
      delete obj[propName];
    }
  }
  return obj;
};

export const hideUserEmailExcludingDomain = (email) => {
  if (!email) return "";
  const [user, domain] = email.split("@");
  const maskedUser = user.slice(0, 2) + "*".repeat(user.length - 2);
  return `${maskedUser}@${domain}`;
};

export const formatNumberToUSLocale = (num) => {
  const value = Number(num);
  return new Intl.NumberFormat("en-US").format(value);
};

const findValueMethod = (array, value, Labels) => {
  if (value === "dateFounded") {
    let data = array?.find((item) => item?.data?.type === value)?.fieldDetail
      ?.data;
    const hide = array?.find((item) => item?.data?.type === value)?.data
      ?.isHide;
    return {
      value: data?.value
        ? moment(data?.value).format("DD MMM YYYY")
        : Labels.notAvailable,
      isHide: hide,
    };
  }
  const hide = array?.find((item) => item?.data?.type === value)?.data;
  return {
    value: array?.find((item) => item?.data?.type === value)?.fieldDetail?.data,
    isHide: hide,
  };
};

export {
  getFileTypeByUrl,
  getFileTypeIcon,
  getFileNameByUrl,
  checkStartupStatus,
  classNames,
  checkDealsStatus,
  getQueryParams,
  getFileExtension,
  cleanEmptyProperty,
  findValueMethod,
  getMaxSubscription,
  getPrimaryColor,
};
