/**
 * eslint-disable react/prop-types
 *
 * @format
 */

/**
 * eslint-disable react/prop-types
 *
 * @format
 */

import { useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Divider } from "./FormComponents";
import { DynamicRoutes } from "../constants/constant";
import { useDispatch, useSelector } from "react-redux";
import {
  addFavoriteAction,
  updateStatusToSoldAction,
} from "../Store/actions/Startup";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { TiTickOutline } from "react-icons/ti";
import useLocalStorage from "react-use-localstorage";
import SoldConfirmationModal from "./Modals/SoldConfirmationModal";

export default function MenuDropDown({
  options = [],
  children,
  onClick = () => {},
  navigate,
  params,
  handleCopyUrl = () => {},
  handleGetSingleStartup = () => {},
  showReportStartupModal,
  setShowReportStartupModal,
  handleShareUrl = () => {},
}) {
  const Labels = useSelector((state) => state?.Language?.labels);
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const [showSoldConfirmationModal, setShowSoldConfirmationModal] =
    useState(false);
  const dispatch = useDispatch();
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  const handleAddFavorite = () => {
    const obj = {
      startUp: params?.id,
    };
    dispatch(
      addFavoriteAction(
        obj,
        () => {
          handleGetSingleStartup();
        },
        IoIosRemoveCircleOutline,
        TiTickOutline,
        localStorageLanguage,
      ),
    );
  };

  const handleUpdateStatusToSold = () => {
    dispatch(
      updateStatusToSoldAction(
        params?.id,
        () => {
          handleGetSingleStartup();
        },
        localStorageLanguage,
        setLoader,
        setOpen,
      ),
    );
  };

  return (
    <>
      <div className={`w-full mt-1 z-[9]`}>
        <Menu as='div' className='flex justify-end text-left outline-none'>
          <div>
            <Menu.Button className='inline-flex w-full justify-end '>
              <div>{children}</div>
            </Menu.Button>
          </div>
          <Transition
            as={"div"}
            enter='transition ease-out duration-100'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'
          >
            <Menu.Items
              className={`absolute ${
                localStorageLanguage === "eng"
                  ? "md:right-0 -right-3 top-7"
                  : "md:left-0 -left-2 top-7"
              } !z-[999] min-w-max rounded-[13px] bg-c_FFFFFF shadow-[2px_10px_27px_0px_rgba(0,0,0,0.07)]`}
            >
              <div className='px-4 py-3'>
                {options?.map((item, index) => {
                  return (
                    <Menu.Item key={index}>
                      {({ active }) => (
                        <div>
                          <div
                            className={`pl-1 w-full flex items-center cursor-pointer rounded-[4px] ${
                              active ? "" : ""
                            }`}
                            onClick={() =>
                              ["Edit listing", "تحرير الادراج"].includes(
                                item?.label,
                              )
                                ? navigate(
                                    `${DynamicRoutes.sellerEditStartup}/${params?.id}`,
                                  )
                                : () => {}
                            }
                          >
                            {/* {item.icon && (
                        <div>
                          <img
                            src={item?.icon}
                            className="h-4 w-4"
                            alt="deleteicon"
                          />
                        </div>
                      )} */}
                            <div
                              onClick={onClick}
                              className='flex items-center gap-x-2'
                            >
                              {item?.icon ? (
                                <item.icon className='text-c_181818' />
                              ) : (
                                <></>
                              )}
                              <div
                                className={`text-fs_16 text-c_181818 py-3 ${
                                  localStorageLanguage === "eng"
                                    ? "pr-16"
                                    : "pl-16"
                                } font-general_regular font-normal ${
                                  active ? "opacity-75" : "opacity-100"
                                }`}
                                onClick={
                                  item?.label === "Copy listing URL" ||
                                  item?.label === "نسخ رابط المشروع URL"
                                    ? handleCopyUrl
                                    : [
                                        "Favorite",
                                        "إضافة الى المفضلة",
                                        "UnFavorite",
                                        "إزالة من المفضلة",
                                      ].includes(item?.label)
                                    ? handleAddFavorite
                                    : item?.label === "Report" ||
                                      item?.label === "رفع بلاغ"
                                    ? () => setShowReportStartupModal(true)
                                    : item?.label === "Mark as Sold" ||
                                      item?.label === "وضع علامة على أنه مباع"
                                    ? () => {
                                        setShowSoldConfirmationModal(true);
                                      }
                                    : item?.label === "Share" ||
                                      item?.label === "مشاركة"
                                    ? handleShareUrl
                                    : () => {}
                                }
                              >
                                {item?.label}
                              </div>
                            </div>
                          </div>
                          {options?.length - 1 !== index && <Divider />}
                        </div>
                      )}
                    </Menu.Item>
                  );
                })}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
      {!!showSoldConfirmationModal && (
        <SoldConfirmationModal
          open={showSoldConfirmationModal}
          setOpen={() => setShowSoldConfirmationModal((prev) => !prev)}
          onClick={handleUpdateStatusToSold}
          loading={loader}
        />
      )}
    </>
  );
}
