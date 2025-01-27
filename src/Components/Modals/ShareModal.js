/** @format */

import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import { Icons } from "../../assets/icons";
import { useSelector } from "react-redux";
import { Button, TextInput } from "../FormComponents";
import { BsClipboardCheck } from "react-icons/bs";
import { FaInstagram } from "react-icons/fa";
import toast from "react-hot-toast";
import {
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
  InstapaperIcon,
  InstapaperShareButton,
  TwitterShareButton,
  ViberIcon,
  ViberShareButton,
  XIcon,
  LineShareButton,
  LineIcon,
  LinkedinShareButton,
  LinkedinIcon,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import useLocalStorage from "react-use-localstorage";
import { useNavigate } from "react-router-dom";
import SkeletonLoader from "../SkeletonLoader";

const ShareModal = ({
  isOpen,
  setIsOpen,
  modalDialogClassName,
  url,
  isLoading,
}) => {
  const navigate = useNavigate();
  const {
    crossIcon,
    instaGramSvgIcon,
    copyIconSvgIconFilled,
    copyIconSvgIconOutline,
  } = Icons;
  const Labels = useSelector((state) => state?.Language?.labels);
  const [copy, setCopy] = useState(false);
  const [copyIcon, setCopyIcon] = useState(false);
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  const handleShare = (_dynamicUrl) => {
    const instagramUrl = `https://www.instagram.com/`;
    const width = 600;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      instagramUrl,
      "_blank",
      `width=${width},height=${height},top=${top},left=${left}`,
    );
  };

  const handleCopyUrl = () => {
    setCopy(true);
    navigator.clipboard
      .writeText(`${url}`)
      .then(() => {
        toast(
          (t) => (
            <button
              className='flex items-center py-2 justify-start gap-x-3 text-c_181818 font-general_normal font-normal'
              onClick={() => toast.dismiss(t.id)}
            >
              <BsClipboardCheck
                className='text-c_2CAB00 h-4 w-4'
                alt='clipboardicon'
              />
              {Labels.urlCopiedToClipboard}
            </button>
          ),
          {
            position: "bottom-right",
          },
        );
        setTimeout(() => {
          setCopy(false);
        }, 1000);
      })
      .catch((err) => {
        console.error("Async: Could not copy text: ", err);
      });
  };

  const handleCopyUrlForIcon = () => {
    setCopyIcon(true);
    navigator.clipboard
      .writeText(`${url}`)
      .then(() => {
        toast(
          (t) => (
            <button
              className='flex items-center py-2 justify-start gap-x-3 text-c_181818 font-general_normal font-normal'
              onClick={() => toast.dismiss(t.id)}
            >
              <BsClipboardCheck
                className='text-c_2CAB00 h-4 w-4'
                alt='clipboardicon'
              />
              {Labels.urlCopiedToClipboard}
            </button>
          ),
          {
            position: "bottom-right",
          },
        );
        setTimeout(() => {
          setCopyIcon(false);
        }, 1000);
      })
      .catch((err) => {
        console.error("Async: Could not copy text: ", err);
      });
  };

  return (
    <Transition appear show={Boolean(isOpen)} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-10'
        onClose={() => setIsOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-c_121516/80 transition-opacity' />
        </Transition.Child>
        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center bg-c_7A7A7A bg-opacity-[70%]'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel
                className={`md:p-5 p-4 md:w-auto w-11/12 transform bg-c_FEFEFE rounded-3xl text-center align-middle shadow-xl transition-all ${modalDialogClassName}`}
              >
                <div className='text-lg bg-c_292929 md:!w-[60ch] flex w-full justify-center flex-col'>
                  <span className='text-black font-general_semiBold text-fs_32 block mt-2'>
                    {Labels.share}
                  </span>
                </div>
                <div className='top-0 right-0 absolute hidden pt-4 pr-4 sm:block'>
                  <button
                    type='button'
                    className='rounded-md bg-transparent hover:outline-none focus:outline-none'
                    onClick={() => setIsOpen(false)}
                  >
                    <span className={"sr-only"}>Close</span>
                    <img
                      src={crossIcon}
                      className={
                        "absolute h-3.5 w-3.5 right-4 top-4 cursor-pointer"
                      }
                    />
                  </button>
                </div>
                <div className={"flex justify-center flex-col mt-7 md:mt-10"}>
                  <div className={`relative`}>
                    <SkeletonLoader
                      height={40}
                      borderRadius={"0.75rem"}
                      loading={isLoading}
                    >
                      <TextInput
                        value={`${url}`}
                        disabled={true}
                        className={`!w-full md:text-fs_16 text-fs_13 !max-w-full py-2 bg-c_D3D3D3 border border-transparent ${
                          localStorageLanguage === "eng"
                            ? "pl-2 pr-0"
                            : "pr-2 pl-0"
                        }`}
                      />
                    </SkeletonLoader>

                    <button onClick={handleCopyUrl}>
                      <span
                        className={`md:text-fs_16 text-fs_13 ${
                          localStorageLanguage === "eng"
                            ? "right-2 absolute md:top-2 top-[9px]"
                            : "left-2 absolute md:top-2 top-[9px]"
                        }`}
                      >
                        {copy ? Labels.copied : Labels.copy}
                      </span>
                    </button>
                  </div>
                </div>
                <div className='my-3 flex gap-3 justify-center'>
                  <button onClick={() => handleShare(url)}>
                    <img
                      src={instaGramSvgIcon}
                      width={32}
                      height={32}
                      alt={"instaicon"}
                      className={"h-[32px] w-[32px]"}
                    />
                  </button>
                  <FacebookShareButton
                    url={url}
                    subject={Labels.Istehwath}
                    body='body'
                  >
                    <FacebookIcon size={32} round />
                  </FacebookShareButton>
                  <EmailShareButton
                    url={url}
                    subject={Labels.Istehwath}
                    body='body'
                  >
                    <EmailIcon size={32} round />
                  </EmailShareButton>
                  <LinkedinShareButton
                    url={url}
                    subject={Labels.Istehwath}
                    body='body'
                  >
                    <LinkedinIcon size={32} round />
                  </LinkedinShareButton>
                  <WhatsappShareButton
                    url={url}
                    subject={Labels.Istehwath}
                    body='body'
                  >
                    <WhatsappIcon size={32} round />
                  </WhatsappShareButton>

                  <button onClick={handleCopyUrlForIcon}>
                    <img
                      src={
                        copyIcon
                          ? copyIconSvgIconFilled
                          : copyIconSvgIconOutline
                      }
                      alt={"copyicon"}
                      width={24}
                      height={24}
                      className={"w-[24px] h-[24px]"}
                    />
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ShareModal;
