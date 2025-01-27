/** @format */

import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  PasswordInput,
  SocialAuth,
  TextInput,
} from "../../../Components/FormComponents";
import { Icons } from "../../../assets/icons";
import LoginLayout from "../AuthLayout/LoginLayout";
import useLocalStorage from "react-use-localstorage";
import { ChangeLanguage, ChangeLabel } from "../../../Store/actions/language";
import {
  checkInternetConnection,
  loginValidationSchema,
} from "../../../constants/validate";
import {
  LoginInAction,
  socialLoginAction,
  appleLoginAction,
} from "../../../Store/actions/auth";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { SCREENS } from "../../../Router/routes.constants";
import toast from "react-hot-toast";
import { Images } from "../../../assets/images";
import AppleLogin from "react-apple-login";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { Google, Logo, AppleLogo } = Images;
  const [rememberMeChecked, setRememberMeChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );
  const Labels = useSelector((state) => state?.Language?.labels);
  const { languageIcon, nextIcon } = Icons;
  const isLogin = false;

  const languageChange = (lang) => {
    dispatch(ChangeLanguage(lang));
    dispatch(ChangeLabel(lang));
    setLocalStorageLanguage(lang);
  };

  const handleCheckboxChange = () => {
    setRememberMeChecked((prev) => !prev);
  };

  const CustomAppleButton = (renderProps) => (
    <SocialAuth
      icon={AppleLogo}
      onClick={renderProps.onClick}
      buttonText={Labels.continueWithApple}
      iconClassName={"!w-[18px] !h-[18px]"}
      className={"gap-x-0"}
      textPadding={localStorageLanguage === "eng" ? "pl-4" : "pr-5"}
    />
  );

  const {
    handleSubmit,
    setValue,
    control,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginValidationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    localStorage.removeItem("forgotEmail");
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    const rememberedPassword = localStorage.getItem("rememberedPassword");
    if (rememberedEmail && rememberedPassword) {
      setValue("email", rememberedEmail);
      setValue("password", rememberedPassword);
    }
  }, []);

  const onSubmitHandler = (data) => {
    // eslint-disable-next-line no-extra-boolean-cast
    if (Boolean(checkInternetConnection(Labels))) {
      if (rememberMeChecked) {
        localStorage.setItem(
          "rememberedEmail",
          data?.email.toLocaleLowerCase(),
        );
        localStorage.setItem("rememberedPassword", data?.password);
      } else if (!rememberMeChecked) {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
      }
      const params = {
        email: data?.email.toLocaleLowerCase(),
        password: data?.password,
        language: localStorageLanguage === "ar" ? "ar" : "en",
      };
      dispatch(
        LoginInAction(params, navigate, setIsLoading, localStorageLanguage),
      );
    }
  };

  const handleGoogleLogin = async () => {
    const provider = await new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then(async (res) => {
        const response = await res?._tokenResponse;
        if (response?.localId) {
          const payload = {
            socialId: response?.localId,
            type: "google",
            email: response?.email.toLocaleLowerCase(),
            fullName: response?.fullName,
            image: response?.photoUrl,
            language: localStorageLanguage === "eng" ? "en" : "ar",
          };
          dispatch(
            socialLoginAction(
              payload,
              async () => {
                await navigate(SCREENS.role);
              },
              localStorageLanguage,
            ),
          );
        }
      })
      .catch((err) => {
        const msg = err.message.replace(`(${err.code}).`, "");
        toast.error(msg.replace("Firebase: ", ""));
      });
  };

  return (
    <Fragment>
      <LoginLayout props={isLogin}>
        <div className='w-full flex flex-col justify-center items-center'>
          <div className='w-full flex md:flex-row flex-col items-center justify-between gap-x-16 mb-2'>
            <div></div>
            <div
              className={`ml-0 ${
                localStorageLanguage === "eng" ? "md:ml-44" : "md:mr-44"
              }`}
            >
              <img src={Logo} width={200} height={120} />
            </div>
            <div>
              <Button
                className={`!w-[169px] !max-w-[169px] flex justify-between items-center`}
                onClick={() =>
                  languageChange(localStorageLanguage === "ar" ? "eng" : "ar")
                }
                changeLan={languageIcon}
                nextIcon={nextIcon}
                isLangArabic={localStorageLanguage == "ar" ? true : false}
                widthFull={true}
              >
                {localStorageLanguage == "ar" ? "English" : "العربية"}
              </Button>
            </div>
          </div>

          <div className='text-center my-8 w-[335px] max-w-[335px]'>
            <div>
              <span className='text-fs_32 text-c_181818 font-general_semiBold'>
                {Labels.login}
              </span>
            </div>
            <div>
              <span className='text-c_181818 font-general_medium text_fs_16'>
                {Labels.pleaseEnterDetailsToContinue}
              </span>
            </div>
          </div>
          <div className='flex flex-col w-[335px] max-w-[335px]'>
            <form onSubmit={handleSubmit(onSubmitHandler)}>
              <div className='flex flex-col justify-center items-start gap-y-2'>
                <Controller
                  control={control}
                  name='email'
                  render={({ field: { value } }) => {
                    return (
                      <TextInput
                        id='email'
                        name='email'
                        type='email'
                        value={value}
                        error={Boolean(errors?.email)}
                        errorText={errors?.email?.message}
                        onChange={(e) => {
                          clearErrors("email");
                          setValue("email", e.target.value.replace(/\s/g, ""));
                        }}
                        placeholder={Labels.emailAddress}
                        className={`p-2 pl-4 font-general_regular font-normal text-fs_16 placeholder:text-c_D9D9D9 placeholder:font-general_light placeholder:font-light text-c_181818 border rounded-xl w-full min-h-[49px] border-c_D9D9D9 focus:border-c_0E73D0 outline-none`}
                      />
                    );
                  }}
                />
                <div>
                  <Controller
                    control={control}
                    name='password'
                    render={({ field: { value } }) => {
                      return (
                        <PasswordInput
                          id='password'
                          name='password'
                          value={value}
                          error={Boolean(errors?.password)}
                          errorText={errors?.password?.message}
                          onChange={(e) => {
                            clearErrors("password");
                            setValue(
                              "password",
                              e.target.value.replace(/\s/g, ""),
                            );
                          }}
                          placeholder={Labels.password}
                          className={`p-2 pl-4 ${
                            localStorageLanguage === "eng" ? "pr-12" : "pl-12"
                          } font-general_regular font-normal text-fs_16 placeholder:text-c_D9D9D9 placeholder:font-general_light placeholder:font-light text-c_181818 border rounded-xl w-full min-h-[49px] border-c_D9D9D9 focus:border-c_0E73D0 outline-none`}
                        />
                      );
                    }}
                  />
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-x-[6px] mt-[6px]'>
                      <TextInput
                        type={"checkbox"}
                        name={"rememberMeChecked"}
                        id={"rememberMeChecked"}
                        checked={rememberMeChecked}
                        onChange={handleCheckboxChange}
                        className={`flex items-center h-3 w-3 rounded accent-c_1F3D57 cursor-pointer`}
                      />
                      <label
                        htmlFor={"rememberMeChecked"}
                        className='text-fs_12 text-c_6B6B6B font-general_medium font-medium cursor-pointer select-none'
                      >
                        {Labels.rememberMe}
                      </label>
                    </div>
                    <Link to={SCREENS.forgotPassword}>
                      <span className='text-c_181818 text-fs_12 font-general_medium font-medium'>
                        {Labels.forgetPassword}
                      </span>
                    </Link>
                  </div>

                  <Button
                    type={"submit"}
                    isLoading={isLoading}
                    disabled={isLoading && (errors?.email || errors.password)}
                    className={"mt-5"}
                  >
                    {Labels.login}
                  </Button>
                </div>
              </div>
            </form>
            <div>
              <div className='relative w-full'>
                <div className='flex items-center mt-7 mb-5'>
                  <div className='w-full border-t border-black border-opacity-20' />
                  <span className='text-fs_16 text-c_181818 px-8 text-opacity-20 font-medium font-general_medium'>
                    {Labels.or}
                  </span>
                  <div className='w-full border-t border-black border-opacity-20' />
                </div>
              </div>
            </div>
            <div>
              <AppleLogin
                clientId={"com.istehwath.web.apple"}
                redirectURI={"https://web.istehwath.net/"}
                scope={"name email"}
                responseMode={"query"}
                usePopup={false}
                render={CustomAppleButton}
                callback={(res) => {
                  if (res?.code) {
                    const params = {
                      code: res?.code,
                      language: localStorageLanguage === "eng" ? "en" : "ar",
                    };
                    dispatch(
                      appleLoginAction(params, navigate, localStorageLanguage),
                    );
                  }
                }}
              />
            </div>
            <div>
              <SocialAuth
                icon={Google}
                onClick={handleGoogleLogin}
                buttonText={Labels.continueWithGoogle}
                iconClassName={"!w-[16px] !h-[16px]"}
                className={"gap-x-1"}
                textPadding={localStorageLanguage === "eng" ? "pl-2" : "pr-2"}
              />
            </div>
            <div className='text-center mt-8'>
              <span className='text-c_181818 text-fs_16 font-general_medium'>
                {Labels.doNotHaveAnAccount}
              </span>
              <Link to={"/signup"}>
                <span className='font-general_medium text-c_1C2F3E text-fs_16'>
                  {` ${Labels.signUp}`}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </LoginLayout>
    </Fragment>
  );
};

export default Login;
