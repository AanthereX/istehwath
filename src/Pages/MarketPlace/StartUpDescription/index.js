/** @format */

import { StartupDetails } from "../../../Components/Buyer/MarketPlace";
import CommonLayout from "../CommonLayout/CommonLayout";

const StartUpDescription = () => {
  return (
    <CommonLayout>
      <div
        className={
          "mx-auto 2xl:w-3/5 xl:w-4/5 lg:w-11/12 md:w-4/5 w-11/12 pt-2 pb-2 px-8"
        }
      >
        <StartupDetails />
      </div>
    </CommonLayout>
  );
};

export default StartUpDescription;
