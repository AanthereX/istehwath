/**
 * eslint-disable no-extra-boolean-cast
 *
 * @format
 */

import { Fragment, useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { Button } from "../../Components/FormComponents";
import { Images } from "../../assets/images";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { useSelector } from "react-redux";
import { checkInternetConnection } from "../../constants/validate";
import { SCREENS } from "../../Router/routes.constants";
import { logOutAction } from "../../Store/actions/auth";
import useLocalStorage from "react-use-localstorage";

const NavbarCompleteProfile = () => {
  const Labels = useSelector((state) => state?.Language?.labels);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logo } = Images;
  const navigate = useNavigate();
  const [deviceNameState, setDeviceNameState] = useState("");
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  useEffect(() => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("iPhone")) {
      setDeviceNameState("iPhone");
    } else if (userAgent.includes("Android")) {
      setDeviceNameState("Android");
    } else if (userAgent.includes("Windows")) {
      setDeviceNameState("Windows");
    } else {
      setDeviceNameState("Unknown");
    }
  }, []);

  const handleLogOut = async () => {
    if (Boolean(checkInternetConnection(Labels))) {
      const payload = {
        deviceName: deviceNameState,
      };
      await logOutAction(payload, SCREENS.login, localStorageLanguage);
    }
  };

  return (
    <header>
      <nav
        className={"w-full flex items-center justify-between"}
        aria-label={"Global"}
      >
        <div></div>
        <button
          onClick={() => navigate("/")}
          className={"-m-1.5 p-1.5 outline-none"}
        >
          <span className={"sr-only"}>Your Company</span>
          <img
            className={"ml-0 md:ml-32 lg:ml-32 xl:ml-36 2xl:ml-36 w-52"}
            src={logo}
            alt={"istehwathlogo"}
          />
        </button>

        <div className={"flex justify-end items-center flex-wrap gap-4"}>
          <Button
            variant={"primary"}
            size={"md"}
            onClick={handleLogOut}
            className={"!w-fit uppercase"}
          >
            {Labels.logOut}
          </Button>
        </div>
      </nav>
      <Dialog
        as={"div"}
        className={"lg:hidden"}
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className={"fixed inset-0 z-10"} />
        <Dialog.Panel
          className={
            "fixed inset-y-0 left-0 z-10 w-full overflow-y-auto bg-c_FFFFFF px-6 py-6"
          }
        >
          <div className={"flex items-center justify-between"}>
            <div className={"flex flex-1"}>
              <button
                type={"button"}
                className={"-m-2.5 rounded-md p-2.5"}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className={"sr-only"}>Close menu</span>
                <GiHamburgerMenu />
              </button>
            </div>
            <button onClick={() => navigate("/")} className={"-m-1.5 p-1.5"}>
              <span className='sr-only'>Your Company</span>
              <img className='w-40' src={logo} alt='istehwathlogo' />
            </button>
            <div className='flex flex-1 justify-end items-center'>
              <Menu as='div' className='relative ml-3'>
                <Transition
                  as={Fragment}
                  enter='transition ease-out duration-100'
                  enterFrom='transform opacity-0 scale-95'
                  enterTo='transform opacity-100 scale-100'
                  leave='transition ease-in duration-75'
                  leaveFrom='transform opacity-100 scale-100'
                  leaveTo='transform opacity-0 scale-95'
                >
                  <Button
                    variant={"primary"}
                    size={"md"}
                    className={"!w-fit uppercase"}
                    onClick={handleLogOut}
                  >
                    {Labels.logOut}
                  </Button>
                </Transition>
              </Menu>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
};

export default NavbarCompleteProfile;
