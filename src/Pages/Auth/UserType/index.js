/** @format */

import { useEffect, useState } from "react";
import { Button, CheckButton } from "../../../Components/FormComponents";
import { Icons } from "../../../assets/icons";
import Logo from "../../../assets/images/logo.svg";
import LoginLayout from "../AuthLayout/LoginLayout";
import { useDispatch, useSelector } from "react-redux";
import BackButton from "../../../Components/FormComponents/Button/BackButton";
import { useNavigate } from "react-router-dom";
import { SCREENS } from "../../../Router/routes.constants";
import { Roles, SOCIALTYPE } from "../../../constants/constant";
import { addUserRole, postFcmToken } from "../../../Store/actions/users";
import { fetchTokenValue } from "../../../firebase_setup/firebase";

const UserType = () => {
  const Labels = useSelector((state) => state?.Language?.labels);
  const { buyerIcon, sellerIcon } = Icons;
  const [selectedType, setSelectedType] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));
  const [loader, setLoader] = useState(false);
  const [token, setToken] = useState("");
  const [userTypes, setUserTypes] = useState([
    {
      id: "1",
      text: "I’m a Buyer",
      labelKey: "ImABuyer",
      icon: buyerIcon,
      isSelected: false,
      role: "buyer",
    },
    {
      id: "2",
      text: "I’m a Seller",
      labelKey: "ImASeller",
      icon: sellerIcon,
      isSelected: false,
      role: "seller",
    },
  ]);

  const handleFetch = async () => {
    const token = await fetchTokenValue();
    setToken(token);
  };

  useEffect(() => {
    handleFetch();
  }, []);

  const handleSelectUserType = (type) => {
    const { id, role } = type;
    setSelectedType(role);
    setUserTypes((prev) =>
      prev?.map((item) =>
        item?.id === id
          ? { ...item, isSelected: true }
          : { ...item, isSelected: false },
      ),
    );
  };

  return (
    <>
      <LoginLayout>
        <div className='flex flex-col items-center justify-center'>
          <div className='flex items-center justify-center'>
            <img src={Logo} />
          </div>
          <div className='text-center my-8'>
            <div className='flex flex-wrap whitespace-nowrap items-center justify-center'>
              <p className='text-fs_24 text-c_181818 font-general_semiBold'>
                {Labels.pleaseChooseAreYouASellerOrABuyer}
              </p>
              {/* <p className='flex items-center justify-center flex-wrap whitespace-nowrap lowercase'>
                <span className='text-fs_24 text-c_1E3A52 font-general_semiBold'>
                  {`${Labels.seller}`}
                </span>
                <span className='text-fs_22 text-c_181818 font-general_semiBold lowercase px-[6px]'>
                  {`${Labels.or}`}
                </span>
                <span className='text-fs_24 text-c_1E3A52 font-general_semiBold lowercase'>
                  {`${Labels.buyer}`}
                </span>
              </p> */}
            </div>
          </div>
          <div className='flex flex-col gap-3'>
            <div>
              {userTypes?.map((item) => (
                <CheckButton
                  key={item?.id}
                  {...item}
                  text={Labels[item?.labelKey]}
                  onClick={() => handleSelectUserType(item)}
                />
              ))}
            </div>

            <div>
              <Button
                isLoading={loader}
                variant={
                  !userTypes.find((item) => item.isSelected) ? "" : "primary"
                }
                disabled={!userTypes.find((item) => item.isSelected)}
                className={`${
                  !userTypes.find((item) => item.isSelected)
                    ? "bg-c_D9D9D9"
                    : ""
                }`}
                onClick={() => {
                  const params = {
                    type: selectedType,
                  };
                  dispatch(
                    addUserRole(
                      params,
                      () => {
                        localStorage.setItem("role", selectedType);
                        const payload = {
                          token: token,
                          deviceName: "Desktop",
                          deviceTokenType: "web",
                        };
                        postFcmToken(payload);
                        navigate(
                          !user?.profileCompleted &&
                            selectedType === Roles.BUYER
                            ? SCREENS.buyerCompleteProfile
                            : !user?.profileCompleted &&
                              selectedType === Roles.SELLER
                            ? SCREENS.sellerCompleteProfile
                            : user?.profileCompleted &&
                              selectedType === Roles.SELLER
                            ? SCREENS.sellerListing
                            : user?.profileCompleted &&
                              selectedType === Roles.BUYER
                            ? SCREENS.buyerMarketplace
                            : user?.profileCompleted &&
                              user?.socialType === SOCIALTYPE.GOOGLE &&
                              Roles.BUYER
                            ? SCREENS.buyerMarketplace
                            : user?.profileCompleted &&
                              user?.socialType === SOCIALTYPE.GOOGLE &&
                              Roles.SELLER
                            ? SCREENS.sellerListing
                            : "",
                          { replace: true },
                        );
                      },
                      setLoader,
                    ),
                  );
                }}
              >
                {Labels.continue}
              </Button>
            </div>
          </div>
          <div className='w-fit mx-auto'>
            <BackButton
              onClick={() => {
                navigate("/");
              }}
            />
          </div>
        </div>
      </LoginLayout>
    </>
  );
};

export default UserType;
