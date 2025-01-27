/** @format */

import { Fragment } from "react";
import { Circles } from "react-loader-spinner";
import { Roles } from "../../constants/constant";

const ApiLoader = ({ block = false, children }) => {
  const role = localStorage.getItem("role");
  if (block) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
  return (
    <Fragment>
      <div className='relative'>
        {block ? (
          <div
            className={
              "min-h-[200px] flex justify-center items-center cursor-loading"
            }
          >
            <Circles
              height={"60"}
              width={"60"}
              color={role === Roles.BUYER ? "#BDA585" : "#1F3C55"}
              ariaLabel='circles-loading'
              wrapperStyle={{}}
              wrapperClass={""}
              visible={true}
            />
          </div>
        ) : null}
        {children}
      </div>
    </Fragment>
  );
};

export default ApiLoader;
