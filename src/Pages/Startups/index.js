/** @format */

import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "react-use-localstorage";
import { v4 as uuidv4 } from "uuid";
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  geocodeByLatLng,
  getLatLng,
} from "react-google-places-autocomplete";
import { useDispatch, useSelector } from "react-redux";
import Stepper from "react-stepper-horizontal";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

import CommonLayout from "../MarketPlace/CommonLayout/CommonLayout";
import {
  Button,
  CustomTagSelect,
  Divider,
  FileAddComponent,
  SelectInput,
  TextInput,
} from "../../Components/FormComponents";
import StartupInput from "../../Components/FormComponents/StartupInput";
import TextAreaWithCount from "../../Components/FormComponents/TextAreaWithCount";
import VerifyStartupModal from "../../Components/Modals/VerifyStartupModal";
import VerifyOtpModal from "../../Components/Modals/VerifyOtpModal";
import ApiLoader from "../../Components/Spinner/ApiLoader";
import toast from "react-hot-toast";
import CustomRadioBtn from "../../Components/CustomRadioBtn";
import lookup from "country-code-lookup";
import {
  addStartupDetailAction,
  businessVerificationAction,
  getAllCities,
  getStartupFormAction,
  resendVerificationCodeAction,
  resendVerificationCodeForPhoneAction,
} from "../../Store/actions/Startup";

import { Icons } from "../../assets/icons";

import {
  BreakPoints,
  BusinessVerified,
  FileTypes,
  InputTypes,
  allowedFileTypes,
  countriesConstant,
  countriesConstantArabic,
  roleInBusinessOptions,
  userRoles,
  userRolesArabic,
} from "../../constants/constant";
import { SCREENS } from "../../Router/routes.constants";
import { RequestType, fromLatLng, geocode } from "react-geocode";
import { getSettingAction } from "../../Store/actions/setting";
import { getFileNameByUrl, getFileTypeByUrl } from "../../utils/utility";
import { RiDeleteBin7Line } from "react-icons/ri";
import { getSingleUser, uploadFile } from "../../Store/actions/users";
import AddMarketingCodeOnSkip from "../../Components/Modals/AddMarketingCodeOnSkip";
import { Images } from "../../assets/images";
import Api from "../../api/Api";
import { checkInternetConnection, getEnvVariable } from "../../constants/validate";
import { addMarketingCodeAction } from "../../Store/actions/MarketingCode";
import AddStartupSuccessModal from "../../Components/Modals/AddStartupSuccessModal";
import CustomDatePicker from "../../Components/CustomDatePicker";
import moment from "moment";
import useWindowWidth from "../../hooks/useWindowWidth";
import { Popover, Transition } from "@headlessui/react";
import Flatpickr from "react-flatpickr";

