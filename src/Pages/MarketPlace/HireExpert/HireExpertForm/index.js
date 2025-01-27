/** @format */

import { Fragment, useCallback, useEffect, useState } from "react";
import CommonLayout from "../../CommonLayout/CommonLayout";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../../../Components/FormComponents";
import TextAreaWithCount from "../../../../Components/FormComponents/TextAreaWithCount";
import { useNavigate, useParams } from "react-router-dom";
import {
  addHireExpertHelpAction,
  getSingleHireExpertAction,
} from "../../../../Store/actions/HireExpert";
import Skeleton from "react-loading-skeleton";
import {
  checkInternetConnection,
  validateLength,
  validateOnlySpace,
  validateText,
} from "../../../../constants/validate";
import useLocalStorage from "react-use-localstorage";
import DraftModal from "../../../../Components/Modals/DraftModal";
import AddMarketingCodeOnSkip from "../../../../Components/Modals/AddMarketingCodeOnSkip";
import HireExpertModalSuccess from "../../../../Components/Modals/HireExpertModalSuccess";

const HireForm = () => {
  const Labels = useSelector((state) => state?.Language?.labels);
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    helpDeskDescription: "",
  });
  const [errors, setErrors] = useState({
    helpDeskDescription: null,
  });
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [showHireExpertSuccessModal, setShowHireExpertSuccessModal] =
    useState(false);
  const [addHelpDeskLoading, setAddHelpDeskLoading] = useState(false);
  const [singleExpert, setSingleExpert] = useState([]);
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  useEffect(() => {
    handleGetSingleHireExpert();
  }, []);

  const handleGetSingleHireExpert = () => {
    setLoading(true);
    getSingleHireExpertAction(params?.id, (res) => {
      setLoading(false);
      setSingleExpert(res?.data);
      setSelectedId(res?.data?.id);
    });
  };

  const handleAddHireExpertHelpDesk = useCallback(async () => {
    if (!values.helpDeskDescription) {
      const textError = validateText(
        values?.helpDeskDescription,
        Labels,
        localStorageLanguage,
      );
      setErrors((prevState) => ({
        ...prevState,
        helpDeskDescription: textError,
      }));
    }
    if (values.helpDeskDescription) {
      const textError = validateLength(values?.helpDeskDescription, Labels);
      setErrors((prevState) => ({
        ...prevState,
        helpDeskDescription: textError,
      }));
      if (textError) return;
    }
    if (values.helpDeskDescription) {
      const textError = validateOnlySpace(values?.helpDeskDescription, Labels);
      setErrors((prevState) => ({
        ...prevState,
        helpDeskDescription: textError,
      }));
      if (textError) return;
    }
    if (values.helpDeskDescription) {
      // eslint-disable-next-line no-extra-boolean-cast
      if (Boolean(checkInternetConnection(Labels))) {
        const params = {
          hireExpertId: selectedId,
          explain: values?.helpDeskDescription,
        };
        dispatch(
          addHireExpertHelpAction(
            params,
            setAddHelpDeskLoading,
            setValues,
            navigate,
            localStorageLanguage,
            setShowHireExpertSuccessModal,
          ),
        );
      }
    }
  }, [values, setErrors, dispatch, setValues]);

  return (
    <Fragment>
      <CommonLayout>
        <div className='mx-auto md:w-9/12 pt-2 p-6 sm:px-8'>
          <div className='flex justify-center items-center'>
            <span className='text-fs_40 font-general_semiBold'>
              {Labels.hireExperts}
            </span>
          </div>
          <div className='flex flex-col justify-center items-center mt-20'>
            <span className='text-fs_32 font-general_semiBold'>
              {Labels.whatHelpYouNeed}
            </span>
            {/* <span className='text-fs_16 font-general_light text-c_181818 mt-3'>
            {Labels.ourExportWillTouch}
          </span> */}
          </div>

          <div className='mx-auto w-full lg:px-48 px-0'>
            <div className='rounded-xl bg-c_F1F1F1 p-6 mt-5'>
              {loading ? (
                <Skeleton
                  width={200}
                  height={20}
                  duration={2}
                  enableAnimation={true}
                  borderRadius={"0.75rem"}
                />
              ) : (
                <p className='text-2xl font-general_medium mb-2'>
                  {localStorageLanguage === "eng"
                    ? singleExpert?.title?.length > 180
                      ? `${singleExpert?.title?.slice(0, 180)}..`
                      : singleExpert?.title
                    : singleExpert?.title_ar?.length > 180
                    ? `${singleExpert?.title_ar?.slice(0, 180)}..`
                    : singleExpert?.title_ar || Labels.notAvailable}
                </p>
              )}
              {loading ? (
                <Skeleton
                  height={40}
                  duration={2}
                  enableAnimation={true}
                  borderRadius={"0.75rem"}
                />
              ) : (
                <p className='text-fs_16 font-general_regular'>
                  {localStorageLanguage === "eng"
                    ? singleExpert?.description
                    : singleExpert?.description_ar || Labels.notAvailable}
                </p>
              )}
            </div>

            <div className='mt-4'>
              <TextAreaWithCount
                className={`w-full bg-transparent py-4 pr-4 pl-4 font-general_medium font-normal text-fs_16 placeholder:text-c_535353 placeholder:font-general_light placeholder:font-light text-c_181818 border-[0.8px] rounded-xl border-c_535353 focus:border-c_0E73D0 outline-none`}
                placeholder={Labels.explainHere}
                maxChar={1000}
                cols={35}
                length={values.helpDeskDescription.length || 0}
                rows={6}
                onChange={(e) => {
                  setValues((prevState) => ({
                    ...prevState,
                    helpDeskDescription: e.target.value,
                  }));
                  setErrors((prevState) => ({
                    ...prevState,
                    helpDeskDescription: null,
                  }));
                }}
                error={errors.helpDeskDescription}
                errorText={errors.helpDeskDescription}
              />
            </div>
            <div className='w-fit mx-auto mt-6'>
              <Button
                onClick={handleAddHireExpertHelpDesk}
                size={"xl"}
                isLoading={addHelpDeskLoading}
                varaint={"primary"}
              >
                {Labels.send}
              </Button>
            </div>
          </div>
        </div>
      </CommonLayout>
      {showHireExpertSuccessModal && (
        <HireExpertModalSuccess
          showHireExpertSuccessModal={showHireExpertSuccessModal}
          setShowHireExpertSuccessModal={() =>
            setShowHireExpertSuccessModal((prev) => !prev)
          }
        />
      )}
    </Fragment>
  );
};

export default HireForm;
