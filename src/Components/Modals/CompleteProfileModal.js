/**
 * eslint-disable react/prop-types
 *
 * @format
 */

import React, {
  useRef,
  useState,
  memo,
  Fragment,
  useEffect,
  useCallback,
} from "react";
import { Dialog, Transition, Popover } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  SelectInput,
  TextArea,
  TextInput,
  UploadImage,
} from "../../Components/FormComponents";
import { Images } from "../../assets/images";
import { useNavigate } from "react-router-dom";
import {
  Roles,
  cities,
  citiesArabic,
  countriesConstant,
  countriesConstantArabic,
  userRoles,
  userRolesArabic,
} from "../../constants/constant";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import OTPInput from "otp-input-react";
import {
  checkInternetConnection,
  profileCompletionSchema,
} from "../../constants/validate";
import {
  completeUserDetailsAction,
  getSingleUser,
  uploadFile,
  verifyPhoneNumberWithOtp,
} from "../../Store/actions/users";
import toast from "react-hot-toast";
import { Icons } from "../../assets/icons";
import DatePicker from "../DatePicker";
import PhoneNumberInput from "../PhoneNumberInput";
import moment from "moment";
import useLocalStorage from "react-use-localstorage";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import lookup from "country-code-lookup";
import { userData } from "../../Store/actions/auth";
import CustomDatePicker from "../CustomDatePicker";
import { getAllCities } from "../../Store/actions/Startup";
import Flatpickr from "react-flatpickr";

