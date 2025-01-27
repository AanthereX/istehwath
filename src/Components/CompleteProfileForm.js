/** @format */

import { useState, memo, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Roles,
  cities,
  citiesArabic,
  countries,
  countriesConstant,
  countriesConstantArabic,
  userRoles,
  userRolesArabic,
} from "./../constants/constant";
import {
  Button,
  SelectInput,
  TextArea,
  TextInput,
  UploadImage,
} from "../Components/FormComponents";
import {
  checkInternetConnection,
  profileCompletionSchema,
} from "../constants/validate";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SCREENS } from "../Router/routes.constants";
import {
  completeUserDetailsAction,
  getSingleUser,
  uploadFile,
} from "../Store/actions/users";
import { Popover, Transition } from "@headlessui/react";
import PhoneNumberInput from "./PhoneNumberInput";
import toast from "react-hot-toast";
import moment from "moment";
import useLocalStorage from "react-use-localstorage";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import lookup from "country-code-lookup";
import PhoneNumberValidateOtpModal from "./Modals/PhoneNumberValidateOtpModal";
import { userData } from "../Store/actions/auth";
import CustomDatePicker from "./CustomDatePicker";
import { Icons } from "../assets/icons";
import { requestChangePhoneNumberAction } from "../Store/actions/setting";
import { getAllCities } from "../Store/actions/Startup";
import Flatpickr from "react-flatpickr";

