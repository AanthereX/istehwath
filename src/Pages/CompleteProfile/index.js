/** @format */

import CompleteProfileForm from "../../Components/CompleteProfileForm";
import NavbarCompleteProfile from "../../layout/Navbar/NavbarCompleteProfile";

const CompleteProfile = () => {
  return (
    <div className='mx-auto w-11/12 md:w-11/12 lg:w-4/5 pt-2 p-0 lg:px-8'>
      <NavbarCompleteProfile />
      <div>
        <CompleteProfileForm />
      </div>
    </div>
  );
};

export default CompleteProfile;
