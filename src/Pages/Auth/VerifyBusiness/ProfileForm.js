/**
 * eslint-disable react/prop-types
 *
 * @format
 */

import {
  Roles,
  cities,
  citiesArabic,
  countriesConstant,
  countriesConstantArabic,
  userRoles,
  userRolesArabic,
} from "../../../constants/constant";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Button,
  SelectInput,
  TextArea,
  TextInput,
  UploadImage,
} from "../../../Components/FormComponents";
import {
  getSingleUser,
  updateUserDetailAction,
  uploadFile,
} from "../../../Store/actions/users";
import DatePicker from "../../../Components/DatePicker";
import {
  checkInternetConnection,
  profileCompletionSchema,
  validateText,
} from "../../../constants/validate";
import { SCREENS } from "../../../Router/routes.constants";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Skeleton from "react-loading-skeleton";
import PhoneNumberInput from "../../../Components/PhoneNumberInput";
import toast from "react-hot-toast";
import moment from "moment";
import useLocalStorage from "react-use-localstorage";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import lookup from "country-code-lookup";
import PhoneNumberValidateOtpModal from "../../../Components/Modals/PhoneNumberValidateOtpModal";
import PhoneNumberOldVerifyOtpModal from "../../../Components/Modals/PhoneNumberOldVerifyOtpModal";
import PhoneNumberChange from "../../../Components/Modals/PhoneNumberChange";
import { requestChangePhoneNumberAction } from "../../../Store/actions/setting";
import CustomDatePicker from "../../../Components/CustomDatePicker";
import { Icons } from "../../../assets/icons";
import {
  getAllCities,
  resendVerificationCodeForPhoneAction,
  validatePhoneNumber,
} from "../../../Store/actions/Startup";
import { Popover, Transition } from "@headlessui/react";
import Flatpickr from "react-flatpickr";