const AddStartup = () => {
  const Labels = useSelector((state) => state.Language.labels);
  const user = useSelector((state) => state?.User?.userData?.payload);
  const dateFounded = useRef();
  const width = useWindowWidth();
  const companyLetterfileRef = useRef(null);
  const navigate = useNavigate();
  // const user = JSON.parse(localStorage.getItem("user"));
  const { info, calender, PdfFileIcon, DocFileIcon, uploadIcon, deleteTag } =
    Icons;
  const { attachmentImg } = Images;
  const [activeStep, setActiveStep] = useState(0);
  const [userDetails, setUserDetails] = useState(null);
  const [loadingGetUser, setLoadingGetUser] = useState(false);
  const dispatch = useDispatch();
  const [isDraftApiHit, setIsDraftApiHit] = useState(false);
  const [fieldError, setFieldError] = useState(false);
  const [successAddStartupMessage, setSuccessAddStartupMessage] = useState("");
  const [buisnessTypeId, setBusinessTypeId] = useState(null);
  const [cityId, setCityId] = useState(null);
  const [countryId, setCountryId] = useState(null);
  const [cities, setCities] = useState([]);
  const [localCity, setLocalCity] = useState(null);
  const [showAddStartupModal, setShowAddStartupModal] = useState(false);

  const [values, setValues] = useState({
    grossRevenue: "",
    netProfit: "",
    roleInBusiness: "",
    otherRole: "",
    country: "",
    companyLetter: "",
    companyLetterURL: "",
    marketingCode: "",
  });
  const [errors, setErrors] = useState({
    grossRevenue: null,
    netProfit: null,
    roleInBusiness: null,
    otherRole: null,
    country: null,
    companyLetter: null,
    companyLetterURL: null,
    marketingCode: null,
    isAuthorityDeclared: null,
  });

  useEffect(() => {
    if (countryId) {
      getAllCities(countryId, (res) => {
        setCities(res);
      });
    }
  }, [countryId]);

  // useEffect(() => {
  //   getSingleUser(
  //     user?.id,
  //     (res) => {
  //       setUserDetails(res);
  //     },
  //     setLoadingGetUser,
  //   );
  // }, []);

  const [formDetails, setFormDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stepperSteps, setStepperSteps] = useState([]);
  const [showVerifyStartupModal, setShowVerifyStartupModal] = useState(false);
  const [saveDraftLoading, setSaveDraftLoading] = useState(false);
  const [showVerifyOtpModal, setShowVerifyOtpModal] = useState(false);
  const [verifyBusinessResponse, setVerifyBusinessResponse] = useState(null);
  const [loaderVerifyCode, setLoaderVerifyCode] = useState(false);
  const [showAddMarketingCodeModal, setShowAddMarketingCodeModal] =
    useState(false);
  const [isAuthorityDeclared, setIsAuthorityDeclared] = useState(false);
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );
  const [price, setPrice] = useState("");
  const [uploadFileLoader, setUploadFileLoader] = useState(false);
  const [countryCode, setCountry] = useState("");
  const [setting, setSetting] = useState([]);
  const [startupIdAfterPostStartup, setStartupIdAfterPostStartup] =
    useState("");
  const addStartUpIdOnPost = useSelector(
    (state) => state.Startup?.startUpIdOnAdd,
  );
  const [loadingPrevMarketingCode, setLoadingPrevMarketingCode] =
    useState(false);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: getEnvVariable('VITE_APP_GOOGLE_MAP_API_KEY'),
    libraries: ["places"],
  });

  const isAllFieldsEmpty = !formDetails?.some((formDetailItem) =>
    formDetailItem?.dynamicForms?.some((dynamicFormItem) => {
      const value = dynamicFormItem?.data?.value;
      if (typeof value === "string") {
        return value.trim().length > 0;
      }
      if (value instanceof Date) {
        return !isNaN(value.getTime());
      }
      if (typeof value === "number") {
        return value > 0;
      }
      return false;
    }),
  );

  const handleGetFormData = () => {
    setIsLoading(true);
    getStartupFormAction((res) => {
      setIsLoading(false);
      const sortedData = res?.sort((a, b) => a.priority - b.priority);
      const mappedOut = sortedData?.map((item) => {
        return {
          ...item,
          dynamicForms: item?.dynamicForms
            ?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            ?.map((ele) => {
              if (ele?.formFields?.type !== InputTypes.FILE) {
                return { ...ele, data: { ...ele?.data, value: "" } };
              }
              return { ...ele };
            }),
        };
      });
      setFormDetails(mappedOut);
      const dynamicSteps = res.map((item) => {
        return {
          id: item?.id,
          title: localStorageLanguage === "eng" ? item?.name_en : item?.name_ar,
        };
      });
      const staticSteps = [
        {
          id: uuidv4(),
          title: Labels.financials,
        },
      ];
      const staticSevenSteps = [
        {
          id: uuidv4(),
          title: Labels.verifyBusiness,
        },
      ];
      if (
        setting.some(
          (item) =>
            item?.key === BusinessVerified.BUSINESSVERIFIED &&
            item?.value === "true",
        )
      ) {
        dynamicSteps.push(...staticSteps, ...staticSevenSteps);
        setStepperSteps(dynamicSteps);
      } else {
        dynamicSteps.push(...staticSteps);
        setStepperSteps(dynamicSteps);
      }
    });
  };

  const setFormValues = (tabIndex, formIndex, val, key = "no") => {
    const mappedOut = formDetails.map((item, index) => {
      if (index === tabIndex) {
        return {
          ...item,
          dynamicForms: item.dynamicForms.map((_item, dIndex) => {
            if (key === "yes") {
              if (dIndex === formIndex + 1) {
                return { ..._item, data: { ..._item?.data, value: "" } };
              } else if (dIndex === formIndex) {
                return { ..._item, data: { ..._item?.data, value: val } };
              }
              return { ..._item };
            } else {
              if (dIndex === formIndex) {
                return { ..._item, data: { ..._item?.data, value: val } };
              }
              return { ..._item };
            }
          }),
        };
      }
      return {
        ...item,
      };
    });
    setFormDetails(mappedOut);
  };

  const setFormValuesForFile = (
    tabIndex,
    formIndex,
    fileIndex,
    val,
    fileDetail,
  ) => {
    const mappedOut = formDetails.map((item, index) => {
      if (index === tabIndex) {
        return {
          ...item,
          dynamicForms: item?.dynamicForms?.map((_item, cIndex) => {
            if (cIndex === formIndex) {
              return {
                ..._item,
                data: _item?.data?.map((subItem, subIndex) => {
                  if (fileIndex === subIndex) {
                    return {
                      ...subItem,
                      value: val,
                      fileName: fileDetail.fileName,
                      type: fileDetail.type,
                    };
                  }
                  return { ...subItem };
                }),
              };
            }
            return { ..._item };
          }),
        };
      }
      return { ...item };
    });

    setFormDetails(mappedOut);
  };

  const removeFormValuesForFile = (tabIndex, formIndex, _data) => {
    let mappedOut = formDetails?.map((item, pIndex) => {
      if (pIndex === tabIndex) {
        return {
          ...item,
          dynamicForms: item?.dynamicForms?.map((_item, cIndex) => {
            if (cIndex === formIndex) {
              return {
                ..._item,
                value: "",
                data: _data,
              };
            }
            return { ..._item };
          }),
        };
      }
      return { ...item };
    });
    setFormDetails(mappedOut);
  };

  useEffect(() => {
    handleGetFormData();
  }, [setFormDetails, Labels, setting]);

  useEffect(() => {
    handleGetSetting();
  }, []);

  const handleGetSetting = () => {
    getSettingAction((res) => {
      setSetting(res);
    });
  };

  const handlerVerifyBusinessBeforePostStartup = () => {
    if (!!user?.phone) {
      const payload = {
        phone: user?.phone,
      };
      dispatch(
        resendVerificationCodeForPhoneAction(
          payload,
          setLoaderVerifyCode,
          () => {
            setShowVerifyOtpModal(true);
          },
          localStorageLanguage,
        ),
      );
    } else {
      toast.error(Labels.phoneNumberNotAvailable);
    }
  };

  const handleNext = () => {
    setFieldError(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    const checkRequiredFields = formDetails[activeStep]?.dynamicForms?.filter(
      (item) =>
        Boolean(item?.data?.isRequired) &&
        item?.formFields?.type !== InputTypes.FILE,
    );
    const radioFields = formDetails[activeStep]?.dynamicForms?.filter(
      (item) => item?.formFields?.type === InputTypes.RADIO,
    );
    const checkRequiredFileFields = formDetails[
      activeStep
    ]?.dynamicForms?.filter(
      (item) => item?.formFields?.type === InputTypes.FILE,
    );

    const checkRequiredInFile = checkRequiredFileFields?.map((item) => {
      return {
        check: item?.data?.some(
          (subItem) =>
            subItem?.isRequired && [undefined, ""].includes(subItem?.value),
        ),
      };
    });

    const isRequired = checkRequiredFields?.some((item) => !item?.data?.value);
    const checkRequiredInRadioInputField = radioFields?.some((radioItem) =>
      radioItem?.data?.options?.some(
        (option) =>
          !!option?.isOptionInputRequired &&
          !!option?.selected &&
          !option?.optionInput?.value,
      ),
    );
    const isRequiredFile = checkRequiredInFile?.some((item) => item.check);
    if (isRequired || isRequiredFile || checkRequiredInRadioInputField) {
      setFieldError(true);
      return;
    } else if (!values?.grossRevenue && activeStep === 5) {
      setErrors((prev) => ({
        ...prev,
        grossRevenue: Labels.requiredField,
      }));
    } else if (!values?.netProfit && activeStep === 5) {
      setErrors((prev) => ({
        ...prev,
        netProfit: Labels.requiredField,
      }));
    } else if (
      (!values?.roleInBusiness?.value || !isAuthorityDeclared) &&
      activeStep === 6
    ) {
      toast.error(Labels.pleaseCompleteRequiredFields);
    } else {
      if (activeStep === 6) {
        setValues((prevState) => ({
          ...prevState,
          marketingCode: "",
        }));
        setShowAddMarketingCodeModal(true);
      } else {
        setActiveStep((prev) => prev + 1);
      }
    }
  };

  const handleSaveDraft = () => {
    setSaveDraftLoading(true);
    const payload = {
      details: formDetails,
      isActive: false,
      revenue: values?.grossRevenue ? Number(values?.grossRevenue) : 0,
      profit: values?.netProfit ? Number(values.netProfit) : 0,
      price: Number(price),
      businessTypeId: buisnessTypeId,
      countryId: countryId,
      cityId: cityId,
    };
    dispatch(
      addStartupDetailAction(
        payload,
        () => {
          setSaveDraftLoading(false);
          navigate(SCREENS.sellerListing);
        },
        localStorageLanguage,
        true,
        setIsDraftApiHit,
      ),
    );
  };

  const handlerPostPreviousMarketingCodeAction = useCallback(
    async (id) => {
      if (Boolean(checkInternetConnection(Labels))) {
        const params = {
          code: values?.marketingCode,
          startUpId: id,
        };
        setLoadingPrevMarketingCode(true);
        dispatch(
          addMarketingCodeAction(
            params,
            (res) => {
              if (!!res?.data) {
                setLoadingPrevMarketingCode(false);
                setShowAddMarketingCodeModal(false);
              }
            },
            navigate,
            localStorageLanguage,
          ),
        );
      }
    },
    [values, setLoadingPrevMarketingCode, navigate, dispatch],
  );

  const handleVerifyBusiness = (id) => {
    const isOtherRole = ["Other", "آخر"].includes(values?.roleInBusiness?.value)
      ? true
      : false;
    if (
      (!values.roleInBusiness &&
        (!values.companyLetterURL || !values.companyLetter)) ||
      (isOtherRole && !values?.otherRole)
    ) {
      toast.error(Labels.pleaseFillAllRequiredFields);
      return;
    }
    const obj = {
      role: isOtherRole ? values?.otherRole : values?.roleInBusiness?.value,
      // country: values?.country?.value,
      file: values?.companyLetterURL || "",
      startUpId: id,
    };
    dispatch(
      businessVerificationAction(
        obj,
        (res) => {
          if (res && !!values?.marketingCode) {
            handlerPostPreviousMarketingCodeAction(id);
          } else {
            // navigate(SCREENS.sellerListing);
          }
        },
        localStorageLanguage,
      ),
    );
  };

  const containerStyle = {
    width: 350,
    height: 200,
  };

  const handleUploadFile = (activeStep, index, subIndex, file) => {
    if (!allowedFileTypes.includes(file.type)) {
      toast.error(Labels.wrongFileType);
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    dispatch(
      uploadFile(
        formData,
        (res) => {
          setFormValuesForFile(activeStep, index, subIndex, res, {
            fileName: file.name,
            type: "new",
          });
        },
        setUploadFileLoader,
        Labels.fileUploadedSuccess,
      ),
    );
  };

  const setFormValuesForRadioField = (
    tabIndex,
    formIndex,
    optionIndex,
    val,
  ) => {
    let mappedOut = formDetails?.map((item, pIndex) => {
      if (pIndex === tabIndex) {
        return {
          ...item,
          dynamicForms: item?.dynamicForms?.map((_item, cIndex) => {
            if (cIndex === formIndex) {
              return {
                ..._item,
                data: {
                  ..._item?.data,
                  value: val,
                  options: _item?.data?.options?.map((subItem, subIndex) => {
                    if (optionIndex === subIndex) {
                      return { ...subItem, value: val, selected: true };
                    }
                    return { ...subItem, selected: false };
                  }),
                },
              };
            }
            return { ..._item };
          }),
        };
      }
      return { ...item };
    });
    setFormDetails(mappedOut);
  };

  const handleUploadVerifyFile = (file) => {
    setValues((prev) => ({
      ...prev,
      companyLetter: file,
      companyLetterURL: URL.createObjectURL(file),
    }));
    if (!allowedFileTypes.includes(file.type)) {
      toast.error(Labels.wrongFileType);
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    dispatch(
      uploadFile(
        formData,
        (res) => {
          setValues((prev) => ({
            ...prev,
            companyLetterURL: res,
          }));
        },
        setUploadFileLoader,
        "File Uploaded Success",
      ),
    );
  };

  const setFormValuesForRadioInputField = (
    tabIndex,
    formIndex,
    optionIndex,
    val,
  ) => {
    let mappedOut = formDetails?.map((item, pIndex) => {
      if (pIndex === tabIndex) {
        return {
          ...item,
          dynamicForms: item?.dynamicForms?.map((_item, cIndex) => {
            if (cIndex === formIndex) {
              return {
                ..._item,
                data: {
                  ..._item?.data,
                  options: _item?.data?.options?.map((subItem, subIndex) => {
                    if (optionIndex === subIndex) {
                      return {
                        ...subItem,
                        optionInput: { ...subItem?.optionInput, value: val },
                      };
                    }
                    return { ...subItem, selected: false };
                  }),
                },
              };
            }
            return { ..._item };
          }),
        };
      }
      return { ...item };
    });
    setFormDetails(mappedOut);
  };

  useEffect(() => {
    setCountry(
      !!formDetails[activeStep]?.dynamicForms?.find(
        (sItem) => sItem?.data?.type === "businessLocation",
      )?.data?.value
        ? lookup.byCountry(
            formDetails[activeStep]?.dynamicForms?.find(
              (sItem) => sItem?.data?.type === "businessLocation",
            )?.data?.value,
          )?.iso2
        : "sa",
    );
  }, [formDetails]);

  // console.log(formDetails[activeStep]?.dynamicForms, "formData ===>");

  const handleOnClickNextButton = () => {
    const check = formDetails[activeStep]?.dynamicForms
      ?.filter((item) => item?.data[0]?.isRequired)
      ?.some((item) => item?.data[0]?.value);

    if (activeStep === 4 && check) {
      const againMappedOut = formDetails?.map((item, index) => {
        if (index === activeStep) {
          return {
            ...item,
            dynamicForms: item?.dynamicForms?.map((_item) => {
              return {
                ..._item,
                data: _item?.data?.map((subItem) => {
                  if ([undefined, null, ""].includes(subItem?.value)) {
                    return {
                      ...subItem,
                      value: "",
                    };
                  }
                  return { ...subItem };
                }),
              };
            }),
          };
        }
        return { ...item };
      });
      setFormDetails(againMappedOut);
      handleNext();
    }
    // else if (activeStep === 6) {
    //   handleVerifyBusiness();
    // }
    else {
      handleNext();
    }
  };

  return (
    <React.Fragment>
      <CommonLayout>
        <div className='mx-auto w-11/12 md:w-11/12 lg:w-3/5 pt-2 md:p-4'>
          <div className='flex justify-center items-center'>
            <span className='text-fs_32 md:text-fs_40 font-general_semiBold text-center'>
              {Labels.addNewStartupForSale}
            </span>
          </div>

          <div className='stepper_container md:mt-30 mt-6'>
            <div className='font-general_medium font-medium'>
              <Stepper
                activeColor={"#47749e"}
                activeTitleColor={"#375979"}
                defaultColor={"#D1D1D1"}
                defaultTitleColor={"#D1D1D1"}
                completeColor={"#375979"}
                completeTitleColor={"#375979"}
                circleFontColor={"#FFFFFF"}
                completeBarColor={"#C6C6C6"}
                circleFontSize={width <= BreakPoints.MOBILE ? 14 : 18}
                titleFontSize={width <= BreakPoints.MOBILE ? 10 : 12}
                size={width <= BreakPoints.MOBILE ? 41 : 51}
                circleTop={10}
                titleTop={8}
                lineMarginOffset={0}
                defaultBorderWidth={8}
                steps={stepperSteps}
                activeStep={activeStep}
                isRtl={localStorageLanguage !== "eng"}
              />
            </div>
            <ApiLoader block={isLoading}>
              <>
                <div className='businessInfo_container grid grid-cols-12'>
                  <div className='col-span-12 md:mt-8 md:mb-8'>
                    <p className='col-span-12 flex md:px-0 px-4 justify-center text-fs_32 md:text-fs_28 font-general_semiBold md:mt-0 mt-4 text-black'>
                      {localStorageLanguage === "eng"
                        ? formDetails[activeStep]?.name_en
                        : formDetails[activeStep]?.name_ar}
                    </p>
                    <p className='col-span-12 flex md:px-0 px-4 justify-center text-fs_16 font-general_regular font-normal text-c_979797'>
                      {localStorageLanguage === "eng"
                        ? formDetails[activeStep]?.discription_en
                        : formDetails[activeStep]?.discription_ar}
                    </p>
                    <div className='col-span-12 mx-auto flex flex-col items-center justify-center mt-9'>
                      {formDetails[activeStep] &&
                        formDetails[activeStep]?.dynamicForms?.map(
                          (item, index) => {
                            return (
                              <div key={`add-startup-form-${index}`}>
                                {item?.formFields?.type === InputTypes.INPUT ? (
                                  <div className='relative flex flex-col gap-y-2 mb-5'>
                                    <label className='w-full text-c_181818 text-fs_14 font-general_medium font-medium'>
                                      {item?.data?.isRequired &&
                                      localStorageLanguage === "ar" ? (
                                        <span className='text-[#F00] mr-0.5'>
                                          *
                                        </span>
                                      ) : null}
                                      <span className={"capitalize"}>
                                        {localStorageLanguage === "eng"
                                          ? item?.data?.label?.en
                                          : item?.data?.label?.ar}
                                      </span>
                                      {item?.data?.isRequired &&
                                      localStorageLanguage === "eng" ? (
                                        <span className='text-[#F00] ml-0.5'>
                                          *
                                        </span>
                                      ) : null}
                                      {activeStep === 0 &&
                                      item?.data?.name === "Business Name" ? (
                                        <span className={"text-c_808080"}>
                                          {` (${Labels.businessNameIsHidden})`}
                                        </span>
                                      ) : null}
                                    </label>
                                    {item?.data?.type === "address" ? (
                                      <>
                                        <StartupInput
                                          ref={dateFounded}
                                          placeholder={
                                            localStorageLanguage === "eng"
                                              ? item?.data?.label?.en
                                              : item?.data?.label?.ar
                                          }
                                          onChange={(e) => {
                                            setFormValues(activeStep, index, {
                                              ...formDetails[
                                                activeStep
                                              ]?.dynamicForms?.find(
                                                (sItem) =>
                                                  sItem?.data?.type ===
                                                  "address",
                                              )?.data?.value,
                                              address: e.target.value,
                                            });
                                          }}
                                          value={item.data.value?.address ?? ""}
                                          className={`${
                                            item?.data?.value
                                              ? "border-[0.8px] border-c_0E73D0"
                                              : "border-[0.8px] border-c_535353"
                                          } w-[350px] bg-transparent rounded-xl text-fs_16 !pl-3 font-general_regular outline-none focus:border-[0.8px] focus:border-c_0E73D0 text-c_181818 placeholder:text-c_797979 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out`}
                                          error={
                                            !item?.data?.value &&
                                            Boolean(item?.data?.isRequired) &&
                                            Boolean(fieldError)
                                          }
                                          errorText={
                                            !item?.data?.value &&
                                            Boolean(fieldError) &&
                                            Boolean(item?.data?.isRequired)
                                              ? Labels.requiredField
                                              : null
                                          }
                                        />
                                      </>
                                    ) : (
                                      <>
                                        <StartupInput
                                          placeholder={
                                            localStorageLanguage === "eng"
                                              ? item?.data?.label?.en
                                              : item?.data?.label?.ar
                                          }
                                          value={
                                            item?.data?.type === "askingPrice"
                                              ? price
                                              : item.data.value ?? ""
                                          }
                                          disabled={
                                            [
                                              item?.data?.label.en,
                                              item?.data?.label.ar,
                                            ].includes(Labels.addressOne)
                                              ? true
                                              : false
                                          }
                                          onChange={(e) => {
                                            if (
                                              item?.data?.type === "askingPrice"
                                            ) {
                                              setPrice(
                                                e.target.value.replace(
                                                  /(?:^|[^0-9])0|[a-zA-Z\u0600-\u06FF]|[^0-9]/g,
                                                  "",
                                                ),
                                              );
                                              setFormValues(
                                                activeStep,
                                                index,
                                                [
                                                  "askingPrice",
                                                  "teamSize",
                                                  "noOfCustomers",
                                                ].includes(item?.data?.type)
                                                  ? e.target.value.replace(
                                                      /(?:^|[^0-9])0|[a-zA-Z\u0600-\u06FF]|[^0-9]/g,
                                                      "",
                                                    )
                                                  : e.target.value.replace(
                                                      /[٠-٩۰-۹]/g,
                                                      "",
                                                    ),
                                              );
                                            } else {
                                              setFormValues(
                                                activeStep,
                                                index,
                                                [
                                                  "askingPrice",
                                                  "teamSize",
                                                  "noOfCustomers",
                                                ].includes(item?.data?.type)
                                                  ? e.target.value.replace(
                                                      /(?:^|[^0-9])0|[a-zA-Z\u0600-\u06FF]|[^0-9]/g,
                                                      "",
                                                    )
                                                  : e.target.value.replace(
                                                      /[٠-٩۰-۹]/g,
                                                      "",
                                                    ),
                                              );
                                            }
                                          }}
                                          className={`${
                                            item?.data?.value
                                              ? "border-[0.8px] border-c_0E73D0"
                                              : "border-[0.8px] border-c_535353"
                                          } w-[350px] bg-transparent rounded-xl text-fs_16 font-general_regular font-normal outline-none focus:border-[0.8px] focus:border-c_0E73D0 text-c_181818 placeholder:text-c_797979 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out`}
                                          error={
                                            !item?.data?.value &&
                                            Boolean(fieldError) &&
                                            Boolean(item?.data?.isRequired)
                                          }
                                          errorText={
                                            !item?.data?.value &&
                                            Boolean(fieldError) &&
                                            Boolean(item?.data?.isRequired)
                                              ? Labels.requiredField
                                              : null
                                          }
                                        />
                                        {activeStep === 2 &&
                                        item?.formFields?.type === "input" ? (
                                          <span className='flex items-center justify-start gap-x-2 font-general_regular text-fs_14 text-c_A6A6A6'>
                                            <img src={info} alt='infoicon' />
                                            {Labels.buyerCannotSeeLocation}
                                          </span>
                                        ) : null}
                                      </>
                                    )}

                                    {/* {item?.data?.name === "Business Name" ? (
                                      <span className='flex items-center justify-start gap-x-2 font-general_regular text-fs_14 text-c_A6A6A6'>
                                        <img src={info} alt='infoicon' />
                                        {Labels.buyerCannotSeeBusinessName}
                                      </span>
                                    ) : null} */}
                                  </div>
                                ) : item?.formFields?.type ===
                                  InputTypes.CALENDAR ? (
                                  <div className='relative flex flex-col gap-y-2 mb-5'>
                                    <label className='capitalize text-c_181818 text-fs_14 font-general_medium font-medium'>
                                      {item?.data?.isRequired &&
                                      localStorageLanguage === "ar" ? (
                                        <span className='text-[#F00] mr-0.5'>
                                          *
                                        </span>
                                      ) : null}
                                      {localStorageLanguage === "eng"
                                        ? item?.data?.label?.en
                                        : item?.data?.label?.ar}
                                      {item?.data?.isRequired &&
                                      localStorageLanguage === "eng" ? (
                                        <span className='text-[#F00] ml-0.5'>
                                          *
                                        </span>
                                      ) : null}
                                    </label>

                                    <div className={"w-full"}>
                                      <Popover className={"w-full relative"}>
                                        <Popover.Button
                                          className={"w-full outline-none"}
                                        >
                                          <div className={"w-full"}>
                                            <TextInput
                                              type={"text"}
                                              placeholder={Labels.select}
                                              value={
                                                !!item?.data?.value
                                                  ? moment(
                                                      item?.data?.value,
                                                    ).format("DD/MM/YYYY")
                                                  : ""
                                              }
                                              isWidthFull
                                              className={`relative !w-[350px] p-2 ${
                                                localStorageLanguage === "eng"
                                                  ? "pl-10"
                                                  : "pr-10"
                                              } font-general_regular bg-transparent text-fs_16 placeholder:text-c_535353 text-c_181818 border-[0.8px] rounded-xl min-h-[49px] border-c_535353 focus:border-c_0E73D0 outline-none`}
                                              error={
                                                !item?.data?.value &&
                                                Boolean(
                                                  item?.data?.isRequired,
                                                ) &&
                                                Boolean(fieldError)
                                              }
                                              errorText={
                                                !item?.data?.value &&
                                                Boolean(fieldError) &&
                                                Boolean(item?.data?.isRequired)
                                                  ? Labels.requiredField
                                                  : null
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
                                              <Flatpickr
                                                options={{
                                                  inline: true,
                                                  monthSelectorType: "dropdown",
                                                  yearSelectorType: "dropdown",
                                                }}
                                                value={
                                                  !!item?.data?.value
                                                    ? moment(
                                                        item?.data?.value,
                                                      ).format("YYYY-MM-DD")
                                                    : ""
                                                }
                                                onChange={(selectedDates) => {
                                                  setFormValues(
                                                    activeStep,
                                                    index,
                                                    selectedDates[0],
                                                  );
                                                  close();
                                                }}
                                                className={
                                                  "hidden outline-none"
                                                }
                                              />
                                            )}
                                          </Popover.Panel>
                                        </Transition>
                                      </Popover>
                                    </div>
                                  </div>
                                ) : item?.formFields?.type ===
                                  InputTypes.DROPDOWN ? (
                                  <div className='relative flex flex-col gap-y-2 mb-5'>
                                    <label className='capitalize  text-c_181818 text-fs_14 font-general_medium font-medium'>
                                      {item?.data?.isRequired &&
                                      localStorageLanguage === "ar" ? (
                                        <span className='text-[#F00] mr-0.5'>
                                          *
                                        </span>
                                      ) : null}
                                      {localStorageLanguage === "eng"
                                        ? item?.data?.label?.en
                                        : item?.data?.label?.ar}
                                      {item?.data?.isRequired &&
                                      localStorageLanguage === "eng" ? (
                                        <span className='text-[#F00] ml-0.5'>
                                          *
                                        </span>
                                      ) : null}
                                    </label>
                                    <div className=''>
                                      {[
                                        formDetails[activeStep].name_en,
                                        formDetails[activeStep].name_ar,
                                      ].includes(Labels.businessLocation) ? (
                                        <>
                                          <SelectInput
                                            className='w-[350px] bg-transparent text-fs_16 font-general_regular font-normal'
                                            placeholder={Labels.select}
                                            value={
                                              !!item?.data?.value
                                                ? {
                                                    label:
                                                      localStorageLanguage ===
                                                      "eng"
                                                        ? typeof item?.data
                                                            ?.value === "object"
                                                          ? item?.data?.select?.find(
                                                              (val) =>
                                                                val?.label
                                                                  ?.en ===
                                                                item?.data
                                                                  ?.value
                                                                  ?.country,
                                                            )?.label?.en
                                                          : item?.data?.select?.find(
                                                              (val) =>
                                                                val?.label
                                                                  ?.en ===
                                                                item?.data
                                                                  ?.value,
                                                            )?.label?.en
                                                        : typeof item?.data
                                                            ?.value === "object"
                                                        ? item?.data?.select?.find(
                                                            (val) =>
                                                              val?.label?.en ===
                                                              item?.data?.value
                                                                ?.country,
                                                          )?.label?.ar
                                                        : item?.data?.select?.find(
                                                            (val) =>
                                                              val?.label?.en ===
                                                              item?.data?.value,
                                                          )?.label?.ar,
                                                    value:
                                                      localStorageLanguage ===
                                                      "eng"
                                                        ? typeof item?.data
                                                            ?.value === "object"
                                                          ? item?.data?.select?.find(
                                                              (val) =>
                                                                val?.label
                                                                  ?.en ===
                                                                item?.data
                                                                  ?.value
                                                                  ?.country,
                                                            )?.label?.en
                                                          : item?.data?.select?.find(
                                                              (val) =>
                                                                val?.label
                                                                  ?.en ===
                                                                item?.data
                                                                  ?.value,
                                                            )?.label?.en
                                                        : typeof item?.data
                                                            ?.value === "object"
                                                        ? item?.data?.select?.find(
                                                            (val) =>
                                                              val?.label?.en ===
                                                              item?.data?.value
                                                                ?.country,
                                                          )?.label?.ar
                                                        : item?.data?.select?.find(
                                                            (val) =>
                                                              val?.label?.en ===
                                                              item?.data?.value,
                                                          )?.label?.ar,
                                                  }
                                                : ""
                                            }
                                            options={item?.data?.select?.map(
                                              (val) => {
                                                return {
                                                  label:
                                                    localStorageLanguage ===
                                                    "eng"
                                                      ? val.label.en
                                                      : val.label.ar,
                                                  value:
                                                    localStorageLanguage ===
                                                    "eng"
                                                      ? val.label.en
                                                      : val.label.ar,
                                                };
                                              },
                                            )}
                                            onChange={(e) => {
                                              let selectedValue =
                                                item?.data?.select?.find(
                                                  (val) =>
                                                    localStorageLanguage !==
                                                    "eng"
                                                      ? val?.label?.ar ===
                                                        e.value
                                                      : val?.label?.en ===
                                                        e.value,
                                                );
                                              setCountryId(
                                                selectedValue?.optionId,
                                              );
                                              let newValue = {
                                                country:
                                                  localStorageLanguage === "eng"
                                                    ? selectedValue?.label?.en
                                                    : selectedValue?.label?.ar,
                                                countryCode:
                                                  selectedValue?.label?.en,
                                              };
                                              setFormValues(
                                                activeStep,
                                                index,
                                                newValue,
                                                "yes",
                                              );
                                            }}
                                            error={
                                              !item?.data?.value &&
                                              Boolean(item?.data?.isRequired) &&
                                              Boolean(fieldError)
                                            }
                                            errorText={
                                              !item?.data?.value &&
                                              Boolean(fieldError) &&
                                              Boolean(item?.data?.isRequired)
                                                ? Labels.requiredField
                                                : null
                                            }
                                          />
                                          {!!formDetails[
                                            activeStep
                                          ]?.dynamicForms?.find(
                                            (sItem) =>
                                              sItem?.data?.type ===
                                              "businessLocation",
                                          )?.data?.value &&
                                            item?.data?.type ===
                                              "businessLocation" && (
                                              <div className='w-full mt-[15px]'>
                                                <label className='capitalize text-c_181818 text-fs_14 font-general_medium font-medium mb-1'>
                                                  <p className={"mb-2"}>
                                                    {item?.data?.isRequired &&
                                                    localStorageLanguage ===
                                                      "ar" ? (
                                                      <span className='text-[#F00] mr-0.5'>
                                                        *
                                                      </span>
                                                    ) : null}

                                                    {Labels.city}

                                                    {item?.data?.isRequired &&
                                                    localStorageLanguage ===
                                                      "eng" ? (
                                                      <span className='text-[#F00] ml-0.5'>
                                                        *
                                                      </span>
                                                    ) : null}
                                                  </p>
                                                </label>
                                                <SelectInput
                                                  className={
                                                    "w-[350px] bg-transparent text-fs_16 font-general_regular font-normal"
                                                  }
                                                  placeholder={Labels.select}
                                                  value={
                                                    !!formDetails[
                                                      activeStep
                                                    ]?.dynamicForms?.find(
                                                      (sItem) =>
                                                        sItem?.data?.type ===
                                                        "address",
                                                    )?.data?.value?.city
                                                      ? {
                                                          label: formDetails[
                                                            activeStep
                                                          ]?.dynamicForms?.find(
                                                            (sItem) =>
                                                              sItem?.data
                                                                ?.type ===
                                                              "address",
                                                          )?.data?.value?.city,
                                                          value: formDetails[
                                                            activeStep
                                                          ]?.dynamicForms?.find(
                                                            (sItem) =>
                                                              sItem?.data
                                                                ?.type ===
                                                              "address",
                                                          )?.data?.value?.city,
                                                        }
                                                      : Labels.select
                                                  }
                                                  options={
                                                    !!item?.data?.value
                                                      ? cities?.map((_item) => {
                                                          return {
                                                            label:
                                                              localStorageLanguage ===
                                                              "eng"
                                                                ? _item?.name
                                                                : _item?.name_ar,
                                                            value:
                                                              localStorageLanguage ===
                                                              "eng"
                                                                ? _item?.name
                                                                : _item?.name_ar,
                                                          };
                                                        })
                                                      : []
                                                  }
                                                  onChange={async (e) => {
                                                    let findObj = cities?.find(
                                                      (_, _index) =>
                                                        localStorageLanguage ===
                                                        "eng"
                                                          ? _?.name === e?.label
                                                          : _?.name_ar ===
                                                            e?.label,
                                                    );
                                                    await Api._get(
                                                      `users/location-name?longitude=${
                                                        findObj.longitude
                                                      }&latitude=${
                                                        findObj.latitude
                                                      }&language=${
                                                        localStorageLanguage ===
                                                        "ar"
                                                          ? "ar"
                                                          : "en"
                                                      }`,
                                                      (success) => {
                                                        // console.log(
                                                        //   "success----->",
                                                        //   success,
                                                        // );
                                                        if (!!success?.data) {
                                                          setLocalCity(
                                                            !!success?.data
                                                              ?.address?.city
                                                              ? success?.data
                                                                  ?.address
                                                                  ?.city
                                                              : success?.data
                                                                  ?.address
                                                                  ?.state,
                                                          );
                                                        }
                                                        setFormValues(
                                                          activeStep,
                                                          index + 1,
                                                          {
                                                            address:
                                                              success?.data
                                                                ?.display_name,
                                                            lat: findObj?.latitude,
                                                            lng: findObj?.longitude,
                                                            city:
                                                              localStorageLanguage ===
                                                              "ar"
                                                                ? findObj?.name_ar
                                                                : findObj?.name,
                                                            country:
                                                              item?.data?.value,
                                                          },
                                                          "yes",
                                                        );
                                                        // console.log(findObj);
                                                        setCityId(findObj?.id);
                                                      },
                                                      (error) => {
                                                        console.log(error);
                                                      },
                                                    );

                                                    // let selectedValue =
                                                    //   item?.data?.select?.find(
                                                    //     (val) =>
                                                    //       localStorageLanguage !==
                                                    //       "eng"
                                                    //         ? val?.label?.ar ===
                                                    //           e.value
                                                    //         : val?.label?.en ===
                                                    //           e.value,
                                                    //   );
                                                    // setCountryId(
                                                    //   selectedValue?.optionId,
                                                    // );
                                                    // let newValue =
                                                    //   selectedValue?.label?.en;
                                                    // setFormValues(
                                                    //   activeStep,
                                                    //   index,
                                                    //   newValue,
                                                    //   "yes",
                                                    // );
                                                  }}
                                                  error={
                                                    !item?.data?.value &&
                                                    Boolean(
                                                      item?.data?.isRequired,
                                                    ) &&
                                                    Boolean(fieldError)
                                                  }
                                                  errorText={
                                                    !item?.data?.value &&
                                                    Boolean(fieldError) &&
                                                    Boolean(
                                                      item?.data?.isRequired,
                                                    )
                                                      ? Labels.requiredField
                                                      : null
                                                  }
                                                />
                                                {/* <GooglePlacesAutocomplete
                                                  apiKey={
                                                    import.meta.env
                                                      .VITE_APP_GOOGLE_MAP_API_KEY
                                                  }
                                                  autocompletionRequest={{
                                                    componentRestrictions: {
                                                      country: !!formDetails[
                                                        activeStep
                                                      ]?.dynamicForms?.find(
                                                        (sItem) =>
                                                          sItem?.data?.type ===
                                                          "businessLocation",
                                                      )?.data?.value
                                                        ? lookup.byCountry(
                                                            formDetails[
                                                              activeStep
                                                            ]?.dynamicForms?.find(
                                                              (sItem) =>
                                                                sItem?.data
                                                                  ?.type ===
                                                                "businessLocation",
                                                            )?.data?.value,
                                                          )?.iso2
                                                        : "sa",
                                                    },
                                                    types: ["(cities)"],
                                                  }}
                                                  ref={locationRef}
                                                  selectProps={{
                                                    placeholder: Labels.city,
                                                    value:
                                                      typeof formDetails[
                                                        activeStep
                                                      ]?.dynamicForms?.find(
                                                        (sItem) =>
                                                          sItem?.data?.type ===
                                                          "address",
                                                      )?.data?.value?.city ===
                                                      "string"
                                                        ? {
                                                            label: formDetails[
                                                              activeStep
                                                            ]?.dynamicForms?.find(
                                                              (sItem) =>
                                                                sItem?.data
                                                                  ?.type ===
                                                                "address",
                                                            )?.data?.value
                                                              ?.city,
                                                            value: formDetails[
                                                              activeStep
                                                            ]?.dynamicForms?.find(
                                                              (sItem) =>
                                                                sItem?.data
                                                                  ?.type ===
                                                                "address",
                                                            )?.data?.value
                                                              ?.city,
                                                          }
                                                        : "",
                                                    classNames: {
                                                      control: () =>
                                                        "!w-[350px]",
                                                      indicatorSeparator: () =>
                                                        "!hidden",
                                                      indicatorsContainer: () =>
                                                        "!hidden",
                                                    },
                                                    onChange: (e) => {
                                                      geocodeByAddress(
                                                        e.value.description,
                                                      )
                                                        .then((results) =>
                                                          getLatLng(results[0]),
                                                        )
                                                        .then(
                                                          async ({
                                                            lat,
                                                            lng,
                                                          }) => {
                                                            await Api._get(
                                                              `users/location-name?longitude=${lng}&latitude=${lat}`,
                                                              (success) => {
                                                                // console.log(
                                                                //   "success----->",
                                                                //   success,
                                                                // );
                                                                setFieldError(
                                                                  false,
                                                                );
                                                                setFormValues(
                                                                  activeStep,
                                                                  index + 1,
                                                                  {
                                                                    address:
                                                                      e.value
                                                                        .description,
                                                                    lat,
                                                                    lng,
                                                                    city: !!success
                                                                      ?.data
                                                                      ?.address
                                                                      ?.city
                                                                      ? success
                                                                          ?.data
                                                                          ?.address
                                                                          ?.city
                                                                      : success
                                                                          ?.data
                                                                          ?.address
                                                                          ?.state,
                                                                    country:
                                                                      success
                                                                        ?.data
                                                                        ?.address
                                                                        ?.country,
                                                                  },
                                                                );
                                                              },
                                                              () => {},
                                                            );
                                                          },
                                                        );
                                                    },
                                                    isOptionSelected: true,
                                                  }}
                                                /> */}
                                                {Boolean(fieldError) &&
                                                !!formDetails[
                                                  activeStep
                                                ]?.dynamicForms?.find(
                                                  (sItem) =>
                                                    sItem?.data?.type ===
                                                    "address",
                                                )?.data?.value?.city ? (
                                                  <p
                                                    className={
                                                      "text-c_FF3333 text-sm block font-general_regular font-normal"
                                                    }
                                                  >
                                                    {Labels.requiredField}
                                                  </p>
                                                ) : null}
                                                {!!formDetails[
                                                  activeStep
                                                ]?.dynamicForms?.find(
                                                  (sItem) =>
                                                    sItem?.data?.type ===
                                                    "address",
                                                )?.data?.value?.city && (
                                                  <div className='mt-4'>
                                                    {isLoaded ? (
                                                      <GoogleMap
                                                        mapContainerStyle={
                                                          containerStyle
                                                        }
                                                        onClick={async (e) => {
                                                          await Api._get(
                                                            `users/location-name?longitude=${e.latLng.lng()}&latitude=${e.latLng.lat()}&language=${
                                                              localStorageLanguage ===
                                                              "ar"
                                                                ? "ar"
                                                                : "en"
                                                            }`,
                                                            (success) => {
                                                              // console.log(
                                                              //   "success--->",
                                                              //   success,
                                                              //   countryCode,
                                                              // );
                                                              let city =
                                                                formDetails[
                                                                  activeStep
                                                                ]?.dynamicForms?.find(
                                                                  (sItem) =>
                                                                    sItem?.data
                                                                      ?.type ===
                                                                    "address",
                                                                )?.data?.value
                                                                  ?.city;
                                                              let findCity =
                                                                !!success?.data
                                                                  ?.address
                                                                  ?.city
                                                                  ? success
                                                                      ?.data
                                                                      ?.address
                                                                      ?.city
                                                                  : success
                                                                      ?.data
                                                                      ?.address
                                                                      ?.state;

                                                              if (
                                                                localCity ===
                                                                findCity
                                                              ) {
                                                                // console.log(
                                                                //   success,
                                                                //   "success",
                                                                // );
                                                                setFormValues(
                                                                  activeStep,
                                                                  index + 1,
                                                                  {
                                                                    ...formDetails[
                                                                      activeStep
                                                                    ]?.dynamicForms?.find(
                                                                      (sItem) =>
                                                                        sItem
                                                                          ?.data
                                                                          ?.type ===
                                                                        "address",
                                                                    )?.data
                                                                      ?.value,
                                                                    address:
                                                                      success
                                                                        ?.data
                                                                        ?.display_name,
                                                                    lat: event.latLng.lat(),
                                                                    lng: event.latLng.lng(),
                                                                  },
                                                                );
                                                              }
                                                            },
                                                            () => {},
                                                          );
                                                        }}
                                                        center={{
                                                          lat: formDetails[
                                                            activeStep
                                                          ]?.dynamicForms?.find(
                                                            (sItem) =>
                                                              sItem?.data
                                                                ?.type ===
                                                              "address",
                                                          )?.data?.value?.lat,
                                                          lng: formDetails[
                                                            activeStep
                                                          ]?.dynamicForms?.find(
                                                            (sItem) =>
                                                              sItem?.data
                                                                ?.type ===
                                                              "address",
                                                          )?.data?.value?.lng,
                                                        }}
                                                        zoom={5}
                                                      >
                                                        <Marker
                                                          position={{
                                                            lat: formDetails[
                                                              activeStep
                                                            ]?.dynamicForms?.find(
                                                              (sItem) =>
                                                                sItem?.data
                                                                  ?.type ===
                                                                "address",
                                                            )?.data?.value?.lat,
                                                            lng: formDetails[
                                                              activeStep
                                                            ]?.dynamicForms?.find(
                                                              (sItem) =>
                                                                sItem?.data
                                                                  ?.type ===
                                                                "address",
                                                            )?.data?.value?.lng,
                                                          }}
                                                          draggable
                                                          onDragEnd={async (
                                                            event,
                                                          ) => {
                                                            await Api._get(
                                                              `users/location-name?longitude=${event.latLng.lng()}&latitude=${event.latLng.lat()}&language=${
                                                                localStorageLanguage ===
                                                                "ar"
                                                                  ? "ar"
                                                                  : "en"
                                                              }`,
                                                              (success) => {
                                                                let city =
                                                                  formDetails[
                                                                    activeStep
                                                                  ]?.dynamicForms?.find(
                                                                    (sItem) =>
                                                                      sItem
                                                                        ?.data
                                                                        ?.type ===
                                                                      "address",
                                                                  )?.data?.value
                                                                    ?.city;
                                                                let findCity =
                                                                  !!success
                                                                    ?.data
                                                                    ?.address
                                                                    ?.city
                                                                    ? success
                                                                        ?.data
                                                                        ?.address
                                                                        ?.city
                                                                    : success
                                                                        ?.data
                                                                        ?.address
                                                                        ?.state;

                                                                if (
                                                                  localCity ===
                                                                  findCity
                                                                ) {
                                                                  setFormValues(
                                                                    activeStep,
                                                                    index + 1,
                                                                    {
                                                                      ...formDetails[
                                                                        activeStep
                                                                      ]?.dynamicForms?.find(
                                                                        (
                                                                          sItem,
                                                                        ) =>
                                                                          sItem
                                                                            ?.data
                                                                            ?.type ===
                                                                          "address",
                                                                      )?.data
                                                                        ?.value,
                                                                      address:
                                                                        success
                                                                          ?.data
                                                                          ?.display_name,
                                                                      lat: event.latLng.lat(),
                                                                      lng: event.latLng.lng(),
                                                                    },
                                                                  );
                                                                } else {
                                                                  setFormValues(
                                                                    activeStep,
                                                                    index + 1,
                                                                    {
                                                                      ...formDetails[
                                                                        activeStep
                                                                      ]?.dynamicForms?.find(
                                                                        (
                                                                          sItem,
                                                                        ) =>
                                                                          sItem
                                                                            ?.data
                                                                            ?.type ===
                                                                          "address",
                                                                      )?.data
                                                                        ?.value,
                                                                    },
                                                                  );
                                                                }
                                                              },
                                                              () => {},
                                                            );
                                                          }}
                                                        />
                                                      </GoogleMap>
                                                    ) : (
                                                      <></>
                                                    )}
                                                  </div>
                                                )}
                                              </div>
                                            )}
                                        </>
                                      ) : (
                                        <>
                                          <SelectInput
                                            className='w-[350px] bg-transparent text-fs_16 font-general_regular font-normal'
                                            placeholder={Labels.select}
                                            value={
                                              typeof item?.data?.value ===
                                                "string" && !!item?.data?.value
                                                ? {
                                                    label:
                                                      localStorageLanguage ===
                                                      "eng"
                                                        ? item?.data?.select?.find(
                                                            (val) =>
                                                              val?.label?.en ===
                                                              item?.data?.value,
                                                          )?.label?.en
                                                        : item?.data?.select?.find(
                                                            (val) =>
                                                              val?.label?.ar ===
                                                              item?.data?.value,
                                                          )?.label?.ar,
                                                    value:
                                                      localStorageLanguage ===
                                                      "eng"
                                                        ? item?.data?.select?.find(
                                                            (val) =>
                                                              val?.label?.en ===
                                                              item?.data?.value,
                                                          )?.label?.en
                                                        : item?.data?.select?.find(
                                                            (val) =>
                                                              val?.label?.ar ===
                                                              item?.data?.value,
                                                          )?.label?.ar,
                                                  }
                                                : ""
                                            }
                                            options={item?.data?.select?.map(
                                              (val) => {
                                                return {
                                                  label:
                                                    localStorageLanguage ===
                                                    "eng"
                                                      ? val.label.en
                                                      : val.label.ar,
                                                  value:
                                                    localStorageLanguage ===
                                                    "eng"
                                                      ? val.label.en
                                                      : val.label.ar,
                                                };
                                              },
                                            )}
                                            onChange={(e) => {
                                              let selectedValue =
                                                item?.data?.select?.find(
                                                  (val) =>
                                                    localStorageLanguage !==
                                                    "eng"
                                                      ? val?.label?.ar ===
                                                        e.value
                                                      : val?.label?.en ===
                                                        e.value,
                                                );
                                              if (
                                                item?.data?.type ===
                                                "businessType"
                                              ) {
                                                setBusinessTypeId(
                                                  selectedValue?.optionId,
                                                );
                                              }
                                              let newValue =
                                                localStorageLanguage === "eng"
                                                  ? selectedValue?.label?.en
                                                  : selectedValue?.label?.ar;
                                              setFormValues(
                                                activeStep,
                                                index,
                                                newValue,
                                              );
                                            }}
                                            error={
                                              !item?.data?.value &&
                                              Boolean(item?.data?.isRequired) &&
                                              Boolean(fieldError)
                                            }
                                            errorText={
                                              !item?.data?.value &&
                                              Boolean(fieldError) &&
                                              Boolean(item?.data?.isRequired)
                                                ? Labels.requiredField
                                                : null
                                            }
                                          />
                                        </>
                                      )}
                                    </div>
                                  </div>
                                ) : item.formFields.type ===
                                  InputTypes.TEXTAREA ? (
                                  <div className='relative flex flex-col gap-y-2'>
                                    <label className='capitalize  text-c_181818 text-fs_14 font-general_medium font-medium'>
                                      {item?.data?.isRequired &&
                                      localStorageLanguage === "ar" ? (
                                        <span className='text-[#F00] mr-0.5'>
                                          *
                                        </span>
                                      ) : null}
                                      {localStorageLanguage === "eng"
                                        ? item?.data?.label?.en
                                        : item?.data?.label?.ar}
                                      {item?.data?.isRequired &&
                                      localStorageLanguage === "eng" ? (
                                        <span className='text-[#F00] ml-0.5'>
                                          *
                                        </span>
                                      ) : null}
                                    </label>
                                    <TextAreaWithCount
                                      type='text'
                                      rows={2}
                                      maxChar={1000}
                                      placeholder={
                                        localStorageLanguage === "eng"
                                          ? item?.data?.label?.en
                                          : item?.data?.label?.ar
                                      }
                                      value={item.data.value ?? ""}
                                      length={item.data.value?.length || 0}
                                      onChange={(e) => {
                                        setFormValues(
                                          activeStep,
                                          index,
                                          e.target.value.replace(
                                            /[٠-٩۰-۹]/g,
                                            "",
                                          ),
                                        );
                                      }}
                                      className={`${
                                        item?.data?.value
                                          ? "border-[0.8px] border-c_0E73D0"
                                          : "border-[0.8px] border-c_535353"
                                      } w-[350px] resize-none bg-transparent rounded-xl text-fs_16 font-general_regular outline-none focus:border-[0.8px] focus:border-c_0E73D0 text-c_535353 placeholder:text-c_797979 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out`}
                                      error={
                                        !item?.data?.value &&
                                        Boolean(item?.data?.isRequired) &&
                                        Boolean(fieldError)
                                      }
                                      errorText={
                                        !item?.data?.value &&
                                        Boolean(fieldError) &&
                                        Boolean(item?.data?.isRequired)
                                          ? Labels.requiredField
                                          : null
                                      }
                                    />
                                  </div>
                                ) : item?.formFields?.type ===
                                  InputTypes.FILE ? (
                                  item?.data?.map((subItem, subIndex) => {
                                    return !subItem.value ? (
                                      <div
                                        key={subIndex}
                                        className='relative flex flex-col gap-y-2 mb-5'
                                      >
                                        <label className='capitalize text-c_181818 text-fs_14 font-general_medium font-medium'>
                                          {subItem?.isRequired &&
                                          localStorageLanguage === "ar" ? (
                                            <span className='text-[#F00] mr-0.5'>
                                              *
                                            </span>
                                          ) : null}
                                          {localStorageLanguage === "eng"
                                            ? subItem?.label?.en
                                            : subItem?.label?.ar}
                                          {subItem?.isRequired &&
                                          localStorageLanguage === "eng" ? (
                                            <span className='text-[#F00] ml-0.5'>
                                              *
                                            </span>
                                          ) : null}
                                        </label>
                                        <FileAddComponent
                                          onChange={(file) => {
                                            handleUploadFile(
                                              activeStep,
                                              index,
                                              subIndex,
                                              file,
                                            );
                                          }}
                                          error={
                                            !subItem?.value &&
                                            Boolean(subItem?.isRequired) &&
                                            Boolean(fieldError)
                                          }
                                          errorText={
                                            !subItem?.value &&
                                            Boolean(fieldError) &&
                                            Boolean(subItem?.isRequired)
                                              ? Labels.requiredField
                                              : null
                                          }
                                        />
                                      </div>
                                    ) : (
                                      <div
                                        key={subIndex}
                                        className='relative flex flex-col gap-y-2 mb-5'
                                      >
                                        <label className='capitalize text-c_181818 text-fs_14 font-general_medium font-medium'>
                                          {subItem?.isRequired &&
                                          localStorageLanguage === "ar" ? (
                                            <span className='text-[#F00] mr-0.5'>
                                              *
                                            </span>
                                          ) : null}
                                          {localStorageLanguage === "eng"
                                            ? subItem?.label?.en
                                            : subItem?.label?.ar}
                                          {subItem?.isRequired &&
                                          localStorageLanguage === "eng" ? (
                                            <span className='text-[#F00] ml-0.5'>
                                              *
                                            </span>
                                          ) : null}
                                        </label>
                                        <div className='flex flex-row justify-between items-center bg-c_FFFFFF rounded-xl relative h-14 px-3 gap-y-4 border-[3px] border-dotted border-c_9A9A9A min-w-[350px] max-w-[350px]'>
                                          <div className='flex items-center'>
                                            <img
                                              src={attachmentImg}
                                              alt={
                                                getFileNameByUrl(
                                                  subItem?.value,
                                                ) ?? "uploadedfile"
                                              }
                                              className={`${
                                                getFileTypeByUrl(subItem?.value)
                                                  ? "!w-7 !h-7"
                                                  : "!w-7 !h-7"
                                              }`}
                                            />
                                            <span className='ml-3.5'>
                                              {`${`${
                                                getFileNameByUrl(subItem?.value)
                                                  ?.length > 18
                                                  ? `${getFileNameByUrl(
                                                      subItem?.value,
                                                    )?.slice(0, 17)}`
                                                  : item?.value
                                              }`}` || ""}
                                            </span>
                                          </div>
                                          <button
                                            className=''
                                            onClick={() =>
                                              setFormValuesForFile(
                                                activeStep,
                                                index,
                                                subIndex,
                                                "",
                                                {
                                                  fileName: "",
                                                  type: "",
                                                },
                                              )
                                            }
                                          >
                                            <img
                                              src={deleteTag}
                                              alt={"deleteicon"}
                                              className='h-5 w-4 cursor-pointer'
                                            />
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })
                                ) : item?.formFields?.type ===
                                  InputTypes.RADIO ? (
                                  <div className='max-w-[350px] min-w-[350px] flex flex-col items-start justify-start gap-y-2 mt-4'>
                                    <label className='capitalize text-c_181818 text-fs_14 font-general_medium font-medium'>
                                      {item?.data?.isRequired &&
                                      localStorageLanguage === "ar" ? (
                                        <span className='text-[#F00] mr-0.5'>
                                          *
                                        </span>
                                      ) : null}
                                      {localStorageLanguage === "eng"
                                        ? item?.data?.label?.en
                                        : item?.data?.label?.ar}
                                      {item?.data?.isRequired &&
                                      localStorageLanguage === "eng" ? (
                                        <span className='text-[#F00] ml-0.5'>
                                          *
                                        </span>
                                      ) : null}
                                    </label>
                                    <div className={"mt-2"}>
                                      <CustomRadioBtn
                                        value={item?.data?.value}
                                        options={item?.data?.options}
                                        onChangeValue={(i, value) => {
                                          setFormValuesForRadioInputField(
                                            activeStep,
                                            index,
                                            i,
                                            value,
                                          );
                                        }}
                                        onChange={(value, i) =>
                                          setFormValuesForRadioField(
                                            activeStep,
                                            index,
                                            i,
                                            value,
                                          )
                                        }
                                        error={
                                          !item?.data?.value &&
                                          Boolean(item?.data?.isRequired) &&
                                          Boolean(fieldError)
                                        }
                                        errorText={
                                          !item?.data?.value &&
                                          Boolean(fieldError) &&
                                          Boolean(item?.data?.isRequired)
                                            ? Labels.requiredField
                                            : null
                                        }
                                        fieldError={fieldError}
                                        setFieldError={setFieldError}
                                      />
                                    </div>
                                  </div>
                                ) : item?.formFields?.type ===
                                  InputTypes.TAG ? (
                                  <div className='max-w-[350px] min-w-[350px] flex flex-col items-start justify-start gap-y-2'>
                                    <label className='capitalize text-c_181818 text-fs_14 font-general_medium font-medium'>
                                      {item?.data?.isRequired &&
                                      localStorageLanguage === "ar" ? (
                                        <span className='text-[#F00] mr-0.5'>
                                          *
                                        </span>
                                      ) : null}
                                      {localStorageLanguage === "eng"
                                        ? item?.data?.label?.en
                                        : item?.data?.label?.ar}
                                      {item?.data?.isRequired &&
                                      localStorageLanguage === "eng" ? (
                                        <span className='text-[#F00] ml-0.5'>
                                          *
                                        </span>
                                      ) : null}
                                    </label>
                                    <div>
                                      <CustomTagSelect
                                        options={item.data.options}
                                        prevTags={item?.data?.value}
                                        onChange={(tag) =>
                                          setFormValues(activeStep, index, [
                                            ...tag,
                                          ])
                                        }
                                        error={
                                          !item?.data?.value &&
                                          Boolean(item?.data?.isRequired) &&
                                          Boolean(fieldError)
                                        }
                                        errorText={
                                          !item?.data?.value &&
                                          Boolean(item?.data?.isRequired) &&
                                          Boolean(fieldError)
                                            ? Labels.requiredField
                                            : null
                                        }
                                      />
                                    </div>
                                  </div>
                                ) : null}
                              </div>
                            );
                          },
                        )}
                      {activeStep === 5 ? (
                        <div>
                          <p className='col-span-12 flex md:px-0 px-4 justify-center text-fs_32 md:text-fs_28 font-general_semiBold text-black'>
                            {Labels.financial}
                          </p>
                          <p className='col-span-12 flex md:px-0 px-4 justify-center text-fs_16 font-general_regular font-normal text-c_979797'>
                            {Labels.addBusinessFinanceDetails}
                          </p>
                          <div className='relative flex flex-col gap-y-2 mt-10 mb-5'>
                            <label className='w-full capitalize text-c_181818 text-fs_14 font-general_medium font-medium'>
                              {Labels.ttmGrossRevenue}
                            </label>
                            <StartupInput
                              type={"text"}
                              placeholder={Labels.ttmGrossRevenue}
                              value={values?.grossRevenue}
                              onChange={(e) => {
                                setErrors((prev) => ({
                                  ...prev,
                                  grossRevenue: null,
                                }));
                                setValues((prevState) => ({
                                  ...prevState,
                                  grossRevenue: e.target.value.replace(
                                    /(?:^|[^0-9])0|[a-zA-Z\u0600-\u06FF]|[^0-9eE]/g,
                                    "",
                                  ),
                                }));
                              }}
                              maxLength={9}
                              className='w-[350px] bg-transparent rounded-xl text-fs_14 font-general_medium outline-none focus:border-[0.8px] focus:border-c_0E73D0 border-[0.8px] border-c_535353 text-c_181818 placeholder:text-c_797979 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out'
                              error={Boolean(errors?.grossRevenue)}
                              errorText={errors?.grossRevenue}
                            />
                          </div>
                          <div className='relative flex flex-col gap-y-2 my-2'>
                            <label className='w-full capitalize text-c_181818 text-fs_14 font-general_medium font-medium'>
                              {Labels.ttmNetRevenue}
                            </label>
                            <StartupInput
                              type={"text"}
                              placeholder={Labels.ttmNetRevenue}
                              value={values?.netProfit}
                              onChange={(e) => {
                                setErrors((prev) => ({
                                  ...prev,
                                  netProfit: null,
                                }));
                                setValues((prevState) => ({
                                  ...prevState,
                                  netProfit: e.target.value.replace(
                                    /(?:^|[^0-9])0|[a-zA-Z\u0600-\u06FF]|[^0-9eE]/g,
                                    "",
                                  ),
                                }));
                              }}
                              className='w-[350px] bg-transparent rounded-xl text-fs_14 font-general_medium outline-none focus:border-[0.8px] focus:border-c_0E73D0 border-[0.8px] border-c_535353 text-c_181818 placeholder:text-c_797979 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out'
                              error={Boolean(errors?.netProfit)}
                              errorText={errors?.netProfit}
                            />
                          </div>
                        </div>
                      ) : setting.some(
                          (item) =>
                            item?.key === BusinessVerified.BUSINESSVERIFIED &&
                            item?.value === "true",
                        ) && activeStep === 6 ? (
                        <div>
                          <p className='col-span-12 flex md:px-0 px-4 justify-center text-fs_32 md:text-fs_28 font-general_semiBold text-black'>
                            {Labels.verifyBusiness}
                          </p>
                          <p className='col-span-12 flex md:px-0 px-4 justify-center text-fs_16 font-general_regular font-normal text-c_979797'>
                            {Labels.addBusinessDetails}
                          </p>

                          {/* <div className="relative flex flex-col gap-y-2 mb-5">
                            <label className="capitalize  text-c_181818 text-fs_14 font-general_medium font-medium">
                              {Labels.selectCountry}
                            </label>
                            <div className="mt-2">
                              <SelectInput
                                className="w-[350px] bg-transparent"
                                value={values?.country}
                                options={
                                  localStorageLanguage === "eng"
                                    ? countriesConstant
                                    : countriesConstantArabic
                                }
                                onChange={(e) => {
                                  setValues((prevState) => ({
                                    ...prevState,
                                    country: e,
                                  }));
                                }}
                              />
                            </div>
                          </div> */}
                          <div className={"mt-6"}>
                            <label
                              className={
                                "text-c_181818 text-fs_14 leading-[20px] font-general_medium font-medium"
                              }
                            >
                              {Labels.authorizationLetter}
                              {/* <span className={"text-c_C30000"}>*</span> */}
                              <p
                                className={
                                  "text-c_181818 text-fs_12 italic !w-[44ch] break-words font-general_regular font-normal mt-0 mb-3"
                                }
                              >
                                {`(${Labels.authenticatingYourBusinessWillIncreaseTheChance})`}
                              </p>
                            </label>
                            <div
                              className={
                                "relative flex flex-col gap-y-2 bg-white rounded-lg"
                              }
                            >
                              {values?.companyLetter ? (
                                <div className='flex flex-row justify-between items-center rounded-xl relative h-20 px-3 gap-y-2 border-[3px] border-dotted border-c_9A9A9A min-w-[350px] max-w-[350px]'>
                                  <>
                                    <div className='flex items-center'>
                                      <img
                                        src={attachmentImg}
                                        alt={"uploadedfile"}
                                        className={`${
                                          !values?.companyLetter
                                            ? "!w-6 !h-6"
                                            : "!w-6 !h-6"
                                        }`}
                                      />
                                      <span
                                        className={`${
                                          localStorageLanguage === "eng"
                                            ? "ml-3.5"
                                            : "mr-3.5"
                                        }`}
                                      >
                                        {`${
                                          values?.companyLetter?.name.length >
                                          21
                                            ? `${values?.companyLetter?.name?.slice(
                                                0,
                                                20,
                                              )}...`
                                            : values?.companyLetter?.name
                                        }` ?? ""}
                                      </span>
                                    </div>
                                    {values?.companyLetter && (
                                      <button
                                        className={""}
                                        onClick={() =>
                                          setValues((prevState) => ({
                                            ...prevState,
                                            companyLetter: "",
                                            companyLetterURL: "",
                                          }))
                                        }
                                      >
                                        <img
                                          src={deleteTag}
                                          alt={"deleteicon"}
                                          className={"h-5 w-4 cursor-pointer"}
                                        />
                                      </button>
                                    )}

                                    {!values?.companyLetter && (
                                      <>
                                        <p className='text-c_181818 font-general_medium text-center break-words font-normal text-fs_12 px-3'>
                                          {/* {Labels.dragAndDropOr}{" "}
                                        <span className='text-c_0D6DDE'>
                                          {Labels.chooseFile}
                                        </span>{" "}
                                        {Labels.toUpload} */}
                                          {
                                            Labels.toGiveYourBusinessAMarkOfAuthentication
                                          }
                                        </p>
                                        <input
                                          type={"file"}
                                          ref={companyLetterfileRef}
                                          accept={
                                            ".pdf,.doc,.docx,.jpg,.jpeg,.png,.JPG,.JPEG,.PNG"
                                          }
                                          onChange={(e) => {
                                            if (e?.target?.files[0]) {
                                              handleUploadVerifyFile(
                                                e.target.files[0],
                                              );
                                            }
                                          }}
                                          className='min-w-[350px] max-w-[350px] rounded-xl h-40 absolute top-0 left-0 cursor-pointer opacity-0 bg-c_fff/5'
                                        />
                                      </>
                                    )}
                                  </>
                                </div>
                              ) : (
                                <div
                                  className={`flex flex-col justify-center items-center rounded-xl relative ${
                                    localStorageLanguage === "eng"
                                      ? "h-[200px]"
                                      : "h-44"
                                  } gap-y-2 border-[3px] border-dotted border-c_9A9A9A min-w-[350px] max-w-[350px]`}
                                >
                                  <>
                                    <img
                                      src={
                                        getFileTypeByUrl(
                                          values.companyLetterURL,
                                        ) === FileTypes.PDF
                                          ? PdfFileIcon
                                          : [
                                              FileTypes.DOC,
                                              FileTypes.DOCX,
                                            ].includes(
                                              getFileTypeByUrl(
                                                values.companyLetterURL,
                                              ),
                                            )
                                          ? DocFileIcon
                                          : values?.companyLetter
                                          ? values?.companyLetterURL
                                          : uploadIcon
                                      }
                                      alt={"uploadedfile"}
                                      className={`${
                                        !values?.companyLetter
                                          ? "!w-8 !h-8"
                                          : "!w-18 !h-16"
                                      }`}
                                    />
                                    {values?.companyLetter && (
                                      <button
                                        className='absolute -top-4 -right-2'
                                        onClick={() =>
                                          setValues((prevState) => ({
                                            ...prevState,
                                            companyLetter: "",
                                            companyLetterURL: "",
                                          }))
                                        }
                                      >
                                        <div className='bg-c_C30000 p-2 rounded-full'>
                                          <RiDeleteBin7Line className='text-fs_20 text-c_FFFFFF' />
                                        </div>
                                      </button>
                                    )}
                                    <span className=''>
                                      {values?.companyLetterURL
                                        ? `${getFileNameByUrl(
                                            values.companyLetterURL,
                                          ).slice(0, 20)}...`
                                        : ""}
                                    </span>
                                    {!values?.companyLetter && (
                                      <>
                                        <p className='text-c_181818 font-general_medium text-center break-words font-normal text-fs_12 px-3'>
                                          {/* {Labels.dragAndDropOr}{" "}
                                        <span className='text-c_0D6DDE'>
                                          {Labels.chooseFile}
                                        </span>{" "}
                                        {Labels.toUpload} */}
                                          {
                                            Labels.toGiveYourBusinessAMarkOfAuthentication
                                          }
                                        </p>
                                        <input
                                          type={"file"}
                                          ref={companyLetterfileRef}
                                          accept={
                                            ".pdf,.doc,.docx,.jpg,.jpeg,.png,.JPG,.JPEG,.PNG"
                                          }
                                          onChange={(e) => {
                                            if (e?.target?.files[0]) {
                                              handleUploadVerifyFile(
                                                e.target.files[0],
                                              );
                                            }
                                          }}
                                          className='min-w-[350px] max-w-[350px] rounded-xl h-40 absolute top-0 left-0 cursor-pointer opacity-0 bg-c_fff/5'
                                        />
                                      </>
                                    )}
                                  </>
                                </div>
                              )}
                            </div>

                            <div className='flex items-center gap-x-2 my-4'>
                              <TextInput
                                type={"checkbox"}
                                name={"isAuthorityDeclared"}
                                id={"isAuthorityDeclared"}
                                checked={isAuthorityDeclared}
                                onChange={() =>
                                  setIsAuthorityDeclared((prev) => !prev)
                                }
                                className={`flex items-center h-4 w-4 rounded cursor-pointer accent-c_1F3D57 mb-3`}
                              />
                              <label
                                htmlFor={"isAuthorityDeclared"}
                                className={
                                  "text-fs_12 cursor-pointer text-c_A6A6A6 w-[40ch] break-words select-none"
                                }
                              >
                                {Labels.iDeclareThatIHaveFullAuthorityToList}
                                <span className={"text-c_C30000 !text-fs_16"}>
                                  *
                                </span>
                              </label>
                            </div>
                          </div>

                          <div className='relative flex flex-col gap-y-2 my-5'>
                            <label className='capitalize text-c_181818 text-fs_14 font-general_medium font-medium'>
                              {Labels.yourRoleInBusiness}
                              <span className={"text-c_C30000"}>*</span>
                            </label>
                            <div className='mt-0'>
                              <SelectInput
                                className={"w-[350px] bg-transparent"}
                                placeholder={Labels.select}
                                value={values?.roleInBusiness}
                                options={
                                  localStorageLanguage === "eng"
                                    ? userRoles
                                    : userRolesArabic
                                }
                                onChange={(e) => {
                                  setValues((prevState) => ({
                                    ...prevState,
                                    roleInBusiness: e,
                                  }));
                                  setErrors((prevState) => ({
                                    ...prevState,
                                    roleInBusiness: null,
                                  }));
                                }}
                              />

                              {/* {["Other", "آخر"].includes(
                                values?.roleInBusiness?.value,
                              ) ? (
                                <Fragment>
                                  <TextInput
                                    id={"otherRole"}
                                    name={"otherRole"}
                                    className={`mt-2 p-2 pl-4 font-general_regular font-normal text-fs_16 placeholder:text-c_535353 text-c_181818 border-[0.8px] rounded-xl w-full min-h-[49px] border-c_535353 focus:border-c_0E73D0 outline-none`}
                                    placeholder={Labels.otherRole}
                                    value={values?.otherRole}
                                    onChange={(e) => {
                                      setValues((prev) => ({
                                        ...prev,
                                        otherRole: e.target.value,
                                      }));
                                    }}
                                  />
                                </Fragment>
                              ) : (
                                <></>
                              )} */}
                            </div>
                          </div>

                          {/* <p className='my-3 flex items-center justify-start gap-x-2 font-general_regular text-fs_14 text-c_A6A6A6'>
                            <img src={info} alt='infoicon' />
                            {Labels.uploadLetterWithCompanyHeader}
                          </p> */}
                        </div>
                      ) : (
                        <></>
                      )}
                      {activeStep === 4 ? (
                        <div className='w-[360px] mt-5'>
                          <Divider />
                          <span className='flex items-center justify-start gap-x-2 font-general_regular text-fs_12 text-c_A6A6A6 mt-3.5'>
                            <img src={info} alt='infoicon' />
                            {
                              Labels.documentAreConfidentailsAndWontBeSharedWithBuyers
                            }
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className='md:w-[350px] w-full m-auto flex justify-center gap-3 flex-col md:mt-0 mt-5 mb-1'>
                  <div className=''>
                    <Button
                      className={`w-full max-w-full`}
                      onClick={handleOnClickNextButton}
                      // disabled={
                      //   activeStep === 6 &&
                      //   (!values?.roleInBusiness || !isAuthorityDeclared)
                      //     ? true
                      //     : false
                      // }
                    >
                      {activeStep === 6 ? Labels.done : Labels.next}
                    </Button>
                  </div>
                </div>
                <div className='md:w-[350px] w-full m-auto flex items-center justify-center md:gap-x-2 gap-x-1 md:px-0'>
                  <Button
                    variant={"secondary"}
                    onClick={() => {
                      activeStep === 0
                        ? navigate(SCREENS.sellerListing)
                        : setActiveStep((prev) => prev - 1);
                    }}
                    className={`py-3 px-12 w-full md:w-[171px] rounded-lg capitalize font-general_regular text-f_12 md:text-f_14 bg-c_D9D9D9`}
                  >
                    {activeStep === 0 ? Labels.cancel : Labels.back}
                  </Button>
                  <Button
                    variant={
                      !!isAllFieldsEmpty ? "draft-btn-disabled" : "draft"
                    }
                    className={"w-full md:w-[171px]"}
                    spinnerColor={"#1C2F40"}
                    isLoading={saveDraftLoading}
                    disabled={Boolean(isAllFieldsEmpty)}
                    onClick={handleSaveDraft}
                  >
                    {Labels.saveDraft}
                  </Button>
                </div>
                {/* {activeStep === 6 && (
                  <div
                    className={
                      "w-[350px] m-auto flex items-center justify-center md:gap-x-2 gap-x-1 md:px-0 md:my-0 my-6"
                    }
                  >
                    <Button
                      size={"lg"}
                      variant='skip-now-btn'
                      onClick={() => setShowAddMarketingCodeModal(true)}
                    >
                      {Labels.skip}
                    </Button>
                  </div>
                )} */}
              </>
            </ApiLoader>
          </div>
          {/* horizontal steops ends here */}
        </div>
      </CommonLayout>
      {showVerifyStartupModal && (
        <VerifyStartupModal
          showVerifyStartupModal={showVerifyStartupModal}
          startupId={addStartUpIdOnPost?.payload}
          setShowVerifyStartupModal={() =>
            setShowVerifyStartupModal((prev) => !prev)
          }
          setFormDetails={setFormDetails}
        />
      )}
      {showVerifyOtpModal && (
        <VerifyOtpModal
          price={price}
          values={values}
          setValues={setValues}
          formDetails={formDetails}
          setActiveStep={setActiveStep}
          showVerifyOtpModal={showVerifyOtpModal}
          setShowVerifyOtpModal={() => setShowVerifyOtpModal((prev) => !prev)}
          verifyBusinessResponse={verifyBusinessResponse}
          setVerifyBusinessResponse={setVerifyBusinessResponse}
          handleVerifyBusiness={handleVerifyBusiness}
          startupIdAfterPostStartup={startupIdAfterPostStartup}
          setStartupIdAfterPostStartup={setStartupIdAfterPostStartup}
          handlerPostPreviousMarketingCodeAction={
            handlerPostPreviousMarketingCodeAction
          }
          setIsAuthorityDeclared={setIsAuthorityDeclared}
          successAddStartupMessage={successAddStartupMessage}
          setSuccessAddStartupMessage={setSuccessAddStartupMessage}
          showAddStartupModal={showAddStartupModal}
          userDetails={user}
          setShowAddStartupModal={setShowAddStartupModal}
          buisnessTypeId={buisnessTypeId}
          countryId={countryId}
          cityId={cityId}
        />
      )}
      {showAddMarketingCodeModal && (
        <AddMarketingCodeOnSkip
          showAddMarketingCodeModal={showAddMarketingCodeModal}
          startupId={addStartUpIdOnPost?.payload}
          setShowAddMarketingCodeModal={() =>
            setShowAddMarketingCodeModal((prev) => !prev)
          }
          values={values}
          setValues={setValues}
          userDetails={user}
          setFormDetails={setFormDetails}
          showVerifyOtpModal={showVerifyOtpModal}
          setShowVerifyOtpModal={setShowVerifyOtpModal}
          handlerVerifyBusinessBeforePostStartup={
            handlerVerifyBusinessBeforePostStartup
          }
          setIsAuthorityDeclared={setIsAuthorityDeclared}
        />
      )}
      {!!showAddStartupModal && !isDraftApiHit ? (
        <AddStartupSuccessModal
          open={showAddStartupModal}
          setOpen={setShowAddStartupModal}
          successMessage={successAddStartupMessage}
        />
      ) : null}
    </React.Fragment>
  );
};

export default AddStartup;
