import React from "react";
import "./style.css";
const TextArea = ({
  onChange,
  type,
  name,
  id,
  className,
  label,
  showImage,
  defaultValue,
}) => {
  return (
    <>
      <textarea
        onChange={(e) => {
          return onChange(e.target);
        }}
        type={type}
        name={name}
        id={id}
        defaultValue={defaultValue}
        className={
          className
            ? "MR_textarea_form_element " + className
            : "MR_textarea_form_element"
        }
      />
    </>
  );
};

export default TextArea;
