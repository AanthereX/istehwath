/** @format */

import { Icons } from "../../../assets/icons";
import { useSelector } from "react-redux";

const FileAddComponent = ({ onChange, fileRef, error, errorText }) => {
  const handleFileUpload = (e) => {
    onChange(e.target.files[0]);
  };
  const Labels = useSelector((state) => state?.Language?.labels);
  const { uploadIcon } = Icons;
  return (
    <div className='flex flex-col items-start justify-start'>
      <div
        className={`flex flex-col justify-center bg-white items-center rounded-xl relative h-32 gap-y-4 ${
          Boolean(error)
            ? "border-[3px] border-dotted border-c_FF3333"
            : "border-[3px] border-dotted border-c_9A9A9A"
        } min-w-[350px] max-w-[350px]`}
      >
        <img src={uploadIcon} alt='uplaodicon' className='h-6 w-6' />
        <p className='text-c_181818 font-general_regular font-normal text-fs_12'>
          {Labels.dragAndDropOr}{" "}
          <span className='text-c_0D6DDE'>{Labels.chooseFile}</span>{" "}
          {Labels.toUpload}
        </p>
        <input
          type={"file"}
          ref={fileRef}
          accept={".pdf,.doc,.docx"}
          onChange={(e) => handleFileUpload(e)}
          className='min-w-[350px] max-w-[350px] rounded-xl h-40 absolute top-0 left-0 cursor-pointer opacity-0 bg-c_fff/5'
        />
      </div>
      {error && (
        <span className='text-c_FF3333 text-fs_12 block font-general_regular font-normal mt-2'>
          {errorText}
        </span>
      )}
    </div>
  );
};

export default FileAddComponent;
