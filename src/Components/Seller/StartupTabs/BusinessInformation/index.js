import React, { useRef, useState, memo } from "react";
// import TextAreaWithCount from "./TextAreaWithCount";
// import SelectInput from "./SelectInput";
import { Icons } from "../../../../assets/icons";
import { FileAddComponent, SelectInput, UploadImage } from "../../../FormComponents";
import { useSelector } from "react-redux";
import TextAreaWithCount from "../../../FormComponents/TextAreaWithCount";
import StartupInput from "../../../FormComponents/StartupInput";
import { InputTypes } from "../../../../constants/constant";
import useLocalStorage from "react-use-localstorage";

const BusinessInformation = ({ formSteps }) => {
  const labels = useSelector((state) => state?.Language?.labels);
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar"
  );

  const { calender, info } = Icons;
  const dateFounded = useRef();
  const [showDropDown, setShowDropDown] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [values, setValues] = useState({
    businessName: "",
    dateFounded: "",
    teamSize: "",
    businessType: "",
    startupHeadline: "",
    description: "",
    askingPrice: "",
    askingPriceReason: "",
  });
  const [errors, setErrors] = useState({
    businessName: null,
    dateFounded: null,
    teamSize: null,
    businessType: null,
    startupHeadline: null,
    description: null,
    askingPrice: null,
    askingPriceReason: null,
  });
  const businessOptions = [
    { id: 1, title: "Basic" },
    { id: 2, title: "Silver" },
    { id: 3, title: "Gold" },
  ];
  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setShowDropDown(false);
    setValues((prevState) => ({
      ...prevState,
      businessType: option.title,
    }));
  };
  return (
    <React.Fragment>
      <div className="businessInfo_container grid grid-cols-12">
        <div className="col-span-12 md:mt-16 md:mb-8">
          <p className="col-span-12 flex md:px-0 px-4 justify-center text-fs_32 md:text-fs_28 font-general_semiBold text-black">
            {labels.businessInfo}
          </p>
          <p className="col-span-12 flex md:px-0 px-4 justify-center text-fs_16 font-general_light font-normal text-c_979797">
            {labels.completeBusinessInfo}
          </p>
          <div className="col-span-12 mx-auto flex flex-col items-center justify-center">
            {formSteps.map((item, index) => {
              return (
                <React.Fragment key={`form-steps-${index}`}>
                  {item?.dynamicForms?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).map((ele, i) => {
                    return (
                      <React.Fragment key={`steps-${i}`}>
                        {ele?.formFields.type === InputTypes.INPUT ? <div className="relative flex flex-col  gap-y-2 mb-4 mt-8">
                          <label className="w-full capitalize text-c_181818 text-fs_14 font-general_medium font-medium">
                            {labels.businessName}
                          </label>
                          <StartupInput
                            type="text"
                            placeholder={labels.businessName}
                            //   value={}
                            onChange={(e) => {
                              setValues((prevState) => ({
                                ...prevState,
                                businessName: e.target.value,
                              }));
                            }}
                            className="w-[350px] bg-transparent rounded-xl text-fs_14 capitalize font-general_medium outline-none focus:border-[0.8px] focus:border-c_0E73D0 border-[0.8px] border-c_535353 text-c_181818 placeholder:text-c_797979 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
                          />
                          <span className="flex items-center justify-start gap-x-2 font-general_light text-fs_14 text-c_A6A6A6">
                            <img src={info} alt="infoicon" />
                            {labels.buyerCannotSeeBusinessName}
                          </span>
                        </div> : ele?.formFields.type === InputTypes.CALENDAR ? <div className="relative flex flex-col gap-y-2">
                          <label className="capitalize text-c_181818 text-fs_14 font-general_medium font-medium">
                            {labels.dateFounded}
                          </label>
                          <StartupInput
                            type="date"
                            placeholder={labels.dateFounded}
                            ref={dateFounded}
                            onChange={(e) => {
                              setValues((prevState) => ({
                                ...prevState,
                                dateFounded: e.target.value,
                              }));
                            }}
                            // value={values?.dateOfBirth}
                            className=" w-[350px] bg-transparent rounded-xl fs-15 !pl-10 font-general_light outline-none focus:border-[0.8px] focus:border-c_0E73D0 border-[0.8px] border-c_535353 text-c_535353 placeholder:text-c_535353 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
                          />
                          <img
                            src={calender}
                            alt="calenderIcon"
                            className="absolute top-12 left-4 w-4 h-4 border-c_D9D9D9"
                          />
                        </div> : ele?.formFields.type === InputTypes.DROPDOWN ? <div className="relative flex flex-col mt-4">
                          <label className="capitalize  text-c_181818 text-fs_14 font-general_medium font-medium">
                            {labels.businessType}
                          </label>
                          <div className="mt-2">
                            <SelectInput className="w-[350px] bg-transparent" />
                          </div>
                        </div> : ele?.formFields.type === InputTypes.TEXTAREA ? <div className="relative flex flex-col gap-y-2 mt-4">
                          <label className="capitalize  text-c_181818 text-fs_14 font-general_medium font-medium">
                            {labels.startupHeadline}
                          </label>
                          <TextAreaWithCount
                            //   disabled={}
                            type="text"
                            rows={1}
                            maxChar={100}
                            placeholder={labels.startupHeadline}
                            //   value={}
                            onChange={(e) => {
                              setValues((prevState) => ({
                                ...prevState,
                                startupHeadline: e.target.value,
                              }));
                            }}
                            className="w-[350px] resize-none bg-transparent rounded-xl fs-15 capitalize font-general_light outline-none focus:border-[0.8px] focus:border-c_0E73D0 border-[0.8px] border-c_535353 text-c_535353 placeholder:text-c_535353 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
                          />
                        </div> : ele?.formFields.type === InputTypes.FILE ? <div className="relative flex flex-col gap-y-2 mt-4">
                          <label className="capitalize  text-c_181818 text-fs_14 font-general_medium font-medium">
                            {labels.startupHeadline}
                          </label>
                          <TextAreaWithCount
                            //   disabled={}
                            type="text"
                            rows={1}
                            maxChar={100}
                            placeholder={labels.startupHeadline}
                            //   value={}
                            onChange={(e) => {
                              setValues((prevState) => ({
                                ...prevState,
                                startupHeadline: e.target.value,
                              }));
                            }}
                            className="w-[350px] resize-none bg-transparent rounded-xl fs-15 capitalize font-general_light outline-none focus:border-[0.8px] focus:border-c_0E73D0 border-[0.8px] border-c_535353 text-c_535353 placeholder:text-c_535353 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
                          /></div> : <></>}
                      </React.Fragment>
                    )
                  })}
                </React.Fragment>
              );
            })}

            {/* <div className="relative flex flex-col gap-y-2">
              <label className="capitalize text-c_181818 text-fs_14 font-general_medium font-medium">
                {labels.dateFounded}
              </label>
              <StartupInput
                type="date"
                placeholder={labels.dateFounded}
                ref={dateFounded}
                onChange={(e) => {
                  setValues((prevState) => ({
                    ...prevState,
                    dateFounded: e.target.value,
                  }));
                }}
                // value={values?.dateOfBirth}
                className=" w-[350px] bg-transparent rounded-xl fs-15 !pl-10 font-general_light outline-none focus:border-[0.8px] focus:border-c_0E73D0 border-[0.8px] border-c_535353 text-c_535353 placeholder:text-c_535353 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
              <img
                src={calender}
                alt="calenderIcon"
                className="absolute top-12 left-4 w-4 h-4 border-c_D9D9D9"
              />
            </div> */}
            {/* <div className="relative flex flex-col gap-y-2 mt-4">
              <label className="capitalize text-c_181818 text-fs_14 font-general_medium font-medium">
                {labels.startUpTeamSize}
              </label>
              <StartupInput
                type="number"
                placeholder={labels.startUpTeamSize}
                onChange={(e) => {
                  setValues((prevState) => ({
                    ...prevState,
                    teamSize: e.target.value,
                  }));
                }}
                // value={values?.dateOfBirth}
                className="w-[350px] bg-transparent rounded-xl fs-15 font-general_light outline-none focus:border-[0.8px] focus:border-c_0E73D0 border-[0.8px] border-c_535353 text-c_535353 placeholder:text-c_535353 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div> */}
            {/* <div className="relative flex flex-col mt-4">
              <label className="capitalize  text-c_181818 text-fs_14 font-general_medium font-medium">
                {labels.businessType}
              </label>
              <div className="mt-2">
                <SelectInput className="w-[350px] bg-transparent" />
              </div>
            </div> */}
            {/* <div className="relative flex flex-col gap-y-2 mt-4">
              <label className="capitalize  text-c_181818 text-fs_14 font-general_medium font-medium">
                {labels.startupHeadline}
              </label>
              <TextAreaWithCount
                //   disabled={}
                type="text"
                rows={1}
                maxChar={100}
                placeholder={labels.startupHeadline}
                //   value={}
                onChange={(e) => {
                  setValues((prevState) => ({
                    ...prevState,
                    startupHeadline: e.target.value,
                  }));
                }}
                className="w-[350px] resize-none bg-transparent rounded-xl fs-15 capitalize font-general_light outline-none focus:border-[0.8px] focus:border-c_0E73D0 border-[0.8px] border-c_535353 text-c_535353 placeholder:text-c_535353 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div> */}
            {/* <div className="relative flex flex-col gap-y-2 mt-0">
              <label className="capitalize text-c_181818 text-fs_14 font-general_medium font-medium">
                {labels.description}
              </label>
              <TextAreaWithCount
                //   disabled={}
                type="text"
                rows={2}
                maxChar={1000}
                placeholder={labels.typeHere}
                //   value={}
                onChange={(e) => {
                  setValues((prevState) => ({
                    ...prevState,
                    description: e.target.value,
                  }));
                }}
                className="w-[350px] bg-transparent rounded-xl fs-15 capitalize font-general_light outline-none focus:border-[0.8px] focus:border-c_0E73D0 border-[0.8px] border-c_535353 text-c_535353 placeholder:text-c_535353 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div> */}
            {/* <div className="relative flex flex-col gap-y-2 mt-0">
              <label className="capitalize text-c_181818 text-fs_14 font-general_medium font-medium">
                {labels.askingPrice}
              </label>
              <StartupInput
                //   disabled={}
                type="text"
                placeholder={labels.askingPrice}
                //   value={}
                onChange={(e) => {
                  setValues((prevState) => ({
                    ...prevState,
                    askingPrice: e.target.value,
                  }));
                }}
                className="w-[350px] bg-transparent rounded-xl fs-15 capitalize font-general_light outline-none focus:border-[0.8px] focus:border-c_0E73D0 border-[0.8px] border-c_535353 text-c_535353 placeholder:text-c_535353 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div> */}
            {/* <div className="relative flex flex-col gap-y-2 mt-6">
              <label className="capitalize text-c_181818 text-fs_14 font-general_medium font-medium">
                {labels.askingPriceReason}
              </label>
              <TextAreaWithCount
                //   disabled={}
                type="text"
                rows={2}
                maxChar={1000}
                placeholder={labels.typeHere}
                //   value={}
                onChange={(e) => {
                  setValues((prevState) => ({
                    ...prevState,
                    askingPriceReason: e.target.value,
                  }));
                }}
                className="w-[350px] bg-transparent rounded-xl fs-15 capitalize font-general_light outline-none focus:border-[0.8px] focus:border-c_0E73D0 border-[0.8px] border-c_535353 text-c_535353 placeholder:text-c_535353 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div> */}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default memo(BusinessInformation);
