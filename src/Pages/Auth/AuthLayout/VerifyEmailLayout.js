/** @format */

import bg from "../../../assets/images/loginlayout.png";
import bottmLogo from "../../../assets/images/bottomLogo.svg";
import { useSelector } from "react-redux";
import { Icons } from "../../../assets/icons";
import { useNavigate } from "react-router-dom";

export default function VerifyEmailLayout({ children }) {
  const navigation = useNavigate();
  const Labels = useSelector((state) => state?.Language?.labels);
  const { lessIcon } = Icons;
  return (
    <div className=''>
      {/* <div
        className="min-h-screen bg-no-repeat bg-cover px-32  items-end col-span-1 xl:flex hidden"
        style={{
          backgroundImage: `url('${bg}')`,
        }}
      ></div> */}
      <div className='relative flex items-center justify-center xl:px-56 sm:px-14 px-5 col-span-2 xl:py-5 py-10 min-h-screen'>
        <div className='w-full'>{children}</div>
        <div className='absolute right-0 bottom-0 -z-10'>
          <img src={bottmLogo} />
        </div>
      </div>
    </div>
  );
}