const ProfileForm = () => {
  const { calender } = Icons;
  const Labels = useSelector((state) => state?.Language?.labels);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const user = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  const [userId, setUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [userDetail, setUserDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [editLoader, setEditLoader] = useState(false);
  const [uploadFileLoader, setUploadFileLoader] = useState(false);
  const [showVerifyOtpModal, setShowVerifyOtpModal] = useState(false);
  const [showVerifyModalForOldPhone, setShowVerifyModalForOldPhone] =
    useState(false);
  const [typedNumber, setTypedNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [cities, setCities] = useState([]);
  const [oldPhoneNumber, setOldPhoneNumber] = useState("");

  const [error, setError] = useState({
    phone: null,
  });

  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  const handleGetSingleUserDetails = () => {
    getSingleUser(
      user?.id,
      (res) => {
        setUserDetail(res);
        setUserId(res?.id);
      },
      setLoading,
    );
  };

  const handleGetUserDetails = () => {
    getSingleUser(
      user?.id,
      (res) => {
        setUserDetail(res);
        setUserId(res?.id);
        if (!!res?.country?.id) {
          getAllCities(res?.country?.id, (res) => {
            setCities(
              res?.map((item) => {
                return {
                  label:
                    localStorageLanguage === "eng" ? item?.name : item?.name_ar,
                  value: item?.id,
                };
              }),
            );
          });
        }
      },
      setLoading,
    );
  };

  useEffect(() => {
    handleGetUserDetails();
  }, [localStorageLanguage]);

  const {
    handleSubmit,
    setValue,
    control,
    trigger,
    clearErrors,
    formState: { errors },
    getValues,
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
      phone: "",
      // otherRole: "",
    },
  });

  const handleGetCitiesByCountryId = (_id) => {
    getAllCities(_id, (res) => {
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
    if (
      !!selectedCountry?.value &&
      userDetail?.country?.id !== selectedCountry?.value
    ) {
      handleGetCitiesByCountryId(selectedCountry?.value);
    }
  }, [selectedCountry?.value, userDetail?.country?.id]);

  /**
   * Handles the input change for a given field.
   *
   * @param {string} field - The field that triggered the change.
   * @return {void} This function does not return anything.
   */
  const handleInputChange = (field) => {
    trigger(field);
  };

  useEffect(() => {
    if (userDetail && userId) {
      setValue("phone", userDetail?.phone || "");
      setOldPhoneNumber(userDetail?.phone || "");
      setValue(
        "firstName",
        userDetail?.googleId && !userDetail?.profileCompleted
          ? userDetail?.firstName?.split(" ")[0]
          : userDetail?.firstName || "",
      );
      setValue(
        "lastName",
        userDetail?.googleId && !userDetail?.profileCompleted
          ? userDetail?.firstName?.split(" ")[1]
          : userDetail?.lastName || "",
      );
      setValue("profilePicture", userDetail?.profilePicture);
      setValue(
        "dateOfBirth",
        userDetail?.dateOfBirth
          ? moment(userDetail?.dateOfBirth).format("YYYY-MM-DD")
          : "" || "",
      );
      setValue(
        "country",
        !!userDetail?.country
          ? localStorageLanguage === "eng"
            ? {
                label: userDetail?.country?.name,
                value: userDetail?.country?.id,
              }
            : {
                label: userDetail?.country?.name_ar,
                value: userDetail?.country?.id,
              }
          : null,
      );
      setSelectedCountry(!!userDetail?.country ? userDetail?.country?.id : "");
      setValue(
        "city",
        !!userDetail?.city
          ? localStorageLanguage === "eng"
            ? { label: userDetail?.city?.name, value: userDetail?.city?.id }
            : { label: userDetail?.city?.name_ar, value: userDetail?.city?.id }
          : null,
      );
      setSelectedCity(
        localStorageLanguage === "eng"
          ? userDetail?.city?.name
          : userDetail?.city?.name_ar || null,
      );
      setValue("description", userDetail?.description || "");
      setValue("userRole", userDetail?.role || "");
      setValue(
        "otherRole",
        !["Founder/Entrepreneur", "Owner", "Marketer", "Broker"].includes(
          userDetail?.role,
        )
          ? userDetail?.role
          : "" || "",
      );
      setSelectedRole(userDetail?.role || "");
      setValue(
        "profileImageObj.profilePictureURL",
        userDetail?.profilePicture ?? "",
      );
    }
  }, [userDetail, userId, localStorageLanguage]);

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

  const handleChangeRequestOldPhoneNumber = useCallback(async () => {
    if (
      getValues().phone &&
      error?.phone === null &&
      Boolean(checkInternetConnection(Labels))
    ) {
      const payload = {
        phone: oldPhoneNumber,
      };
      dispatch(
        resendVerificationCodeForPhoneAction(
          payload,
          setLoader,
          () => {
            setShowVerifyModalForOldPhone(true);
          },
          localStorageLanguage,
        ),
      );
    }
  }, [setLoader, oldPhoneNumber, dispatch, setError, error, Labels]);

  /**
   * Handles the form submission event.
   *
   * @param {object} data - The form data.
   */
  const onSubmitHandler = (data) => {
    handleSelectedChangeRole(data?.userRole);
    handleSelectedChangeCountry(data?.country);
    handleSelectedChangeCity(data?.city);

    if (checkInternetConnection(Labels)) {
      if (userDetail?.phone === data?.phone || !userDetail?.phone) {
        const formData = new FormData();
        data?.phone && formData.append("phone", `${data?.phone}`);
        formData.append("firstName", data?.firstName);
        formData.append("lastName", data?.lastName);
        formData.append(
          "profilePicture",
          data?.profileImageObj?.profilePictureURL,
        );
        data?.dateOfBirth &&
          formData.append(
            "dateOfBirth",
            moment(data?.dateOfBirth).format("YYYY-MM-DD") ?? "",
          );
        formData.append("country", data?.country?.value);
        formData.append("city", data?.city?.value);
        formData.append("description", data?.description);
        formData.append("role", selectedRole);
        dispatch(
          updateUserDetailAction(
            formData,
            async (res) => {
              setLoading(false);
              if (!res?.profileCompleted) {
                setShowVerifyOtpModal(true);
              } else if (!!res?.profileCompleted) {
                navigate(
                  role === Roles.BUYER
                    ? SCREENS.buyerSetting
                    : SCREENS.sellerSetting,
                );
              }
            },
            setEditLoader,
            navigate,
            role,
            localStorageLanguage,
          ),
        );
      } else if (userDetail?.phone !== data?.phone) {
        const obj = {
          phone: data?.phone,
        };
        dispatch(
          validatePhoneNumber(
            obj,
            setLoader,
            (res) => {
              if (res) {
                handleChangeRequestOldPhoneNumber();
              }
            },
            localStorageLanguage,
          ),
        );
      }
    }
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
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <div className='edit_box p-4 mt-8'>
        <div className='text-center mt-14 mb-8'>
          <div>
            <span className='text-fs_32 text-c_181818 font-general_semiBold'>
              {Labels.editProfileDetails}
            </span>
          </div>
          <div>
            <span className='text-c_181818 text-fs_16'>
              {Labels.pleaseCompleteDetailsToAccessAllFeatures}
            </span>
          </div>
        </div>
        <div
          className={`grid md:grid-cols-2 ${
            localStorageLanguage === "eng" && "md:divide-x"
          } divide-c_E0E0E0 lg:px-10 md:px-5 px-2`}
        >
          <div
            className={`flex flex-col ${
              localStorageLanguage === "ar" && "md:border-l border-c_E0E0E0"
            } gap-3 xl:p-4 md:p-2 p-1 xl:px-10 md:px-5`}
          >
            <div>
              <Controller
                control={control}
                name={"profileImageObj"}
                render={({ field: { value } }) => {
                  return (
                    <UploadImage
                      value={value}
                      loading={loading}
                      onChange={(e) => {
                        handleUploadFile(e.target.files[0]);
                      }}
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
            </div>
            <div>
              <div className='grid grid-cols-2 gap-x-2'>
                <div>
                  {loading ? (
                    <Skeleton
                      width={"100%"}
                      height={40}
                      duration={2}
                      enableAnimation={true}
                      borderRadius={"0.55rem"}
                    />
                  ) : (
                    <Controller
                      control={control}
                      name='firstName'
                      rules={{ required: true }}
                      render={({ field: { value } }) => {
                        return (
                          <>
                            <TextInput
                              name={"firstName"}
                              className={`p-2 pl-4 font-general_regular font-normal text-fs_16 placeholder:text-c_535353 text-c_181818 border-[0.8px] rounded-xl w-full min-h-[49px] border-c_535353 focus:border-c_0E73D0 outline-none`}
                              placeholder={Labels.firstName}
                              error={Boolean(errors?.firstName)}
                              errorText={errors.firstName?.message}
                              value={value}
                              onChange={(e) => {
                                // handleInputChange("firstName");
                                clearErrors("firstName");
                                setValue(
                                  "firstName",
                                  e.target.value.replace(/[٠-٩۰-۹]/g, ""),
                                );
                              }}
                            />
                          </>
                        );
                      }}
                    />
                  )}
                </div>
                <div>
                  {loading ? (
                    <Skeleton
                      width={"100%"}
                      height={40}
                      duration={2}
                      enableAnimation={true}
                      borderRadius={"0.55rem"}
                    />
                  ) : (
                    <Controller
                      control={control}
                      name='lastName'
                      rules={{ required: true }}
                      render={({ field: { value } }) => {
                        return (
                          <>
                            <TextInput
                              name={"lastName"}
                              className={`p-2 pl-4 font-regular text-fs_16 placeholder:text-c_535353 text-c_181818 border-[0.8px] rounded-xl w-full min-h-[49px] border-c_535353 focus:border-c_0E73D0 outline-none`}
                              placeholder={Labels.lastName}
                              error={Boolean(errors?.lastName)}
                              errorText={errors.lastName?.message}
                              value={value}
                              onChange={(e) => {
                                // handleInputChange("lastName");
                                clearErrors("lastName");
                                setValue(
                                  "lastName",
                                  e.target.value.replace(/[٠-٩۰-۹]/g, ""),
                                );
                              }}
                            />
                          </>
                        );
                      }}
                    />
                  )}
                </div>
              </div>

              <div className={"relative mt-2"}>
                {loading ? (
                  <Skeleton
                    width={"100%"}
                    height={40}
                    duration={2}
                    enableAnimation={true}
                    borderRadius={"0.55rem"}
                  />
                ) : (
                  <Controller
                    control={control}
                    name={"dateOfBirth"}
                    rules={{ required: true }}
                    render={({ field: { value } }) => {
                      return (
                        <>
                          <Popover className={"relative"}>
                            <Popover.Button className={"w-full outline-none"}>
                              <div className={"w-full"}>
                                <TextInput
                                  type={"text"}
                                  id={"dateOfBirth"}
                                  name={"dateOfBirth"}
                                  placeholder={Labels.dateOfBirth}
                                  value={
                                    !!value
                                      ? moment(value).format("DD/MM/YYYY")
                                      : ""
                                  }
                                  isWidthFull
                                  className={`relative w-full p-2 ${
                                    localStorageLanguage === "eng"
                                      ? "pl-10"
                                      : "pr-10"
                                  } font-general_regular text-fs_16 placeholder:text-c_535353 text-c_181818 border-[0.8px] rounded-xl min-h-[49px] border-c_535353 focus:border-c_0E73D0 outline-none`}
                                  error={Boolean(errors?.dateOfBirth)}
                                  errorText={errors?.dateOfBirth?.message}
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
                                    render={({ field: { value } }) => {
                                      return (
                                        <Flatpickr
                                          options={{
                                            inline: true,
                                            monthSelectorType: "dropdown",
                                            yearSelectorType: "dropdown",
                                          }}
                                          value={value}
                                          onChange={(selectedDates) => {
                                            clearErrors("dateOfBirth");
                                            setValue(
                                              "dateOfBirth",
                                              selectedDates[0],
                                            );
                                            close();
                                          }}
                                          className={"hidden outline-none"}
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
                )}
              </div>

              <div className='mt-2'>
                {loading ? (
                  <Skeleton
                    width={"100%"}
                    height={40}
                    duration={2}
                    enableAnimation={true}
                    borderRadius={"0.55rem"}
                  />
                ) : (
                  <Controller
                    control={control}
                    name={"phone"}
                    render={({ field: { value } }) => {
                      return (
                        <PhoneNumberInput
                          name={"phone"}
                          placeholder={Labels.phone}
                          value={value}
                          isWidthFull
                          className={`p-2 pl-4 font-regular text-fs_16 placeholder:text-c_535353 text-c_181818 border-[0.8px] rounded-xl w-full min-h-[49px] border-c_535353 focus:border-c_0E73D0 outline-none`}
                          // disabled={
                          //   !!userDetail?.profileCompleted ? true : false
                          // }
                          // inputClass={
                          //   !!userDetail?.profileCompleted
                          //     ? "!opacity-60 !cursor-not-allowed"
                          //     : "!opacity-100"
                          // }
                          // buttonClass={
                          //   !!userDetail?.profileCompleted
                          //     ? "!opacity-60 !cursor-not-allowed"
                          //     : "!opacity-100"
                          // }
                          // containerClass={`${
                          //   !!errors?.phone?.message || !!error?.phone
                          //     ? "border border-c_FF3333 rounded-r-xl"
                          //     : ""
                          // }`}
                          error={
                            Boolean(errors?.phone) || Boolean(error?.phone)
                          }
                          errorText={errors.phone?.message || error?.phone}
                          onChange={(newValue) => {
                            clearErrors("phone");
                            setValue("phone", newValue);
                          }}
                          // onChange={({ countryCode, typedNumber }) => {
                          //   // clearErrors("phone");
                          //   // setError(null);
                          //   setValue("phone", `+${countryCode} ${typedNumber}`);
                          //   setCountryCode(countryCode);
                          //   setTypedNumber(typedNumber);
                          // }}
                        />
                      );
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          <div
            className={`flex flex-col gap-2 xl:p-4 md:p-2 p-1 xl:px-10 md:px-5`}
          >
            {loading ? (
              <Skeleton
                width={"100%"}
                height={80}
                duration={2}
                enableAnimation={true}
                borderRadius={"0.55rem"}
              />
            ) : (
              <Controller
                control={control}
                name={"description"}
                render={({ field: { value } }) => {
                  return (
                    <>
                      <TextArea
                        name={"description"}
                        className={`p-2 pl-4 font-general_regular text-fs_16 placeholder:text-c_535353 text-c_181818 border-[0.8px] rounded-xl w-full min-h-[49px] border-c_535353 focus:border-c_0E73D0 outline-none`}
                        placeholder={Labels.aboutYourSelf}
                        value={value}
                        col={35}
                        row={3}
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
                      />
                    </>
                  );
                }}
              />
            )}

            {loading ? (
              <Skeleton
                width={"100%"}
                height={40}
                duration={2}
                enableAnimation={true}
                borderRadius={"0.55rem"}
              />
            ) : (
              <Controller
                control={control}
                name={"userRole"}
                render={({ field: { value } }) => {
                  return (
                    <Fragment>
                      <SelectInput
                        name={"userRole"}
                        className='w-full rounded-xl'
                        placeholder={value || Labels.role}
                        options={
                          localStorageLanguage === "eng"
                            ? userRoles
                            : userRolesArabic
                        }
                        error={Boolean(errors?.userRole)}
                        errorText={errors.userRole?.message}
                        onChange={(e) => {
                          clearErrors("userRole");
                          setValue("userRole", e.value);
                          handleSelectedChangeRole(e.value);
                        }}
                        value={value}
                        selected={value}
                      />
                    </Fragment>
                  );
                }}
              />
            )}

            {/* {getValues().userRole === "Other" || selectedRole === "Other" ? (
              loading ? (
                <Skeleton
                  width={"100%"}
                  height={40}
                  duration={2}
                  enableAnimation={true}
                  borderRadius={"0.55rem"}
                />
              ) : (
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
              )
            ) : (
              <></>
            )} */}

            {loading ? (
              <Skeleton
                width={"100%"}
                height={40}
                duration={2}
                enableAnimation={true}
                borderRadius={"0.55rem"}
              />
            ) : (
              <Controller
                control={control}
                name={"country"}
                render={({ field: { value } }) => {
                  return (
                    <>
                      <SelectInput
                        name={"country"}
                        className={"w-full rounded-xl"}
                        placeholder={Labels.country}
                        options={
                          localStorageLanguage === "eng"
                            ? countriesConstant
                            : countriesConstantArabic
                        }
                        error={Boolean(errors?.country)}
                        errorText={errors.country?.message}
                        onChange={(e) => {
                          clearErrors("country");
                          setValue("country", e);
                          setValue("city", null);
                          handleSelectedChangeCountry(e);
                        }}
                        value={value}
                        selected={value}
                      />
                    </>
                  );
                }}
              />
            )}
            {loading ? (
              <Skeleton
                width={"100%"}
                height={40}
                duration={2}
                enableAnimation={true}
                borderRadius={"0.55rem"}
              />
            ) : (
              <Controller
                control={control}
                name={"city"}
                render={({ field: { value } }) => {
                  return (
                    <div>
                      {/* <GooglePlacesAutocomplete
                        apiKey={import.meta.env.VITE_APP_GOOGLE_MAP_API_KEY}
                        autocompletionRequest={{
                          componentRestrictions: {
                            country: getValues().country
                              ? lookup.byCountry(getValues().country)?.iso2
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
                            e.target.value.replace(/[٠-٩۰-۹]/g, ""),
                          );
                        }}
                      /> */}
                      <SelectInput
                        name={"city"}
                        className='w-full rounded-xl'
                        placeholder={Labels.city}
                        options={cities || []}
                        isDisabled={!getValues().country && !getValues()?.city}
                        error={Boolean(errors?.city)}
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
            )}
          </div>
        </div>
        <div className='xl:p-10 py-10 px-2'>
          <div className='flex md:flex-row flex-col-reverse justify-center md:gap-x-3 gap-y-3'>
            <div>
              <div
                onClick={() =>
                  navigate(
                    `${
                      role === Roles.BUYER
                        ? SCREENS.buyerSetting
                        : SCREENS.sellerSetting
                    }`,
                  )
                }
                className={
                  "min-h-[49px] md:min-w-[169px] w-full min-w-full flex items-center justify-center cursor-pointer outline-none rounded-lg px-7 py-2.5 text-fs_16 bg-c_CACACA text-c_6B6B6B"
                }
              >
                {Labels.back}
              </div>
            </div>
            <div>
              <Button
                isLoading={editLoader}
                type={"submit"}
                className={"md:min-w-[169px] w-full min-w-full"}
              >
                {Labels.save}
              </Button>
            </div>
          </div>
        </div>
      </div>
      {showVerifyOtpModal && (
        <PhoneNumberValidateOtpModal
          phoneNumber={getValues().phone}
          getValues={getValues}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          selectedCountry={selectedCountry}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          setSelectedCountry={setSelectedCountry}
          showVerifyOtpModal={showVerifyOtpModal}
          setShowVerifyOtpModal={() => setShowVerifyOtpModal((prev) => !prev)}
          isEdit={true}
        />
      )}
      {showVerifyModalForOldPhone && (
        <PhoneNumberOldVerifyOtpModal
          phoneNumber={oldPhoneNumber}
          getValues={getValues}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          selectedCountry={selectedCountry}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          setSelectedCountry={setSelectedCountry}
          showVerifyOtpModal={showVerifyModalForOldPhone}
          setShowVerifyModalForOldPhone={() =>
            setShowVerifyModalForOldPhone((prev) => !prev)
          }
          setShowVerifyOtpModal={() => setShowVerifyOtpModal((prev) => !prev)}
          handleFetchUserDetailsCallback={handleGetSingleUserDetails}
          isEdit={true}
        />
      )}
    </form>
  );
};

export default ProfileForm;
