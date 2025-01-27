/**
 * eslint-disable react/prop-types
 *
 * @format
 */

import React, { useRef, useState, memo, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../Components/FormComponents";
import { Icons } from "../../assets/icons";
import { Images } from "../../assets/images";
import CustomToast from "../CustomToast";
import { SCREENS } from "../../Router/routes.constants";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { addUserRole } from "../../Store/actions/users";

const SwitchRoleModal = ({
  showSwitchRoleModal,
  setShowSwitchRoleModal,
  title,
  tagLine,
  pageSellerLogs,
  setPageSellerLogs,
  pageBuyerLogs,
  setPageBuyerLogs,
  tab,
  setTab,
  status,
  setStatus,
}) => {
  const Labels = useSelector((state) => state?.Language?.labels);
  const role = localStorage.getItem("role");
  const startupUrl = localStorage.getItem("startupUrl");
  const { crossIcon } = Icons;
  const { tasklist } = Images;
  const cancelButtonRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);

  return (
    <React.Fragment>
      <Transition.Root show={showSwitchRoleModal} as={Fragment}>
        <Dialog
          as={"div"}
          className={"relative z-10"}
          initialFocus={cancelButtonRef}
          onClose={() => {}}
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
                  className={`relative transform overflow-hidden rounded-[22px] bg-c_FFFFFF text-left shadow-xl transition-all sm:my-8`}
                >
                  <div className={`bg-c_FFFFFF px-4 pb-4 pt-5 sm:p-6 sm:pb-4`}>
                    <div className='relative'>
                      <img
                        src={crossIcon}
                        className={
                          "absolute h-3.5 w-3.5 -top-2 -right-1.5 cursor-pointer"
                        }
                        onClick={() => setShowSwitchRoleModal(false)}
                      />
                    </div>
                    <div
                      className={
                        "xl:px-4 xl:py-4 px-2 flex flex-col items-center justify-center gap-y-2"
                      }
                    >
                      <img
                        src={tasklist}
                        className={"h-28 w-36"}
                        alt={"buyersellerimage"}
                      />
                      <div
                        className={
                          "flex flex-col items-center justify-center gap-y-2 mx-auto"
                        }
                      >
                        <span
                          className={
                            "w-full md:w-[26ch] text-center text-c_000000 font-general_semiBold text-fs_30"
                          }
                        >
                          {title}
                        </span>
                      </div>

                      <div className='flex flex-col items-center justify-center gap-y-3'>
                        <>
                          {role === "seller" ? (
                            <Button
                              isLoading={loader}
                              onClick={() => {
                                const params = {
                                  type: "buyer",
                                };
                                dispatch(
                                  addUserRole(
                                    params,
                                    (res) => {
                                      if (res?.data) {
                                        setPageSellerLogs(1);
                                        setPageBuyerLogs(1);
                                        setTab("All");
                                        setStatus("all");
                                        localStorage.setItem("role", "buyer");
                                        if (!!startupUrl) {
                                          window.location.assign(startupUrl);
                                          setShowSwitchRoleModal(false);
                                          toast.custom((t) => (
                                            <CustomToast
                                              t={t}
                                              type={"success"}
                                            />
                                          ));
                                        } else {
                                          navigate(SCREENS.buyerMarketplace, {
                                            replace: true,
                                          });
                                          setShowSwitchRoleModal(false);
                                          toast.custom((t) => (
                                            <CustomToast
                                              t={t}
                                              type={"success"}
                                            />
                                          ));
                                        }
                                      }
                                    },
                                    setLoader,
                                  ),
                                );
                              }}
                              className={
                                "max-w-[250px] min-w-[250px] outline-none mt-3"
                              }
                            >
                              {Labels.switchToBuyer}
                            </Button>
                          ) : (
                            <Button
                              isLoading={loader}
                              onClick={() => {
                                const params = {
                                  type: "seller",
                                };
                                dispatch(
                                  addUserRole(
                                    params,
                                    (res) => {
                                      if (res?.data) {
                                        setPageSellerLogs(1);
                                        setPageBuyerLogs(1);
                                        setTab("All");
                                        setStatus("all");
                                        localStorage.setItem("role", "seller");
                                        navigate(SCREENS.sellerListing, {
                                          replace: true,
                                        });
                                        setShowSwitchRoleModal(false);
                                        toast.custom((t) => (
                                          <CustomToast t={t} type={"success"} />
                                        ));
                                      }
                                    },
                                    setLoader,
                                  ),
                                );
                              }}
                              className={
                                "max-w-[250px] min-w-[250px] outline-none mt-3"
                              }
                            >
                              {Labels.switchToSeller}
                            </Button>
                          )}
                        </>
                        {/* <span
                          className="font-general_semiBold text-fs_14 cursor-pointer"
                          onClick={() => setShowSwitchRoleModal(false)}
                        >
                          {role === "seller"
                            ? Labels.goBackToSellerMode
                            : Labels.goBackToBuyerMode}
                        </span> */}
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

export default memo(SwitchRoleModal);
