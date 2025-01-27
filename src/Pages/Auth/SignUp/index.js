/** @format */

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  PasswordInput,
  SocialAuth,
  TextInput,
} from "../../../Components/FormComponents";
import LoginLayout from "../AuthLayout/LoginLayout";
import { useDispatch, useSelector } from "react-redux";
import BackButton from "../../../Components/FormComponents/Button/BackButton";
import { Fragment, useState } from "react";
import {
  checkInternetConnection,
  signUpValidationSchema,
} from "../../../constants/validate";
import {
  appleLoginAction,
  SignUpAction,
  socialLoginAction,
} from "../../../Store/actions/auth";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import toast from "react-hot-toast";
import { SCREENS } from "../../../Router/routes.constants";
import useLocalStorage from "react-use-localstorage";
import AppleLogin from "react-apple-login";
import { Images } from "../../../assets/images";

const SignUp = () => {
  const navigate = useNavigate();
  const { Google, Logo, AppleLogo } = Images;
  const Labels = useSelector((state) => state?.Language?.labels);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isTermsConditionChecked, setIsTermsConditionChecked] = useState(false);
  const dispatch = useDispatch();
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  const {
    handleSubmit,
    setValue,
    control,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signUpValidationSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmitHandler = (data) => {
    // eslint-disable-next-line no-extra-boolean-cast
    // if (!isTermsConditionChecked) {
    //   toast.error(Labels.pleaseCheckOurTermsAndConditionToContinue);
    //   window.scrollTo({ top: 0, behavior: "smooth" });
    // } else {
    if (Boolean(checkInternetConnection(Labels))) {
      const params = {
        email: data?.email.toLocaleLowerCase(),
        password: data?.password,
        isAccept: isChecked,
        language: localStorageLanguage === "ar" ? "ar" : "en",
      };
      localStorage.setItem("forgotEmail", data?.email.toLocaleLowerCase());
      dispatch(
        SignUpAction(params, navigate, setIsLoading, localStorageLanguage),
      );
    }
    // }
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

  const handleGoogleLogin = async () => {
    const provider = await new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then(async (res) => {
        const response = await res?._tokenResponse;
        if (response?.localId) {
          const payload = {
            email: response?.email.toLocaleLowerCase(),
            fullName: response?.fullName,
            image: response?.photoUrl,
            type: "google",
            socialId: response?.localId,
            language: localStorageLanguage === "ar" ? "ar" : "en",
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

  const handleCheckboxChange = () => {
    setIsChecked((prev) => !prev);
  };

  const handleTermsConditionCheckboxChange = () => {
    setIsTermsConditionChecked((prev) => !prev);
  };

  return (
    <Fragment>
      <LoginLayout>
        <div className='flex flex-col'>
          <div className='flex items-center justify-center'>
            <img src={Logo} width={200} height={120} />
          </div>
          <div className='text-center my-8'>
            <div>
              <span className='text-fs_32 text-c_181818 font-general_semiBold'>
                {Labels.signUp}
              </span>
            </div>
            <div>
              <span className='text-c_181818 font-general_medium text_fs_16'>
                {Labels.pleaseEnterDetailsToContinue}
              </span>
            </div>
          </div>

          <div className='w-full flex flex-col items-center justify-center'>
            <form onSubmit={handleSubmit(onSubmitHandler)}>
              <div className='flex flex-col gap-y-3'>
                <div>
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
                            setValue(
                              "email",
                              e.target.value.replace(/\s/g, ""),
                            );
                          }}
                          placeholder={Labels.emailAddress}
                          className={`p-2 pl-4 font-general_regular font-normal text-fs_16 placeholder:text-c_D9D9D9 placeholder:font-general_light placeholder:font-light text-c_181818 border rounded-xl w-full min-h-[49px] border-c_D9D9D9 focus:border-c_0E73D0 outline-none`}
                        />
                      );
                    }}
                  />
                </div>

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
                </div>
                <div>
                  <Controller
                    control={control}
                    name='confirmPassword'
                    render={({ field: { value } }) => {
                      return (
                        <PasswordInput
                          id='confirmPassword'
                          name='confirmPassword'
                          value={value}
                          error={Boolean(errors?.confirmPassword)}
                          errorText={errors?.confirmPassword?.message}
                          onChange={(e) => {
                            clearErrors("confirmPassword");
                            setValue(
                              "confirmPassword",
                              e.target.value.replace(/\s/g, ""),
                            );
                          }}
                          placeholder={Labels.confirmPassword}
                          className={`p-2 pl-4 ${
                            localStorageLanguage === "eng" ? "pr-12" : "pl-12"
                          } font-general_regular font-normal text-fs_16 placeholder:text-c_D9D9D9 placeholder:font-general_light placeholder:font-light text-c_181818 border rounded-xl w-full min-h-[49px] border-c_D9D9D9 focus:border-c_0E73D0 outline-none`}
                        />
                      );
                    }}
                  />
                </div>
                <div>
                  <div className='flex items-center gap-x-2 mt-2'>
                    <TextInput
                      type={"checkbox"}
                      name={"subscribeTo"}
                      id={"subscribeTo"}
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                      className={`flex items-center h-4 w-4 rounded accent-c_1F3D57`}
                    />
                    <label
                      htmlFor={"subscribeTo"}
                      className='text-fs_12 text-c_A6A6A6 w-[40ch] break-words cursor-pointer select-none'
                    >
                      {Labels.subscribeToEmailing}
                    </label>
                  </div>
                </div>
                <div>
                  {/* <div className='flex items-center gap-x-2 mb-2'>
                    <TextInput
                      type={"checkbox"}
                      name={"termsCondition"}
                      id={"termsCondition"}
                      checked={isTermsConditionChecked}
                      onChange={handleTermsConditionCheckboxChange}
                      className={`flex items-center h-4 w-4 rounded accent-c_1F3D57`}
                    />
                    <p className='text-fs_12 text-c_A6A6A6 w-[40ch] break-words select-none'>
                      <label
                        htmlFor={"termsCondition"}
                        className={"cursor-pointer"}
                      >
                        {`${Labels.pleaseAcceptOur}`}{" "}
                      </label>
                      <a
                        href={
                          localStorageLanguage === "eng"
                            ? "https://istehwath.net/terms-conditions/?hide_header=true"
                            : "https://istehwath.net/ar/terms-conditions/?hide_header=true"
                        }
                        target={"_blank"}
                        className={"underline cursor-pointer"}
                      >
                        {`${Labels.termsAndCondition}`}
                      </a>{" "}
                      <span>{` ${Labels.and} `}</span>{" "}
                      <a
                        href={
                          localStorageLanguage === "eng"
                            ? "https://istehwath.net/privacy-policy/?hide_header=true"
                            : "https://istehwath.net/ar/privacy-policy/?hide_header=true"
                        }
                        target={"_blank"}
                        className={"underline cursor-pointer"}
                      >
                        {`${Labels.privacyPolicy}`}
                      </a>
                    </p>
                  </div> */}
                </div>
              </div>

              <div className={"mt-1"}>
                <Button
                  type={"submit"}
                  isLoading={isLoading}
                  disabled={isLoading && (errors?.email || errors.password)}
                  className={"mt-2"}
                >
                  {Labels.signUpButtonText}
                </Button>
              </div>
              <div>
                <div className='relative w-full'>
                  <div className='flex items-center my-10'>
                    <div className='w-full border-t border-black border-opacity-20 ' />
                    <span className='text-fs_16 text-c_181818 px-8 text-opacity-20 font-medium font-general_medium'>
                      {Labels.or}
                    </span>
                    <div className='w-full border-t border-black border-opacity-20' />
                  </div>
                </div>
              </div>
            </form>

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

            <div className='mb-8'>
              <SocialAuth
                icon={Google}
                onClick={handleGoogleLogin}
                buttonText={Labels.continueWithGoogle}
                iconClassName={"!w-[16px] !h-[16px]"}
                className={"gap-x-1"}
                textPadding={localStorageLanguage === "eng" ? "pl-2" : "pr-2"}
              />
            </div>
            <div className='text-center'>
              <span className='text-c_181818 text-fs_16 font-general_medium'>
                {Labels.alreadyHaveAccount}
              </span>{" "}
              <Link to={"/"}>
                <span className='font-general_medium text-fs_16 text-c_1C2F3E'>
                  {Labels.login}
                </span>
              </Link>
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
    </Fragment>
  );
};

export default SignUp;
