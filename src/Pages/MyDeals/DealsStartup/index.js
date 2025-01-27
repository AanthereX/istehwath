/** @format */

import React from "react";
import CommonLayout from "../../MarketPlace/CommonLayout/CommonLayout";
import { StartupDetails } from "../../../Components/MarketPlace";

export const DetailsStartup = () => {
  return (
    <CommonLayout>
      <div className='mx-auto md:w-4/5 pt-2 p-4 sm:px-8'>
        <StartupDetails />
      </div>
    </CommonLayout>
  );
};