const CompleteProfileModal = ({
  showCompleteProfileModal,
  setShowCompleteProfileModal,
  title,
  tagLine,
  userDetail,
  setUserDetail = () => {},
}) => {
  const { todo } = Images;
  const { crossIcon, calender } = Icons;
  const Labels = useSelector((state) => state?.Language?.labels);
  const role = localStorage.getItem("role");
  const [steps, setSteps] = useState(0);
  const user = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingGetUser, setLoadingGetUser] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [userId, setUserId] = useState("");
  const [uploadFileLoader, setUploadFileLoader] = useState(false);
  const cancelButtonRef = useRef(null);
  const [loader, setLoader] = useState(false);
  const [OTP, setOTP] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cities, setCities] = useState([]);
  const [isTermsConditionChecked, setIsTermsConditionChecked] = useState(false);
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  const handleTermsConditionCheckboxChange = () => {
    setIsTermsConditionChecked((prev) => !prev);
  };

  const {
    handleSubmit,
    setValue,
    control,
    trigger,
    formState: { errors },
    reset,
    getValues,
    clearErrors,
  } = useForm({
    resolver: yupResolver(profileCompletionSchema({ localStorageLanguage })),
    defaultValues: {
      firstName: "",
      lastName: "",
      profileImageObj: {
        profilePictureURL: "",
        profilePicture: "",
      },
      dateOfBirth: "",
      country: null,
      city: null,
      description: "",
      userRole: "",
      otherRole: "",
      phone: "",
    },
  });

  const handleGetCitiesByCountryId = () => {
    getAllCities(selectedCountry?.value, (res) => {
      setCities(
        res?.map((item) => {
          return {
            label: localStorageLanguage === "eng" ? item?.name : item?.name_ar,
            value: item?.id,
          };
        }),
      );
    });
  };

  useEffect(() => {
    if (!!selectedCountry?.value) {
      handleGetCitiesByCountryId();
    }
  }, [selectedCountry?.value]);

  useEffect(() => {
    getSingleUser(
      user?.id,
      (res) => {
        setUserDetails(res);
        setUserId(res?.id);
      },
      setLoadingGetUser,
    );
  }, []);

  useEffect(() => {
    if (userDetails && userId) {
      setValue(
        "firstName",
        userDetails?.googleId
          ? userDetails?.firstName?.split(" ")[0]
          : userDetails?.firstName,
      );
      setValue(
        "lastName",
        userDetails?.googleId
          ? userDetails?.firstName?.split(" ")[1]
          : userDetails?.lastName,
      );
      setValue(
        "dateOfBirth",
        userDetails?.dateOfBirth
          ? moment(userDetails?.dateOfBirth).format("YYYY-MM-DD")
          : "",
      );
      setValue("profilePicture", userDetails?.profilePicture);
      setValue(
        "profileImageObj.profilePictureURL",
        userDetails?.profilePicture ?? "",
      );
    }
  }, [userDetails, userId]);

  // const arabicToEnglishMappingRole = {};
  // userRolesArabic.forEach((arabicRole, index) => {
  //   arabicToEnglishMappingRole[arabicRole.value] = userRoles[index].value;
  // });
  // const arabicToEnglishMappingCity = {};
  // citiesArabic.forEach((arabicCity, index) => {
  //   arabicToEnglishMappingCity[arabicCity.value] = cities[index].value;
  // });
  // const arabicToEnglishMappingCountry = {};
  // countriesConstantArabic.forEach((arabicCountry, index) => {
  //   arabicToEnglishMappingCountry[arabicCountry.value] =
  //     countriesConstant[index].value;
  // });

  const handleSelectedChangeRole = (newValue) => {
    // if (arabicToEnglishMappingRole[newValue]) {
    //   setSelectedRole(arabicToEnglishMappingRole[newValue]);
    // } else {
    setSelectedRole(newValue);
    // }
  };
  const handleSelectedChangeCity = (newValue) => {
    // if (arabicToEnglishMappingCity[newValue]) {
    //   setSelectedCity(arabicToEnglishMappingCity[newValue]);
    // } else {
    setSelectedCity(newValue);
    // }
  };
  const handleSelectedChangeCountry = (newValue) => {
    // if (arabicToEnglishMappingCountry[newValue]) {
    //   setSelectedCountry(arabicToEnglishMappingCountry[newValue]);
    // } else {
    setSelectedCountry(newValue);
    // }
  };

  const onSubmitHandler = (data) => {
    if (!isTermsConditionChecked) {
      toast.error(Labels.pleaseCheckOurTermsAndConditionToContinue);
    } else if (Boolean(checkInternetConnection(Labels))) {
      const formData = new FormData();
      data?.phone && formData.append("phone", `${data?.phone}`);
      formData.append("firstName", data?.firstName);
      formData.append("lastName", data?.lastName);
      formData.append(
        "profilePicture",
        data?.profileImageObj?.profilePictureURL,
      );
      formData.append(
        "dateOfBirth",
        moment(data?.dateOfBirth).format("YYYY-MM-DD") ?? "",
      );
      formData.append("country", data?.country?.value);
      formData.append("city", data?.city?.value);
      formData.append("description", data?.description);
      getValues().userRole === "Other"
        ? formData.append("role", data?.otherRole)
        : formData.append("role", selectedRole);
      dispatch(
        completeUserDetailsAction(
          formData,
          navigate,
          setLoading,
          Roles,
          role,
          (res) => {
            if (res) {
              getSingleUser(
                user?.id,
                (res) => {
                  setUserDetail(res);
                  dispatch(userData(res));
                },
                setLoadingGetUser,
              );
              if (!res?.profileCompleted) {
                setSteps((prev) => prev + 1);
              }
            }
          },
          localStorageLanguage,
        ),
      );
    }
  };

  const onSubmitHandlerProfileComplete = () => {
    const formData = new FormData();
    getValues()?.phone && formData.append("phone", `${getValues()?.phone}`);
    formData.append("firstName", getValues()?.firstName);
    formData.append("lastName", getValues()?.lastName);
    formData.append(
      "profilePicture",
      getValues()?.profileImageObj?.profilePictureURL,
    );
    getValues()?.dateOfBirth &&
      formData.append(
        "dateOfBirth",
        moment(getValues()?.dateOfBirth).format("YYYY-MM-DD"),
      );
    formData.append("country", selectedCountry?.value);
    formData.append("city", getValues()?.city?.value);
    formData.append("description", getValues()?.description);
    getValues().userRole === "Other"
      ? formData.append("role", getValues()?.otherRole)
      : formData.append("role", selectedRole);

    dispatch(
      completeUserDetailsAction(
        formData,
        navigate,
        setIsLoading,
        Roles,
        role,
        (res) => {
          getSingleUser(
            user?.id,
            (res) => {
              setUserDetail(res);
              dispatch(userData(res));
            },
            setLoadingGetUser,
          );
          localStorage.setItem("user", JSON.stringify(res));
          setShowCompleteProfileModal(false);
        },
        localStorageLanguage,
      ),
    );
  };

  const handleVerifyPhoneCode = useCallback(async () => {
    if (!OTP) {
      return toast.error(Labels.pleaseFillTheOtp);
    } else if (
      !!OTP &&
      !!getValues().phone &&
      Boolean(checkInternetConnection(Labels))
    ) {
      const obj = { code: OTP, phone: getValues().phone };
      dispatch(
        verifyPhoneNumberWithOtp(
          obj,
          (res) => {
            onSubmitHandlerProfileComplete();
          },
          setLoader,
          localStorageLanguage,
        ),
      );
    }
  }, [getValues, setLoader, dispatch, OTP]);

  const handleInputChange = (field) => {
    trigger(field);
  };

  const handleUploadFile = (file) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Upload Picture Image Type Incorrect!");
      return;
    }
    setValue("profileImageObj", {
      profilePicture: file,
      profilePictureURL: URL.createObjectURL(file),
    });
    const formData = new FormData();
    formData.append("file", file);
    dispatch(
      uploadFile(
        formData,
        (res) => {
          setValue("profileImageObj.profilePictureURL", res);
        },
        setUploadFileLoader,
        Labels,
      ),
    );
  };

  return (
    <React.Fragment>
      <Transition.Root show={showCompleteProfileModal} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-10'
          initialFocus={cancelButtonRef}
          onClose={setShowCompleteProfileModal}
        >
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

          <div className='fixed inset-0 z-10 overflow-y-auto'>
            <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                enterTo='opacity-100 translate-y-0 sm:scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              >
                <Dialog.Panel
                  className={`relative transform ${
                    steps === 0
                      ? "w-fit"
                      : steps === 1
                      ? "w-full md:w-9/12"
                      : steps === 2
                      ? "w-full md:w-fit"
                      : "w-full"
                  } overflow-hidden rounded-[22px] bg-c_FFFFFF text-left shadow-xl transition-all sm:my-8`}
                >
                  <div className='relative'>
                    <img
                      src={crossIcon}
                      className='absolute h-3 w-3 top-4 right-4 cursor-pointer'
                      onClick={() => {
                        setShowCompleteProfileModal(false);
                      }}
                    />
                  </div>
                  {steps === 0 ? (
                    <div className='bg-c_FFFFFF px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
                      <div className='md:py-4 md:px-1 py-10 px-2 flex flex-col items-center justify-center gap-y-2'>
                        <img src={todo} className='h-28 w-36' alt='todoimage' />
                        <div className='flex flex-col items-center justify-center gap-y-1 mx-auto'>
                          <span className='w-full mt-2 md:w-[26ch] text-center font-general_semiBold text-fs_36 text-c_000000'>
                            {title}
                          </span>
                          <span className='w-full text-center mx-auto font-general_regular font-normal text-fs_16 text-c_000000'>
                            {tagLine}
                          </span>
                        </div>

                        <div className='flex flex-col items-center justify-center gap-y-3'>
                          <div className='px-2 pt-3 pb-2'>
                            <div className='flex justify-center gap-3 md:flex-row flex-col'>
                              <div className=''>
                                <Button
                                  variant={"secondary"}
                                  onClick={() =>
                                    setShowCompleteProfileModal(false)
                                  }
                                  className='min-w-[169px]'
                                >
                                  {Labels.cancel}
                                </Button>
                              </div>
                              <div>
                                <Button
                                  onClick={() => setSteps((prev) => prev + 1)}
                                  className='min-w-[169px]'
                                >
                                  {Labels.letsComplete}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : steps === 1 ? (
                    <form onSubmit={handleSubmit(onSubmitHandler)}>
                      <div className='completeForm_box p-4 mt-4'>
                        <div className='text-center mt-14 mb-8'>
                          <div>
                            <span className='text-fs_32 text-c_181818 font-general_semiBold'>
                              {Labels.completeProfileDetails}
                            </span>
                          </div>
                          <div>
                            <span className='text-c_181818 text-fs_16'>
                              {Labels.pleaseCompleteDetailstoAccess}
                            </span>
                          </div>
                        </div>
                        <div className='grid md:grid-cols-2 lg:px-10 md:px-5 px-2'>
                          <div className='flex flex-col gap-3 xl:p-4 md:p-2 p-1 xl:px-10 md:px-5'>
                            <Controller
                              control={control}
                              name={"profileImageObj"}
                              render={({ field: { value } }) => {
                                return (
                                  <UploadImage
                                    value={value}
                                    onChange={(e) =>
                                      handleUploadFile(e.target.files[0])
                                    }
                                    handleRemoveImageObj={() =>
                                      setValue("profileImageObj", {
                                        profilePicture: "",
                                        profilePictureURL: "",
                                      })
                                    }
                                    uploadFileLoader={uploadFileLoader}
                                  />
                                );
                              }}
                            />

                            <div className='grid grid-cols-2 gap-3'>
                              <div
                                className={
                                  "lg:col-span-1 md:col-span-2 col-span-2"
                                }
                              >
                                <Controller
                                  control={control}
                                  name='firstName'
                                  rules={{ required: true }}
                                  render={({ field: { value } }) => {
                                    return (
                                      <div>
                                        <TextInput
                                          name={"firstName"}
                                          className={`p-2 pl-4 font-general_regular font-normal text-fs_16 placeholder:text-c_535353 placeholder:font-general_regular placeholder:font-regular text-c_181818 border-[0.8px] rounded-xl w-full min-h-[49px] border-c_535353 focus:border-c_0E73D0 outline-none`}
                                          placeholder={Labels.firstName}
                                          value={value}
                                          error={Boolean(errors?.firstName)}
                                          errorText={errors.firstName?.message}
                                          onChange={(e) => {
                                            clearErrors("firstName");
                                            // handleInputChange("firstName");
                                            setValue(
                                              "firstName",
                                              e.target.value.replace(
                                                /[٠-٩۰-۹]/g,
                                                "",
                                              ),
                                            );
                                          }}
                                        />
                                      </div>
                                    );
                                  }}
                                />
                              </div>

                              <div
                                className={
                                  "lg:col-span-1 md:col-span-2 col-span-2"
                                }
                              >
                                <Controller
                                  control={control}
                                  name='lastName'
                                  render={({ field: { value } }) => {
                                    return (
                                      <TextInput
                                        name={"lastName"}
                                        className={`p-2 pl-4 font-general_regular font-normal text-fs_16 placeholder:text-c_535353 placeholder:font-general_regular placeholder:font-regular text-c_181818 border-[0.8px] rounded-xl w-full min-h-[49px] border-c_535353 outline-none`}
                                        placeholder={Labels.lastName}
                                        error={Boolean(errors?.lastName)}
                                        errorText={errors.lastName?.message}
                                        value={value}
                                        onChange={(e) => {
                                          clearErrors("lastName");
                                          // handleInputChange("lastName");
                                          setValue(
                                            "lastName",
                                            e.target.value.replace(
                                              /[٠-٩۰-۹]/g,
                                              "",
                                            ),
                                          );
                                        }}
                                      />
                                    );
                                  }}
                                />
                              </div>
                            </div>
                            <div
                              className={
                                "relative lg:col-span-2 md:col-span-2 col-span-2"
                              }
                            >
                              <Controller
                                control={control}
                                name={"dateOfBirth"}
                                rules={{ required: true }}
                                render={({ field: { value } }) => {
                                  return (
                                    <>
                                      <Popover className={"relative"}>
                                        <Popover.Button
                                          className={"w-full outline-none"}
                                        >
                                          <div className={"w-full"}>
                                            <TextInput
                                              type={"text"}
                                              id={"dateOfBirth"}
                                              name={"dateOfBirth"}
                                              placeholder={Labels.dateOfBirth}
                                              value={
                                                !!value
                                                  ? moment(value).format(
                                                      "DD/MM/YYYY",
                                                    )
                                                  : ""
                                              }
                                              isWidthFull
                                              className={`relative w-full p-2 ${
                                                localStorageLanguage === "eng"
                                                  ? "pl-10"
                                                  : "pr-10"
                                              } font-general_regular text-fs_16 placeholder:text-c_535353 text-c_181818 border-[0.8px] rounded-xl min-h-[49px] border-c_535353 focus:border-c_0E73D0 outline-none`}
                                              error={Boolean(
                                                errors?.dateOfBirth,
                                              )}
                                              errorText={
                                                errors?.dateOfBirth?.message
                                              }
                                            />
                                            <img
                                              src={calender}
                                              alt={"calenderIcon"}
                                              className={`absolute top-[17px] ${
                                                localStorageLanguage === "eng"
                                                  ? "left-4"
                                                  : "right-4"
                                              } !w-4 !h-4`}
                                            />
                                          </div>
                                        </Popover.Button>
                                        <Transition
                                          as={Fragment}
                                          enter='transition ease-out duration-200'
                                          enterFrom='opacity-0 translate-y-1'
                                          enterTo='opacity-100 translate-y-0'
                                          leave='transition ease-in duration-150'
                                          leaveFrom='opacity-100 translate-y-0'
                                          leaveTo='opacity-0 translate-y-1'
                                        >
                                          <Popover.Panel
                                            className={
                                              "absolute z-[10] bottom-10 lg:bottom-14 rounded-lg bg-none outline-none border-none shadow-none"
                                            }
                                          >
                                            {({ close }) => (
                                              <Controller
                                                control={control}
                                                name={"dateOfBirth"}
                                                render={({
                                                  field: { value },
                                                }) => {
                                                  return (
                                                    <Flatpickr
                                                      options={{
                                                        inline: true,
                                                        monthSelectorType:
                                                          "dropdown",
                                                        yearSelectorType:
                                                          "dropdown",
                                                      }}
                                                      value={value}
                                                      onChange={(
                                                        selectedDates,
                                                      ) => {
                                                        clearErrors(
                                                          "dateOfBirth",
                                                        );
                                                        setValue(
                                                          "dateOfBirth",
                                                          selectedDates[0],
                                                        );
                                                        close();
                                                      }}
                                                      className={
                                                        "hidden outline-none"
                                                      }
                                                    />
                                                  );
                                                }}
                                              />
                                            )}
                                          </Popover.Panel>
                                        </Transition>
                                      </Popover>
                                    </>
                                  );
                                }}
                              />
                            </div>

                            <div>
                              <Controller
                                control={control}
                                name={"phone"}
                                render={({ field: { value } }) => {
                                  return (
                                    <PhoneNumberInput
                                      name={"phone"}
                                      countryDefault={"sa"}
                                      placeholder={Labels.phone}
                                      value={value}
                                      // containerClass={`${
                                      //   !!errors?.phone?.message
                                      //     ? "border border-c_FF3333 rounded-r-xl"
                                      //     : ""
                                      // }`}
                                      isWidthFull
                                      className={`p-2 pl-4 font-regular text-fs_16 placeholder:text-c_535353 text-c_181818 border-[0.8px] rounded-xl w-full min-h-[49px] border-c_535353 focus:border-c_0E73D0 outline-none`}
                                      error={Boolean(errors?.phone)}
                                      errorText={errors.phone?.message}
                                      onChange={(newValue) => {
                                        clearErrors("phone");
                                        setValue("phone", newValue);
                                      }}
                                      // onChange={({
                                      //   countryCode,
                                      //   typedNumber,
                                      // }) => {
                                      //   clearErrors("phone");
                                      //   setValue(
                                      //     "phone",
                                      //     `+${countryCode} ${typedNumber}`,
                                      //   );
                                      // }}
                                    />
                                  );
                                }}
                              />
                            </div>

                            <div className='w-full flex items-center gap-x-2 mb-2'>
                              <TextInput
                                type={"checkbox"}
                                name={"termsCondition"}
                                id={"termsCondition"}
                                checked={isTermsConditionChecked}
                                onChange={handleTermsConditionCheckboxChange}
                                className={`flex items-center h-4 w-4 rounded accent-c_1F3D57`}
                              />
                              <p className='text-fs_12 text-c_535353 w-full lg:w-[44ch] break-words select-none'>
                                <label
                                  htmlFor={"termsCondition"}
                                  className={"cursor-pointer"}
                                >
                                  {`${Labels.pleaseAcceptOur}`}{" "}
                                </label>
                                <a
                                  href={
                                    localStorageLanguage === "eng"
                                      ? "https://istehwath.net/terms-conditions/?hide_header=true"
                                      : "https://istehwath.net/ar/terms-conditions/?hide_header=true"
                                  }
                                  target={"_blank"}
                                  className={
                                    "underline inline-block cursor-pointer"
                                  }
                                >
                                  {`${Labels.termsAndCondition}`}
                                </a>{" "}
                                <span>{` ${Labels.and} `}</span>{" "}
                                <a
                                  href={
                                    localStorageLanguage === "eng"
                                      ? "https://istehwath.net/privacy-policy/?hide_header=true"
                                      : "https://istehwath.net/ar/privacy-policy/?hide_header=true"
                                  }
                                  target={"_blank"}
                                  className={
                                    "underline inline-block cursor-pointer"
                                  }
                                >
                                  {`${Labels.privacyPolicy}`}
                                </a>
                              </p>
                            </div>
                          </div>

                          <div
                            className={`flex flex-col gap-[11px] ${
                              localStorageLanguage === "ar"
                                ? "md:border-r md:border-c_E0E0E0"
                                : "md:border-l md:border_c_E0E0E0"
                            } xl:p-4 md:p-2 p-1 xl:px-10 md:px-5`}
                          >
                            <Controller
                              control={control}
                              name={"description"}
                              render={({ field: { value } }) => (
                                <TextArea
                                  name={"description"}
                                  className={`p-2 pl-4 font-general_regular text-fs_16 placeholder:text-c_535353 placeholder:font-general_regular text-c_181818 border-[0.8px] rounded-xl w-full min-h-[49px] border-c_535353 focus:border-c_0E73D0 outline-none`}
                                  placeholder={Labels.aboutYourSelf}
                                  error={Boolean(errors?.description)}
                                  errorText={errors.description?.message}
                                  onChange={(e) => {
                                    // handleInputChange("description");
                                    clearErrors("description");
                                    setValue(
                                      "description",
                                      e.target.value.replace(/[٠-٩۰-۹]/g, ""),
                                    );
                                  }}
                                  value={value}
                                  col={35}
                                  row={3}
                                />
                              )}
                            />

                            <Controller
                              control={control}
                              name={"userRole"}
                              render={({ field: { value } }) => {
                                return (
                                  <SelectInput
                                    name={"userRole"}
                                    className='w-full rounded-xl'
                                    placeholder={value || Labels.role}
                                    options={
                                      localStorageLanguage === "eng"
                                        ? userRoles
                                        : userRolesArabic
                                    }
                                    value={value}
                                    selected={value}
                                    error={Boolean(errors?.userRole)}
                                    errorText={errors.userRole?.message}
                                    onChange={(e) => {
                                      clearErrors("userRole");
                                      setValue("userRole", e.value);
                                      handleSelectedChangeRole(e.value);
                                    }}
                                  />
                                );
                              }}
                            />

                            {/* {getValues().userRole === "Other" ||
                            selectedRole === "Other" ? (
                              <Controller
                                control={control}
                                name={"otherRole"}
                                render={({ field: { value } }) => {
                                  return (
                                    <Fragment>
                                      <TextInput
                                        name={"otherRole"}
                                        className={`p-2 pl-4 font-general_regular font-normal text-fs_16 placeholder:text-c_535353 text-c_181818 border-[0.8px] rounded-xl w-full min-h-[49px] border-c_535353 focus:border-c_0E73D0 outline-none`}
                                        placeholder={Labels.otherRole}
                                        error={Boolean(errors?.otherRole)}
                                        errorText={errors.otherRole?.message}
                                        value={value}
                                        onChange={(e) => {
                                          if (e?.target.value.length > 0) {
                                            clearErrors("otherRole");
                                          }
                                          setValue("otherRole", e.target.value);
                                        }}
                                      />
                                    </Fragment>
                                  );
                                }}
                              />
                            ) : (
                              <></>
                            )} */}

                            <Controller
                              control={control}
                              name={"country"}
                              render={({ field: { value } }) => {
                                return (
                                  <SelectInput
                                    name={"country"}
                                    className={"w-full rounded-xl"}
                                    placeholder={Labels.country}
                                    options={
                                      localStorageLanguage === "eng"
                                        ? countriesConstant
                                        : countriesConstantArabic
                                    }
                                    value={value}
                                    selected={value}
                                    error={Boolean(errors?.country)}
                                    errorText={errors.country?.message}
                                    onChange={(e) => {
                                      clearErrors("country");
                                      setValue("city", null);
                                      setValue("country", e);
                                      handleSelectedChangeCountry(e);
                                    }}
                                  />
                                );
                              }}
                            />
                            <Controller
                              control={control}
                              name={"city"}
                              render={({ field: { value } }) => {
                                return (
                                  <div>
                                    {/* <GooglePlacesAutocomplete
                                      apiKey={
                                        import.meta.env
                                          .VITE_APP_GOOGLE_MAP_API_KEY
                                      }
                                      autocompletionRequest={{
                                        componentRestrictions: {
                                          country: getValues().country
                                            ? lookup.byCountry(
                                                getValues().country,
                                              )?.iso2
                                            : "sa",
                                        },
                                        types: ["(cities)"],
                                      }}
                                      selectProps={{
                                        placeholder: Labels.city,
                                        classNames: {
                                          control: () => "!w-full",
                                          indicatorSeparator: () => "!hidden",
                                        },
                                        value: value
                                          ? {
                                              label: value,
                                              value: value,
                                            }
                                          : "",
                                        onChange: (e) => {
                                          setValue("city", e.value.description);
                                        },
                                        isOptionSelected: true,
                                      }}
                                    /> */}

                                    {/* <TextInput
                                      name={"city"}
                                      className={`!w-full !min-w-full p-2 pl-4 font-general_regular font-normal text-fs_16 placeholder:text-c_535353 text-c_181818 border-[0.8px] rounded-xl min-h-[49px] border-c_535353 focus:border-c_0E73D0 outline-none`}
                                      placeholder={Labels.city}
                                      error={Boolean(errors?.city)}
                                      errorText={errors.city?.message}
                                      value={value}
                                      onChange={(e) => {
                                        // handleInputChange("city");
                                        clearErrors("city");
                                        setValue(
                                          "city",
                                          e.target.value.replace(
                                            /[٠-٩۰-۹]/g,
                                            "",
                                          ),
                                        );
                                      }}
                                    /> */}

                                    <SelectInput
                                      name={"city"}
                                      className={"w-full rounded-xl"}
                                      placeholder={Labels.city}
                                      options={cities || []}
                                      isDisabled={!selectedCountry?.value}
                                      error={
                                        selectedCountry?.value &&
                                        Boolean(errors?.city)
                                      }
                                      errorText={errors.city?.message}
                                      onChange={(e) => {
                                        clearErrors("city");
                                        setValue("city", e);
                                        handleSelectedChangeCity(e);
                                      }}
                                      value={value}
                                      selected={value}
                                    />
                                  </div>
                                );
                              }}
                            />
                          </div>
                        </div>
                        <div className='xl:p-10 py-10 px-2'>
                          <div className='flex justify-center gap-3 md:flex-row flex-col'>
                            <div
                              onClick={() => {
                                if (!!isTermsConditionChecked) {
                                  setShowCompleteProfileModal(false);
                                } else {
                                  toast.error(
                                    Labels.pleaseCheckOurTermsAndConditionToContinue,
                                  );
                                }
                              }}
                              className='flex items-center justify-center cursor-pointer rounded-lg min-h-[49px] bg-c_CACACA text-c_6B6B6B px-7 py-2.5 text-md min-w-[169px]'
                            >
                              {Labels.skipNow}
                            </div>

                            <div>
                              <Button
                                type={"submit"}
                                isLoading={loading}
                                className={"min-w-[169px]"}
                              >
                                {Labels.save}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className='mt-4 md:px-16 px-4 flex items-center justify-center'>
                        <span className='font-general_semiBold font-semiBold text-fs_36 text-c_000000'>
                          {Labels.enterOtpToVerify}
                        </span>
                      </div>
                      <div className='mt-4 md:px-16 px-4 flex items-center justify-center'>
                        <p className='md:w-[60ch] text-center w-full font-general_normal font-normal text-fs_16 text-c_000'>
                          {`${Labels.weHaveSentYouASixDigitOtpOnNumber} `}
                          {/* <span>
                            {hideUserEmailExcludingDomain(user?.email)}
                          </span> */}
                          {/* <span className='block'>{` ${Labels.pleaseCheckYourEmailBox}`}</span> */}
                          <p
                            className={
                              localStorageLanguage === "eng" ? "pl-1" : "pr-1.5"
                            }
                            dir={"ltr"}
                          >{` (${userDetails?.phone || getValues().phone})`}</p>
                        </p>
                      </div>
                      <div className='flex flex-col justify-center items-center gap-y-3 mt-4 mb-4'>
                        <div dir={"ltr"}>
                          <OTPInput
                            value={OTP}
                            onChange={setOTP}
                            autoFocus
                            OTPLength={4}
                            otpType={"number"}
                            className={"md:gap-3 gap-[2px] otp-input"}
                          />
                        </div>

                        <div
                          className={"my-6 flex items-start md:gap-x-4 gap-x-2"}
                        >
                          <Button
                            variant={"secondary"}
                            onClick={() => setSteps((prev) => prev - 1)}
                            className={
                              "w-[130px] min-w-[130px] whitespace-nowrap"
                            }
                          >
                            {Labels.back}
                          </Button>
                          <Button
                            onClick={handleVerifyPhoneCode}
                            className={
                              "w-[130px] min-w-[130px] whitespace-nowrap"
                            }
                          >
                            {Labels.verify}
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </React.Fragment>
  );
};

export default CompleteProfileModal;
