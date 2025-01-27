/** @format */

import React from "react";
import LoginLayout from "../AuthLayout/LoginLayout";
import { Button, CheckButton } from "../../../Components/FormComponents";
import Logo from "../../../assets/images/logo.svg";
import { useSelector } from "react-redux";
import { useState } from "react";

const ChangeLanguage = () => {
  const Labels = useSelector((state) => state?.Language?.labels);
  const [language, setLanguage] = useState([
    {
      id: "1",
      text: "English",
      labelKey: "English",
      isSelected: true,
    },
    {
      id: "2",
      text: "Arabic",
      labelKey: "Arabic",
      isSelected: false,
    },
  ]);
  const handleSelectlanguage = (language) => {
    const { id } = language;
    setLanguage((prev) =>
      prev?.map((item) =>
        item?.id === id
          ? { ...item, isSelected: true }
          : { ...item, isSelected: false },
      ),
    );
  };
  return (
    <LoginLayout>
      <div className='flex flex-col'>
        <div className='flex items-center justify-center'>
          <img src={Logo} />
        </div>
        <div className='text-center my-8'>
          <div>
            <span className='text-fs_32 text-c_181818 font-general_semiBold'>
              {Labels.changeLanguage}
            </span>
          </div>
          <div>
            <span className='text-c_181818'>{Labels.selectLanguage}</span>
          </div>
        </div>
        <div className='flex flex-col gap-3 items-center justify-center'>
          <div>
            {language?.map((item) => (
              <CheckButton
                key={item?.id}
                {...item}
                text={Labels[item?.labelKey]}
                onClick={() => handleSelectlanguage(item)}
                icon={false}
              />
            ))}
          </div>

          <div>
            <Button>{Labels.continue}</Button>
          </div>
        </div>
      </div>
    </LoginLayout>
  );
};

export default ChangeLanguage;
