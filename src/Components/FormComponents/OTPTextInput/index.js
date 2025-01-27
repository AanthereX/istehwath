/** @format */

import React, { Fragment, useEffect, useState } from "react";
import OTPInput from "otp-input-react";
import { useLocation, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Button from "../Button";
import { Images } from "../../../assets/images";
import Spinner from "../../Spinner/AuthLoader";
import "./otpinput.style.css";

const OTPTextInput = () => {
  const navigate = useNavigate();
  const [OTP, setOTP] = useState("");
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [time, setTime] = useState("");
  const location = useLocation();
  const dispatch = useDispatch();
  const labels = useSelector((state) => state?.Language?.labels);

  return (
    <Fragment>
      <div>
        <form>
          <div
            dir={"ltr"}
            className={
              "flex flex-col justify-center items-center gap-y-3 mt-8 mb-8"
            }
          >
            <OTPInput
              value={OTP}
              onChange={setOTP}
              autoFocus
              OTPLength={4}
              otpType={"number"}
              className={"gap-2 otp-input"}
            />
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default OTPTextInput;
