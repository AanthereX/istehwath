/** @format */

import CommonLayout from "../../MarketPlace/CommonLayout/CommonLayout";
import { useSelector } from "react-redux";
import ProfileForm from "../../Auth/VerifyBusiness/ProfileForm";

const EditProfile = () => {
  const Labels = useSelector((state) => state.Language.labels);

  return (
    <CommonLayout>
      <div className='mx-auto w-4/5 md:w-4/5 lg:w-10/12 xl:w-4/5 2xl:w-4/5 max-w-[1600px] pt-2 p-4'>
        <div className='flex justify-center items-center'>
          <span className='text-fs_40 font-general_semiBold'>
            {Labels.settings}
          </span>
        </div>

        <div className='flex justify-center items-center'>
          <span className='text-c_7C7C7C text-center text-fs_16'>
            {Labels.manageSettings}
          </span>
        </div>
        <div>
          <ProfileForm />
        </div>
      </div>
    </CommonLayout>
  );
};

export default EditProfile;
