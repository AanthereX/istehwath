import { Fragment } from "react";
import TextAreaWithCount from "../../FormComponents/TextAreaWithCount";
import StartupInput from "../../FormComponents/StartupInput";
import { SelectInput } from "../../FormComponents";
import { FileAddComponent } from "../../FormComponents";

const ComponentRenderer = ({ type, placeholder }) => {
  const render = (type) => {
    switch (type) {
      case "input":
        return <StartupInput type={type} placeholder={placeholder} />;
      case "file":
        return <FileAddComponent type={type} />;
      case "textarea":
        return <TextAreaWithCount type={type} rows={2} maxChar={100} />;
      case "select":
        return <SelectInput type={type} />;
      default:
        return <StartupInput type={type} rows={2} maxChar={100} />;
    }
  };

  return <Fragment>{render()}</Fragment>;
};

export default ComponentRenderer;
