/** @format */

import React from "react";
import { Icons } from "../../../assets/icons";
import { useSelector } from "react-redux";

const BackButton = ({ onClick = () => {} }) => {
  const Labels = useSelector((state) => state?.Language?.labels);
  const { backIcon } = Icons;
  return (
    <div
      className='flex gap-x-2 mt-6 items-center justify-center cursor-pointer'
      onClick={onClick}
    >
      <div className='bg-c_1C2F40 rounded-full px-2 py-1.5 flex justify-center items-center'>
        <img src={backIcon} alt={"backicon"} draggable={false} />
      </div>
      <span className='text-c_1E3A52 text-fs_12 font-general_semiBold tracking-widest'>
        {Labels.back}
      </span>
    </div>
  );
};
export default BackButton;
