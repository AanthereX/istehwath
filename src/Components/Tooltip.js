/** @format */

import { Fragment } from "react";
import { Tooltip } from "react-tooltip";

const ToolTip = ({
  tooltip_id,
  className,
  children,
  place = "top",
  style = {},
}) => {
  return (
    <Fragment>
      <Tooltip
        opacity={1}
        place={place}
        id={tooltip_id}
        style={style}
        className={`flex items-center justify-center !bg-c_CCCCCC !shadow-md !text-black !rounded-[6px] ${className}`}
      >
        {children}
      </Tooltip>
    </Fragment>
  );
};

export default ToolTip;
