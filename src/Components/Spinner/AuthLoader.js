/** @format */

import { Fragment } from "react";
import { Oval } from "react-loader-spinner";

const Spinner = ({ color }) => {
  return (
    <Fragment>
      <div>
        <Oval
          wrapperClass='flex justify-center items-center'
          strokeWidth={5}
          height={30}
          width={30}
          color={color}
          secondaryColor={color}
        />
      </div>
    </Fragment>
  );
};

export default Spinner;
