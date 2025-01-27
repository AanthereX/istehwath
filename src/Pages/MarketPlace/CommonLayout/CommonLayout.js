/** @format */

import { useSelector } from "react-redux";
import { SCREENS } from "../../../Router/routes.constants";
import Navbar from "../../../layout/Navbar";
import WhatsAppRedirect from "../../../Components/WhatsAppRedirect";

const CommonLayout = ({ children }) => {
  const condition =
    window.location.pathname === SCREENS.buyerMarketplace ||
    window.location.pathname === SCREENS.sellerListing;
  const Labels = useSelector((state) => state.Language.labels);
  return (
    <div
      className={`min-h-screen overflow-x-hidden bg-no-repeat bg-cover bg-main-hero-bg`}
    >
      <Navbar />
      <div className='relative z-[2]'>{children}</div>
      <footer className='relative overflow-x-hidden bg-transparent mt-20'>
        <div className='md:mx-32 mx-8 border-c_181818/20 border-t-[1px]'></div>
        <p className='py-6 flex items-center justify-center text-fs_16 text-c_787878'>
          {Labels.copyRightsReservedIstehwath}
        </p>
        {!!condition ? <WhatsAppRedirect /> : null}
      </footer>
    </div>
  );
};

export default CommonLayout;