const CompleteProfileForm = () => {
  const { calender } = Icons;
  const Labels = useSelector((state) => state?.Language?.labels);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingGetUser, setLoadingGetUser] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const [userDetail, setUserDetail] = useState(null);
  const [userId, setUserId] = useState("");
  const role = localStorage.getItem("role");
  const [showVerifyOtpModal, setShowVerifyOtpModal] = useState(false);
  const [uploadFileLoader, setUploadFileLoader] = useState(false);
  const [typedNumber, setTypedNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [isTermsConditionChecked, setIsTermsConditionChecked] = useState(false);
  const [cities, setCities] = useState([]);
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
        setUserDetail(res);
        setUserId(res?.id);
      },
      setLoadingGetUser,
    );
  }, []);

  useEffect(() => {
    if (userDetail && userId) {
      setValue(
        "firstName",
        userDetail?.googleId
          ? userDetail?.firstName?.split(" ")[0] ?? ""
          : userDetail?.firstName ?? "",
      );
      setValue(
        "lastName",
        userDetail?.googleId
          ? userDetail?.firstName?.split(" ")[1] ?? ""
          : userDetail?.lastName ?? "",
      );
      setValue("profilePicture", userDetail?.profilePicture ?? "");
      setValue(
        "profileImageObj.profilePictureURL",
        userDetail?.profilePicture ?? "",
      );
    }
  }, [userDetail, userId]);

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
      data?.dateOfBirth &&
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
            console.log(res, "res");
            dispatch(userData(res?.data));
            if (!res?.data?.profileCompleted) {
              setShowVerifyOtpModal(true);
            }
          },
          localStorageLanguage,
        ),
      );
    }
  };

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
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <div className='!w-full completeForm_box md:p-4 mt-4 hideHorizontallScroll'>
        <div className='w-full text-center mt-14 mb-8'>
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
        <div className='grid md:grid-cols-2 lg:px-10 md:px-5 px-0'>
          <div className='w-full flex flex-col gap-3 xl:p-4 md:p-2 p-1 xl:px-10 md:px-5'>
            <Controller
              control={control}
              name={"profileImageObj"}
              render={({ field: { value } }) => {
                return (
                  <UploadImage
                    value={value}
                    onChange={(e) => handleUploadFile(e.target.files[0])}
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
            <div className='w-full grid grid-cols-2 gap-3'>
              <div className={"w-full"}>
                <Controller
                  control={control}
                  name='firstName'
                  rules={{ required: true }}
                  render={({ field: { value } }) => {
                    return (
                      <div className={"col-span-2 md:col-span-2 lg:col-span-1"}>
                        <TextInput
                          name={"firstName"}
                          className={`p-2 pl-4 font-general_regular font-normal text-fs_16 placeholder:text-c_535353 placeholder:font-general_regular placeholder:font-regular text-c_181818 border-[0.8px] rounded-xl w-full min-h-[49px] border-c_535353 focus:border-c_0E73D0 outline-none`}
                          placeholder={Labels.firstName}
                          value={value}
                          error={Boolean(errors?.firstName)}
                          errorText={errors.firstName?.message}
                          isWidthFull
                          onChange={(e) => {
                            clearErrors("firstName");
                            // handleInputChange("firstName");
                            setValue(
                              "firstName",
                              e.target.value.replace(/[٠-٩۰-۹]/g, ""),
                            );
                          }}
                        />
                      </div>
                    );
                  }}
                />
              </div>

              <div className={"w-full"}>
                <Controller
                  control={control}
                  name='lastName'
                  render={({ field: { value } }) => {
                    return (
                      <div className={"col-span-2 md:col-span-2 lg:col-span-1"}>
                        <TextInput
                          name={"lastName"}
                          className={`p-2 pl-4 font-general_regular font-normal text-fs_16 placeholder:text-c_535353 placeholder:font-general_regular placeholder:font-regular text-c_181818 border-[0.8px] rounded-xl w-full min-h-[49px] border-c_535353 outline-none`}
                          placeholder={Labels.lastName}
                          value={value}
                          error={Boolean(errors?.lastName)}
                          errorText={errors.lastName?.message}
                          isWidthFull
                          onChange={(e) => {
                            clearErrors("lastName");
                            // handleInputChange("lastName");
                            setValue(
                              "lastName",
                              e.target.value.replace(/[٠-٩۰-۹]/g, ""),
                            );
                          }}
                        />
                      </div>
                    );
                  }}
                />
              </div>
            </div>
            <div className={"relative w-full"}>
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
            </div>

            <div className={"w-full"}>
              <Controller
                control={control}
                name='phone'
                render={({ field: { value } }) => {
                  return (
                    <PhoneNumberInput
                      name={"phone"}
                      placeholder={null}
                      countryDefault={"sa"}
                      value={value}
                      error={Boolean(errors?.phone)}
                      // containerClass={`${
                      //   !!errors?.phone?.message
                      //     ? "border border-c_FF3333 rounded-r-xl"
                      //     : ""
                      // }`}
                      // inputClass={"!w-full"}
                      isWidthFull
                      className={`p-2 pl-4 font-regular text-fs_16 placeholder:text-c_535353 text-c_181818 border-[0.8px] rounded-xl w-full min-h-[49px] border-c_535353 focus:border-c_0E73D0 outline-none`}
                      errorText={errors.phone?.message}
                      onChange={(newValue) => {
                        clearErrors("phone");
                        setValue("phone", newValue);
                      }}
                      // onChange={({ countryCode, typedNumber }) => {
                      //   clearErrors("phone");
                      //   setValue("phone", `+${countryCode} ${typedNumber}`);
                      //   setCountryCode(countryCode);
                      //   setTypedNumber(typedNumber);
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
              <p className='text-fs_12 text-c_535353 w-[44ch] break-words select-none'>
                <label htmlFor={"termsCondition"} className={"cursor-pointer"}>
                  {`${Labels.pleaseAcceptOur}`}{" "}
                </label>
                <a
                  href={
                    localStorageLanguage === "eng"
                      ? "https://istehwath.net/terms-conditions/?hide_header=true"
                      : "https://istehwath.net/ar/terms-conditions/?hide_header=true"
                  }
                  target={"_blank"}
                  className={"underline cursor-pointer"}
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
                  className={"underline cursor-pointer"}
                >
                  {`${Labels.privacyPolicy}`}
                </a>
              </p>
            </div>
          </div>

          <div
            className={`flex flex-col gap-3 ${
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
                    clearErrors("description");
                    // handleInputChange("description");
                    setValue(
                      "description",
                      e.target.value.replace(/[٠-٩۰-۹]/g, ""),
                    );
                  }}
                  selected={value}
                  col={35}
                  row={3}
                />
              )}
            />
            <div className={"w-full"}>
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
                      error={Boolean(errors?.userRole)}
                      errorText={errors.userRole?.message}
                      onChange={(e) => {
                        if (!!e.value) {
                          clearErrors("userRole");
                        }
                        setValue("userRole", e.value);
                        handleSelectedChangeRole(e.value);
                      }}
                      value={value}
                      selected={value}
                    />
                  );
                }}
              />
            </div>
            {/* {getValues().userRole === "Other" || selectedRole === "Other" ? (
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
            <div className={"w-full"}>
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
                      error={Boolean(errors?.country)}
                      errorText={errors.country?.message}
                      onChange={(e) => {
                        if (!!e.value) {
                          clearErrors("country");
                        }
                        setValue("city", null);
                        setValue("country", e);
                        handleSelectedChangeCountry(e);
                      }}
                      value={value}
                      selected={value}
                    />
                  );
                }}
              />
            </div>

            <div className={"w-full"}>
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
                          clearErrors("city");
                          // handleInputChange("city");
                          setValue(
                            "city",
                            e.target.value.replace(/[٠-٩۰-۹]/g, ""),
                          );
                        }}
                      /> */}

                      <SelectInput
                        name={"city"}
                        className={"w-full rounded-xl"}
                        placeholder={Labels.city}
                        options={cities || []}
                        isDisabled={!selectedCountry?.value}
                        error={selectedCountry?.value && Boolean(errors?.city)}
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
        </div>
        <div className='xl:p-10 py-10 px-2'>
          <div className='flex justify-center gap-3 md:flex-row flex-col'>
            <div>
              <div
                onClick={() => {
                  if (!!isTermsConditionChecked) {
                    navigate(
                      `${
                        role === Roles.BUYER
                          ? SCREENS.buyerMarketplace
                          : SCREENS.sellerListing
                      }`,
                    );
                  } else {
                    toast.error(
                      Labels.pleaseCheckOurTermsAndConditionToContinue,
                    );
                  }
                }}
                className={
                  "outline-none flex items-center cursor-pointer justify-center min-w-[169px] max-w-[335px] rounded-lg bg-c_CACACA min-h-[49px] text-c_6B6B6B px-7 py-2.5 text-md"
                }
              >
                {Labels.skipNow}
              </div>
            </div>
            <div>
              <Button
                isLoading={loading}
                type={"submit"}
                className={"min-w-[169px]"}
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
          selectedCountry={selectedCountry}
          showVerifyOtpModal={showVerifyOtpModal}
          setShowVerifyOtpModal={() => setShowVerifyOtpModal((prev) => !prev)}
        />
      )}
    </form>
  );
};

export default memo(CompleteProfileForm);
