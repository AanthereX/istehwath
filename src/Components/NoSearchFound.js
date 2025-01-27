/** @format */

import { useSelector } from "react-redux";
import { Images } from "../assets/images";
import { Roles } from "../constants/constant";

const NoSearchFound = ({ entity }) => {
  const Labels = useSelector((state) => state?.Language?.labels);
  const role = localStorage.getItem("role");
  const { noSearchFoundImg, noSearchFoundGold } = Images;
  return (
    <div
      className={`flex flex-col gap-y-2 items-center justify-center ${
        role === Roles.SELLER && "mt-16"
      }`}
    >
      <img
        src={role === Roles.BUYER ? noSearchFoundGold : noSearchFoundImg}
        alt={"nosearchimage"}
        className={"h-16 w-16"}
      />
      <p className={"text-fs_16 font-medium"}>
        {`${Labels.noSearchFoundIn} `}
        <span
          className={`${
            role === Roles.BUYER ? "text-c_BDA585" : "text-c_1f3c56"
          } capitalize text-fs_20`}
        >{`"${entity}"`}</span>
      </p>
    </div>
  );
};

export default NoSearchFound;
