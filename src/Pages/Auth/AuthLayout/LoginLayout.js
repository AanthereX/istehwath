/** @format */

import bg from "../../../assets/images/loginlayout.png";
import bottmLogo from "../../../assets/images/bottomLogo.svg";
import { useSelector } from "react-redux";

export default function LoginLayout({ children }) {
  const Labels = useSelector((state) => state?.Language?.labels);
  return (
    <div className=''>
      {/* <div
        className='min-h-screen bg-no-repeat bg-cover px-24 overflow-x-hidden items-center xl:flex hidden bg-gradient-to-r from-c_1C2F40 to-c_20415E'
        style={{
          backgroundImage: `url('${bg}')`,
        }}
      >
        <div className='space-y-5'>
          <div className='text-fs_41 text-white font-general_semiBold'>
            <span>{`${Labels.saleAndInvestIn} `}</span>
            <span className='text-c_B68C4F'>{Labels.innovativeStartups}</span>
            <span>{` ${Labels.onOurPlatform}`}</span>
          </div>
          <div>
            <span className='text-fs_16 text-white'>
              {Labels.signupDescription}
            </span>
          </div>
        </div>
      </div> */}
      <div className='relative flex items-center flex-col justify-center xl:px-48 sm:px-14 px-5 xl:py-5 py-10 min-h-screen'>
        <div className='w-full'>{children}</div>
        <div className='absolute right-0 bottom-0 -z-10'>
          <img src={bottmLogo} />
        </div>
      </div>
    </div>
  );
}
