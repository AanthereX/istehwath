/** @format */

import { Fragment, useEffect, useState } from "react";
import { Icons } from "../../../assets/icons";
import "./customTagSelect.css";
import { useSelector } from "react-redux";

const CustomTagSelect = ({ onChange, options, prevTags, error, errorText }) => {
  const { deleteTag, addIcon } = Icons;
  const Labels = useSelector((state) => state?.Language?.labels);
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (prevTags?.length) {
      setTags(prevTags);
    } else {
      setTags([]);
    }
  }, [prevTags]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value.replace(/[٠-٩۰-۹]/g, ""));
  };

  const handleInputKeyDown = (e) => {
    if (
      (e.key === "Enter" || e.type === "click") &&
      inputValue?.trim() !== ""
    ) {
      const newTag = inputValue?.trim();
      if (!tags.includes(newTag)) {
        if (tags.length === 0) {
          onChange([newTag]);
          setTags([newTag]);
        } else {
          onChange([...tags, `${newTag}`]);
          setTags([...tags, `${newTag}`]);
        }
        setInputValue("");
      }
    }
  };
  const handleTagRemove = (tag) => {
    const newTags = tags.filter((t) => t !== tag);
    setTags(newTags);
  };
  return (
    <Fragment>
      <div className='tag-input'>
        <div
          className={`flex items-center justify-between min-w-[350px] max-w-[350px] bg-transparent ${
            Boolean(error)
              ? "border-[0.8px] border-c_FF3333"
              : "border-[0.8px] border-c_535353"
          } rounded-xl p-[3px]`}
        >
          <input
            type={"text"}
            value={inputValue}
            className={`bg-transparent w-full text-fs_16 pl-2`}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            placeholder={Labels.typeHere}
          />
          <button
            className={
              "flex items-center justify-center px-5 py-4 rounded-xl bg-gradient-to-r from-c_1C2F40 to-c_20415E"
            }
            onClick={handleInputKeyDown}
          >
            <img src={addIcon} alt={"addIcon"} className='h-4 w-4' />
          </button>
        </div>
        {error && (
          <p className='text-c_FF3333 text-fs_12 block font-general_regular font-normal mt-2'>
            {errorText}
          </p>
        )}
        <div className='flex flex-col gap-y-2 mt-4 mb-5'>
          {tags.map((tag) => (
            <div
              key={tag}
              className={
                "w-[350px] max-w-[350px] grid grid-cols-12 gap-x-2 bg-c_F3F3F3 rounded-xl py-3.5 px-4 flex items-center justify-between"
              }
            >
              <p
                className={
                  "col-span-11 flex-grow font-general_regular break-words whitespace-normal font-regular text-fs_16 text-c_181818"
                }
              >
                {/* {tag.length > 18 ? tag.slice(0, 18) + "..." : tag.slice(0, 18)} */}
                {tag}
              </p>
              <button
                className={"col-span-1"}
                onClick={() => handleTagRemove(tag)}
              >
                <img
                  src={deleteTag}
                  alt={"deleteicon"}
                  className={"!h-5 !w-4 cursor-pointer"}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
};

export default CustomTagSelect;
