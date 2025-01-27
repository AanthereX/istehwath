import React, { useRef, useState, memo, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { Button, SelectInput } from "../Components/FormComponents";
import { Icons } from "../assets/icons";
import { useNavigate } from "react-router-dom";

const FilterModal = ({
  filterModalOpen = false,
  setFilterModalOpen = () => {},
}) => {
  const { crossIcon } = Icons;
  const cancelButtonRef = useRef(null);
  const Labels = useSelector((state) => state?.Language?.labels);
  const navigate = useNavigate();
  const [values, setValues] = useState({
    filter: "",
  });

  return (
    <React.Fragment>
      <Transition.Root show={filterModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setFilterModalOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-c_121516/80 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative w-fit modaal_box transform overflow-hidden bg-c_FFFFFF text-left transition-all sm:my-8">
                  <div className="bg-c_FFFFFF py-4 px-4">
                    <div className="relative">
                      <img
                        src={crossIcon}
                        className="absolute h-3 w-3 top-0 right-0 cursor-pointer"
                        onClick={() => setFilterModalOpen(false)}
                      />
                    </div>
                    <p className="md:my-6 w-fit text-center text-c_000000 text-fs_36 font-general_semiBold font-semibold">
                      {Labels.filter}
                    </p>
                    <div className="w-fit flex flex-col mt-4">
                      <div className="flex flex-col">
                        <label
                          className={
                            "text-fs_16 text-c_000000 font-medium font-general_medium"
                          }
                        >
                          {Labels.businessType}
                        </label>
                        <SelectInput
                          placeholder={"Select"}
                          className="w-[350px] min-w-[350px]"
                        />
                      </div>
                      <div className="flex flex-col gap-y-2">
                        <label
                          className={
                            "text-fs_16 text-c_000000 font-medium font-general_medium"
                          }
                        >
                          {Labels.location}
                        </label>
                        <SelectInput
                          placeholder={"Search Location"}
                          className="w-[350px] min-w-[350px]"
                        />
                      </div>
                    </div>

                    <div className="w-fit md:py-6 pt-2 pb-2.5 px-0">
                      <div className="flex justify-center md:flex-row flex-col">
                        <div className="">
                          <Button
                            variant="secondary"
                            className="min-w-[169px]"
                            onClick={() => setFilterModalOpen(false)}
                          >
                            {Labels.clear}
                          </Button>
                        </div>
                        <div className="">
                          <Button
                            // onClick={() => navigate("#")}
                            className="min-w-[169px]"
                          >
                            {Labels.apply}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </React.Fragment>
  );
};

export default memo(FilterModal);
