import { memo } from "react";
import { Icons } from "../assets/icons";
import TextInput from "./FormComponents/TextInput/index";
import { useSelector } from "react-redux";
import useLocalStorage from "react-use-localstorage";

const SearchInput = ({ value, onChange, className }) => {
  const Labels = useSelector((state) => state?.Language?.labels);

  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar"
  );
  const { searchIcon } = Icons;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="relative">
        <div
          className={`absolute inset-y-0 ${
            localStorageLanguage === "eng" ? "left-0" : "right-4"
          } flex items-center pl-3 pointer-events-none`}
        >
          <img
            src={searchIcon}
            alt="searchicon"
            className={`h-5 w-5`}
            draggable={"false"}
          />
        </div>
        <TextInput
          type="search"
          id="default-search"
          className={className}
          placeholder={Labels.search}
          value={value}
          onChange={onChange}
          lang={`${localStorageLanguage === "ar" ? "ar" : "eng"}`}
        />
      </div>
    </form>
  );
};

export default memo(SearchInput);
