/** @format */

import clsx from "clsx";
import Spinner from "../../Spinner/AuthLoader";
import { Roles } from "../../../constants/constant";

const Button = (props) => {
  const {
    onClick = () => {},
    type = "button",
    children,
    isLoading = false,
    className = "",
    size = "md",
    variant = "primary",
    disabled = false,
    spinnerColor = "#fff",
    isLangArabic = false,
    Icon = null,
    iconColor = "#C30000",
    iconSize = 24,
    widthFull = false,
    rowReverse = false,
    image = null,
    imgAlt = "",
    ...rest
  } = props;
  const role = localStorage.getItem("role");
  const sizeClasses = (size) => {
    switch (size) {
      case "xs":
        return `px-3.5 py-1 text-base`;
      case "sm":
        return `px-5 py-1 text-sm`;
      case "sm-2xl":
        return `px-10 py-1 text-base`;
      case "md":
        return `px-7 py-2.5 text-md`;
      case "lg":
        return `px-8 py-3 text-lg`;
      case "xl":
        return `px-20 py-3.5 text-lg`;
      case "zero":
        return `px-7 py-0 text-md`;
      default:
        return "";
    }
  };
  const variantClasses = (variant) => {
    switch (variant) {
      case "primary":
        return role === Roles.BUYER
          ? `bg-c_BDA585 text-white`
          : `bg-gradient-to-r from-c_1C2F40 to-c_20415E text-white`;
      case "primary-outline":
        return `bg-c_FFFFFF text-c_1C2F40 ${
          role === Roles.BUYER
            ? "border border-c_BDA585"
            : "border border-c_1C2F40"
        }`;
      case "secondary":
        return `bg-c_CACACA text-c_6B6B6B`;
      case "danger":
        return `bg-c_E97979 text-white`;
      case "platinum":
        return `bg-c_FFFFFF text-c_1E384F`;
      case "premium":
        return `bg-c_1e384F text-c_FFFFFF`;
      case "draft":
        return `bg-c_FFFFFF text-c_1F3D57 border border-c_1F3D57`;
      case "secondary-light":
        return `bg-c_F4F4F4 text-c_7D7C7D border-none`;
      case "promoted-light-blue":
        return `bg-c_A7D5EF text-c_164661 border-none`;
      case "delete-listing-red":
        return `bg-transparent text-c_B44242 border border-c_B44242`;
      case "promote-listing-blue":
        return `bg-transparent text-c_1C2F40 border border-c_1C2F40`;
      case "skip-now-btn":
        return `bg-transparent text-fs_16 font-general-semiBold font-semiBold border-none outline-none text-c_1F3B54 text-fs_14`;
      case "cancel-request-btn":
        return `bg-c_DDDDDD text-c_000000 border-none`;
      case "gold-btn":
        return `bg-c_9E7C4F text-white border-none`;
      case "unsold-btn":
        return `bg-c_FFFFFF border border-c_FF3333 !text-c_FF3333`;
      case "view-btn":
        return `bg-transparent text-fs_16 font-general-semiBold font-semiBold border-none outline-none text-c_1F3B54 text-fs_14 !w-fit`;
      case "draft-btn-disabled":
        return `bg-c_FFFFFF text-c_1F3D57 border border-c_1F3D57 opacity-60 cursor-not-allowed`;
      case "subscription-cancelled":
        return `bg-c_FF3333 text-c_FFFFFF !rounded-3xl border border-c_C30000 opacity-100 cursor-default`;
      default:
        return "";
    }
  };

  const mergedClasses = clsx(
    `w-full rounded-lg ${sizeClasses(size)} min-h-[49px] ${variantClasses(
      variant,
    )}`,
  );

  return (
    <button
      className={`outline-none w-[335px] max-w-[335px] ${mergedClasses} ${className}`}
      {...rest}
      disabled={isLoading || disabled}
      onClick={onClick}
    >
      {isLoading ? (
        <div role='status'>
          <Spinner color={spinnerColor} />
        </div>
      ) : (
        <div
          className={`${!!widthFull ? "w-full" : ""} ${
            !!rowReverse ? "!flex !flex-row-reverse" : "!flex !flex-row"
          } items-center ${
            !!widthFull ? "justify-between" : "justify-center"
          } items-center gap-x-1.5`}
        >
          {props?.changeLan && <img src={props?.changeLan} />}
          {!!image && <img src={image} alt={imgAlt} />}
          {Icon && <Icon color={iconColor} size={iconSize} />}
          {children}
          {props?.nextIcon && (
            <img
              src={props.nextIcon}
              className={`${isLangArabic ? "rotate-180" : "rotate-0"}`}
            />
          )}
        </div>
      )}
    </button>
  );
};

export default Button;
