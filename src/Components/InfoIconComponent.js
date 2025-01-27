/**
 * eslint-disable react/prop-types
 *
 * @format
 */

import { Fragment } from "react";
import { Icons } from "../assets/icons";
import ToolTip from "./Tooltip";
import { Labels } from "../locale";

const IconInfoComponent = ({
  uniqueId = "",
  className,
  marginTop = true,
  tooltipDescription = "",
  showInfoIconModal = false,
  setShowInfoIconModal = () => {},
}) => {
  const { infoIconBlack } = Icons;

  return (
    <Fragment>
      <button onClick={() => setShowInfoIconModal(true)}>
        <img
          src={infoIconBlack}
          alt={"infoicon"}
          className={`!h-6 !w-6 !p-0 ${
            marginTop ? "-mt-1.5" : "mt-0"
          } cursor-pointer`}
        />
      </button>
      {/* <ToolTip place={"left"} tooltip_id={uniqueId} className={className}>
        <div>
          <span className='font-general_regular text-fs_16'>
            {tooltipDescription || Labels.notAvailable}
          </span>
        </div>
      </ToolTip> */}
    </Fragment>
  );
};

export default IconInfoComponent;
