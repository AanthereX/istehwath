/**
 * eslint-disable react/prop-types
 *
 * @format
 */

import React, { useRef, memo, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useSelector } from "react-redux";
import { Button } from "../../Components/FormComponents";
import { Icons } from "../../assets/icons";
import { Images } from "../../assets/images";
import { useNavigate } from "react-router-dom";
import TextAreaWithCount from "../FormComponents/TextAreaWithCount";

const ReportStartupModal = ({
  showReportStartupModal,
  setShowReportStartupModal,
  values,
  setValues,
  handleReportStartup = () => {},
  reportLoading,
}) => {
  const Labels = useSelector((state) => state?.Language?.labels);
  const role = localStorage.getItem("role");
  const { crossIcon } = Icons;
  const { todo } = Images;
  const cancelButtonRef = useRef(null);
  const navigate = useNavigate();

  return (
    <React.Fragment>
      <Transition.Root show={showReportStartupModal} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-10'
          initialFocus={cancelButtonRef}
          onClose={setShowReportStartupModal}
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
                <Dialog.Panel className='relative transform overflow-hidden rounded-[22px] bg-c_FFFFFF text-left shadow-xl transition-all sm:my-8'>
                  <div className='bg-c_FFFFFF px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
                    <div className='relative'>
                      <img
                        src={crossIcon}
                        className='absolute h-3.5 w-3.5 -top-2 -right-1 cursor-pointer'
                        onClick={() => setShowReportStartupModal(false)}
                      />
                    </div>
                    <div className='xl:p-10 py-10 px-2 flex flex-col items-center justify-center gap-y-2'>
                      {/* <img src={todo} className="h-28 w-36" alt="todoimage" /> */}
                      <div className='flex flex-col items-center justify-center gap-y-4 mx-auto'>
                        <span className='font-general_semiBold text-fs_36 w-full md:w-[26ch] text-center text-c_000000'>
                          {Labels.reportStartupReason}
                        </span>
                      </div>
                      <div className='w-full flex items-center justify-center'>
                        <TextAreaWithCount
                          type={"text"}
                          rows={3}
                          maxChar={1000}
                          value={values?.reportReason}
                          placeholder={Labels.reportReason}
                          length={values?.reportReason?.length}
                          onChange={(e) => {
                            setValues((prevState) => ({
                              ...prevState,
                              reportReason: e.target.value,
                            }));
                          }}
                          className='md:w-[350px] w-full mx-auto resize-none bg-transparent rounded-xl fs-15 font-general_regular outline-none focus:border-[0.8px] focus:border-c_0E73D0 border-[0.8px] border-c_535353 text-c_535353 placeholder:text-c_535353 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out'
                        />
                      </div>

                      <div className='flex flex-col items-center justify-center gap-y-3'>
                        <div className='px-2 pt-4'>
                          <div className='flex justify-center gap-3 md:flex-row flex-col'>
                            <div>
                              <Button
                                variant={"secondary"}
                                className={"min-w-[169px]"}
                                onClick={() => setShowReportStartupModal(false)}
                              >
                                {Labels.cancel}
                              </Button>
                            </div>
                            <div>
                              <Button
                                onClick={handleReportStartup}
                                className={"min-w-[169px]"}
                                isLoading={reportLoading}
                              >
                                {Labels.report}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </React.Fragment>
  );
};

export default memo(ReportStartupModal);
