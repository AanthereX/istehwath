/** @format */

import Logo from "../../assets/images/istewath-logo.svg";
import { Circles } from "react-loader-spinner";
import { Roles } from "../../constants/constant";

const SpinnerComponent = ({ block = true, children }) => {
  const role = localStorage.getItem("role");
  if (block) {
    document.body.style.overflow = "auto";
  } else {
    document.body.style.overflow = "auto";
  }
  return (
    <div
      role='status'
      className='bg-offWhite min-h-screen flex items-center justify-center'
    >
      <div className='flex items-center flex-col gap-y-1  min-h-screen inset-0  justify-center  cursor-loading w-full  '>
        <img className='w-40 h-40' src={Logo} alt='logo' draggable={false} />
        {children}
        {block ? (
          <Circles
            height='60'
            width='60'
            color={role === Roles.BUYER ? "#BDA585" : "#1F3C55"}
            ariaLabel='circles-loading'
            wrapperStyle={{}}
            wrapperClass=''
            visible={true}
          />
        ) : null}

        <span className='sr-only'>Loading...</span>
      </div>
    </div>
  );
};

export default SpinnerComponent;
