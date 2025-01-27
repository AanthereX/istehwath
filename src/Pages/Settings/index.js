/** @format */

import { useEffect } from "react";
import CommonLayout from "../MarketPlace/CommonLayout/CommonLayout";
import { useSelector } from "react-redux";
import SettingsTabs from "./Tabs";
import { useLocation, useNavigate } from "react-router-dom";

const Settings = () => {
  const Labels = useSelector((state) => state?.Language?.labels);
  const location = useLocation();
  const navigate = useNavigate();
  const { isFromRejectStartupModal } = location.state || {};

  useEffect(() => {
    if (location.state) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location, navigate]);

  return (
    <CommonLayout>
      <div className='mx-auto w-full md:w-full lg:w-4/5 xl:w-4/5 2xl:w-4/5 pt-2 p-4 sm:px-8'>
        <div className='flex justify-center items-center'>
          <span className='text-fs_40 font-general_semiBold'>
            {Labels.settings}
          </span>
        </div>

        <div className='flex justify-center items-center'>
          <span className='text-center md:text-left text-c_7C7C7C text-fs_16'>
            {Labels.manageSettings}
          </span>
        </div>

        <div className='flex'>
          <SettingsTabs isFromRejectStartupModal={isFromRejectStartupModal} />
        </div>
      </div>
    </CommonLayout>
  );
};

export default Settings;
