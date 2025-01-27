import React from "react";
import VerifyBusinessLayout from "../AuthLayout/VerifyBusinessLayout";

import { useNavigate } from "react-router-dom";
import { Button } from "../../../Components/FormComponents";
import SelectInput from "../../../Components/FormComponents/Select";
import Logo from "../../../assets/images/profilelogo.svg";
import { useSelector } from "react-redux";
import ProfileForm from "./ProfileForm";

export default function VerifyBusiness() {
  const Labels = useSelector((state) => state?.Language?.labels);
  const navigation = useNavigate();
  return (
    <div>
      <VerifyBusinessLayout>
        <div className="flex flex-row justify-between items-center flex-wrap">
          <div className="flex flex-1"></div>
          <div className="flex flex-1">
            <img src={Logo} />
          </div>
          <div className="">
            <Button onClick={() => navigation("#")}>{Labels.logOut}</Button>
          </div>
        </div>
        <div className="text-center mt-14 mb-8">
          <div>
            <span className="text-fs_32 text-c_181818 font-general_semiBold">
              {Labels.completeProfileDetails}
            </span>
          </div>
          <div>
            <span className="text-c_181818 text-fs_16">
              {Labels.pleaseCompleteDetailsToAccessAllFeatures}
            </span>
          </div>
        </div>
        {/* <ProfileForm /> */}
      </VerifyBusinessLayout>
    </div>
  );
}
