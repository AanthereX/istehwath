/** @format */

import { memo } from "react";
import { Button } from "../Components/FormComponents";
import { StartupStatus } from "../constants/constant";
import { useSelector } from "react-redux";
import { checkDealsStatus, checkStartupStatus } from "../utils/utility";
import { SCREENS } from "../Router/routes.constants";
import useLocalStorage from "react-use-localstorage";

const NoDataAvailable = ({
  text = "",
  btnLabel = "",
  img,
  secondaryText = "",
  onClick = () => {},
  status = "",
  loading = false,
  imgAltText = "",
}) => {
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );
  return (
    <div className={"min-h-screen flex flex-col gap-y-2 items-center pt-32"}>
      {img && <img src={img} alt={imgAltText} className='h-16 w-16' />}
      <div
        className={`flex flex-col gap-y-4 ${
          localStorageLanguage === "eng"
            ? "2xl:pl-16 2xl:pr-0 xl:pl-16 xl:pr-0 lg:pl-16 lg:pr-0 md:pl-0 md:pr-4 pl-0"
            : "2xl:pr-16 2xl:pl-0 xl:pr-9 xl:pl-0 lg:pr-16 lg:pl-0 md:pr-0 md:pl-4 pl-0"
        }`}
      >
        <span
          className={`text-fs_32 w-full md:!w-[26ch] text-c_000000 font-general_semiBold font-semibold text-center`}
        >
          {`${text} `}
          {/* {window.location.pathname === SCREENS.sellerListing && (
            <span className="lowercase">{`${checkStartupStatus(
              status,
              StartupStatus,
              Labels
            )}`}</span>
          )} */}
          {/* {window.location.pathname === SCREENS.buyerDeals && (
            <span className='lowercase'>{`${checkDealsStatus(
              status,
              StartupStatus,
              Labels,
            )}`}</span>
          )} */}
        </span>
        {status === StartupStatus.ALL && (
          <>
            <Button
              onClick={onClick}
              variant={"none"}
              size={"md"}
              className={
                "!w-fit mx-auto bg-gradient-to-r from-g_1C2F40 to-g_20415E text-c_FFFFFF"
              }
            >
              {`${btnLabel}`}
            </Button>
            {!!secondaryText && (
              <span className='text-fs_14 text-c_999999 font-general_light font-light text-center'>
                {secondaryText}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default memo(NoDataAvailable);
