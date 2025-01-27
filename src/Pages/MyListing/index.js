/**
 * eslint-disable react-hooks/rules-of-hooks
 *
 * @format
 */

import CommonLayout from "../MarketPlace/CommonLayout/CommonLayout";
import { useSelector } from "react-redux";
import { ListingTabs } from "./ListingTabs";

const MyListing = () => {
  const Labels = useSelector((state) => state?.Language?.labels);
  const user = useSelector((state) => state?.User?.userData?.payload);

  return (
    <CommonLayout>
      <div
        className={
          "mx-auto max-w-[1600px] 2xl:w-4/5 xl:w-4/5 lg:w-11/12 md:w-full pt-2 p-4 sm:px-8"
        }
      >
        <div className={"flex justify-center items-center"}>
          <span className={"text-fs_40 font-general_semiBold"}>
            {Labels.myListing}
          </span>
        </div>

        <ListingTabs />
      </div>
    </CommonLayout>
  );
};

export default MyListing;
