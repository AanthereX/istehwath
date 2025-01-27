import React from "react";
import bottomLogo from "../../../assets/images/bottomLogo.svg";

export default function VerifyBusinessLayout({ children }) {
  return (
    <div className="relative flex justify-center xl:px-56 sm:px-14 px-5 xl:py-0 py-3 min-h-screen">
      <div className="w-full">{children}</div>
      <div className="absolute right-0 bottom-0 -z-10">
        <img src={bottomLogo} />
      </div>
    </div>
  );
}
