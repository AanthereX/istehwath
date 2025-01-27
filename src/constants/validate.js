/** @format */

import * as yup from "yup";
import toast from "react-hot-toast";
const profileCompletionSchema = (props) =>
  yup.object().shape({
    profileImageObj: yup
      .object({
        profilePictureURL: yup.string().optional(),
        profilePicture: yup.string().optional(),
      })
      .optional(),
    firstName: yup
      .string()
      .min(
        3,
        props?.localStorageLanguage === "eng"
          ? "First name should be at least three characters"
          : "يجب أن يتكون الاسم الأول من ثلاثة أحرف على الأقل",
      )
      .max(
        15,
        props?.localStorageLanguage === "eng"
          ? "First name should not exceed fifteen characters"
          : "يجب ألا يتجاوز الاسم الأول خمسة عشر حرفًا",
      )
      .required(
        props?.localStorageLanguage === "eng"
          ? "First name is required"
          : "الاسم الأول مطلوب",
      ),
    lastName: yup
      .string()
      .min(
        3,
        props?.localStorageLanguage === "eng"
          ? "Last name should be at least three characters"
          : "يجب أن يتكون الاسم الأخير من ثلاثة أحرف على الأقل",
      )
      .max(
        15,
        props?.localStorageLanguage === "eng"
          ? "Last name should not exceed fifteen characters"
          : "يجب ألا يتجاوز الاسم الأخير خمسة عشر حرفًا",
      )
      .required(
        props?.localStorageLanguage === "eng"
          ? "Last name is required"
          : "الاسم الأخير مطلوب",
      ),
    dateOfBirth: yup
      .string()
      .required(
        props?.localStorageLanguage === "eng"
          ? "Date of birth is required"
          : "تاريخ الميلاد حقل مطلوب",
      ),
    description: yup
      .string()
      .required(
        props?.localStorageLanguage === "eng"
          ? "Description is required"
          : "الوصف مطلوب",
      ),
    userRole: yup
      .string()
      .required(
        props?.localStorageLanguage === "eng"
          ? "User role is required"
          : "دور المستخدم مطلوب",
      ),
    // otherRole: yup
    //   .string()
    //   .when("userRole", {
    //     is: "Other", // Checks if userRole is "Other"
    //     then: yup
    //       .string()
    //       .required("Other role is required")
    //       .min(3, "Other role should be at least three characters"),
    //     otherwise: yup.string().optional(),
    //   }),
    country: yup
      .object({
        value: yup.string(),
        label: yup.string(),
      })
      .required(
        props?.localStorageLanguage === "eng"
          ? "Country is required"
          : "البلد مطلوب",
      ),
    city: yup
      .object({
        value: yup.string(),
        label: yup.string(),
      })
      .required(
        props?.localStorageLanguage === "eng"
          ? "City is required"
          : "المدينة مطلوبة",
      ),
    phone: yup
      .string()
      .min(
        8,
        props?.localStorageLanguage === "eng"
          ? "Invalid Phone No"
          : "رقم الالهاتف غير صالح",
      )
      .max(
        18,
        props?.localStorageLanguage === "eng"
          ? "Invalid Phone No"
          : "رقم الالهاتف غير صالح",
      )
      .required(
        props?.localStorageLanguage === "eng"
          ? "Phone number is required"
          : "رقم الهاتف مطلوب",
      ),
  });

const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email()
    .matches(
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
      "Invalid Email",
    )
    .required("Email is Required"),
  password: yup.string().required("Password is Required"),
});

const signUpValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email()
    .matches(
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
      "Invalid Email",
    )
    .required("Email is Required"),
  password: yup
    .string()
    .min(7, "Password must be at least 8 characters long")
    .required(),
  confirmPassword: yup
    .string()
    .required("Required Field")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

const verifyOtpSchema = yup.object().shape({
  otp: yup.string().required("Otp is required!"),
});

const forgotPasswordValidationSchema = yup.object().shape({
  email: yup.string().email("Invalid Email").required("Email is Required"),
});

const changePasswordValidationSchema = yup.object().shape({
  newPassword: yup
    .string()
    .required("Required Field")
    .min(8, "Password must be at least 8 characters long"),
  confirmNewPassword: yup
    .string()
    .required("Required Field")
    .oneOf([yup.ref("newPassword"), null], "Passwords must match"),
});

// KFormatter for number above 1000
export const kFormatter = (num) => {
  if (num >= 1000) {
    const formatted = (num / 1000).toFixed(1);
    // Check if the decimal part is ".0", and if so, remove it
    return formatted.endsWith(".0")
      ? formatted?.slice(0, -2) + "k"
      : formatted + "k";
  } else {
    return num?.toString();
  }
};

export const checkSubscriptionColor = (sub) => {
  let subTrimmed = sub?.trim();
  if (["Platinum", "بلاتينيوم"].includes(subTrimmed)) {
    return `text-[#D1B000]`;
  } else if (["Premium", "بريميوم"].includes(subTrimmed)) {
    return `text-[#1C2F40]`;
  } else {
    return `text-[#808080]`;
  }
};

const emailRegex =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const validateEmailAddress = (val, Labels, localStorageLanguage) => {
  if (val && !emailRegex.test(val)) {
    return localStorageLanguage === "eng"
      ? "Invalid email address"
      : "عنوان البريد الإلكتروني غير صالح";
  }
  return null;
};

const validateText = (val, Labels, localStorageLanguage) => {
  if (!val) {
    return localStorageLanguage === "eng"
      ? "Please fill this field"
      : "من فضلك املأ هذا الحقل";
  }
  return null;
};

const validateOnlySpace = (val, Labels) => {
  if (val.trim() === "") {
    return Labels.cantBeOnlySpaces;
  }
  return null;
};

const validateLength = (val, Labels) => {
  const trimmedVal = val.trim();

  if (trimmedVal.length < 3) {
    return Labels.minimumThreeCharactersRequired;
  }
  return null;
};

const checkInternetConnection = (Labels) => {
  if (!navigator.onLine) {
    toast?.error(Labels.noInternetConnectionFound);
  }
  return navigator.onLine;
};

const formatDate = (createdAt) => {
  const date = new Date(createdAt);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  if (hours > 12) {
    hours -= 12;
  }
  return `${day} ${month} ${year} ${hours}:${minutes} ${ampm}`;
};

export function getEnvVariable(key)
 {
  if (window?.__ENV__ && window?.__ENV__[key]) {
    return window.__ENV__[key];
  }

  // Fallback to build-time variables
  if (import.meta.env[key]) {
    return import.meta.env[key];
  }

  console.error(`Environment variable ${key} not found.`);
  return undefined;
}

export {
  validateEmailAddress,
  validateText,
  validateLength,
  validateOnlySpace,
  verifyOtpSchema,
  formatDate,
  checkInternetConnection,
  profileCompletionSchema,
  loginValidationSchema,
  signUpValidationSchema,
  forgotPasswordValidationSchema,
  changePasswordValidationSchema,
};
