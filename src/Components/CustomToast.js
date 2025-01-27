/* eslint-disable react/prop-types */
import toast from "react-hot-toast";
import { Icons } from "../assets/icons";
import { useSelector } from "react-redux";
import useLocalStorage from "react-use-localstorage";

const CustomToast = ({ t, type }) => {
  const Labels = useSelector((state) => state?.Language?.labels);
  const role = localStorage.getItem("role");
  const { crossIcon, successToastIcon } = Icons;
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar"
  );
  return (
    <div
      className={`max-w-[360px] ${
        type === "success"
          ? "border-l-[12px] rounded-l-[4px] border-c_45D863"
          : type === "error"
          ? "border-l-[12px] rounded-l-[4px] border-c_FF3333"
          : "border-l-[12px] rounded-l-[4px] border-c_FFFFFF"
      } w-full bg-c_FFFFFF shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className={`flex-1 w-0 p-4`}>
        <div className="flex items-center justify-start">
          <img
            className={`${localStorageLanguage === "ar" && "p-4"}`}
            src={successToastIcon}
            alt={"successicon"}
          />
          <div className="ml-3 flex-1">
            <p className="text-fs_14 font-semibold font-general_semiBold text-c_000000">
              {role === "buyer"
                ? Labels.switchToBuyer
                : role === "seller"
                ? Labels.switchToSeller
                : null}
            </p>
            <p className="text-fs_14 font-normal font-general_normal text-c_888888">
              {Labels.yourAccountHasBeenSwitched}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-end justify-start items-start">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full p-4 flex items-center justify-center outline-none focus:outline-none"
        >
          <img src={crossIcon} />
        </button>
      </div>
    </div>
  );
};
export default CustomToast;
