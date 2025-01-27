/** @format */

import { Images } from "../../../../assets/images";
import { Icons } from "../../../../assets/icons";
import useLocalStorage from "react-use-localstorage";
import { useSelector } from "react-redux";
import { Roles } from "../../../../constants/constant";
import { getPrimaryColor } from "../../../../utils/utility";

const MainSearch = ({ title, onChange }) => {
  const { marketPlaceCircles, marketPlaceCirclesGold } = Images;
  const role = localStorage.getItem("role");
  const { searchIcon } = Icons;
  const Labels = useSelector((state) => state?.Language?.labels);
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );
  return (
    <div
      className={`mt-8 relative ${
        role === Roles.BUYER
          ? "marketplace_gold_container"
          : "marketplace_blue_container"
      }`}
    >
      <div className='absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[10] flex justify-center flex-col items-center w-full h-full'>
        <span
          className={`${
            localStorageLanguage === "eng" ? "text-fs_40" : "text-fs_36"
          } text-c_FDFDFD font-general_semiBold`}
        >
          {title}
        </span>

        <div
          className={`md:w-2/4 w-[80%] mt-6 rounded-[6px] ${
            role === Roles.BUYER
              ? "border-c_FFFFFF border-[1px]"
              : "border-c_FFFFFF/40 border-[1px]"
          } text-c_FDFDFD ${getPrimaryColor(
            role,
            "!bg-c_BDA585",
            "!bg-c_2B4359",
          )}`}
        >
          <div className='relative flex justify-center items-center'>
            <input
              id={"default-search"}
              className={`block w-full h-[44px] p-4 text-fs_16 text-white border placeholder:text-c_FDFDFD placeholder:font-general_semiBold placeholder:uppercase placeholder:text-fs_12 ${
                role === Roles.BUYER
                  ? "bg-c_BDA585 border-c_BDA585"
                  : "bg-c_2B4359 border-c_2B4359"
              } rounded-lg  focus:outline-none`}
              onChange={onChange}
              placeholder={Labels.search}
              autoComplete={"off"}
            />
            <button
              className={`text-white absolute bottom-1 p-2 rounded bg-c_F6F8F9 outline-none focus:outline-none ${
                localStorageLanguage === "ar" ? "left-0.5" : "right-0.5 mr-0"
              }`}
            >
              <img
                draggable={"false"}
                src={searchIcon}
                alt={"searchicon"}
                className={"h-5 w-5"}
              />
            </button>
          </div>
        </div>
      </div>
      <img
        draggable={"false"}
        src={role === Roles.BUYER ? marketPlaceCirclesGold : marketPlaceCircles}
        alt={"designcircles"}
        className='h-[565px] w-[565px] md:absolute md:-top-4 md:-left-64 z-[1]'
      />
    </div>
  );
};
export default MainSearch;
