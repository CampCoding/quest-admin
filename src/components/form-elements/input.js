import React, { useRef, useState } from "react";
import "./style.css";
const Input = ({
  onChange,
  type,
  name,
  id,
  className,
  style,
  showImage,
  defaultValue,
  disabled,
  required,
  onClick,
}) => {
  const fileRef = useRef();
  const [imageLink, setImageLink] = useState(false);
  const getImageFile = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        return setImageLink(reader.result);
      };
    } else {
      setImageLink(false);
    }
  };
  return (
    <>
      <input
        defaultValue={defaultValue}
        disabled={disabled}
        required={required}
        onClick={(e) => {
          if (onClick) onClick(e);
        }}
        onChange={(e) => {
          onChange(e.target);

          return type === "file"
            ? getImageFile(e.target.files[0])
            : onChange(e.target);
        }}
        type={type}
        name={name}
        style={style}
        ref={type === "file" ? fileRef : null}
        id={id}
        multiple={true}
        accept={
          type === "file" && showImage ? "image/png, image/gif, image/jpeg" : ""
        }
        className={
          className
            ? "MR_input_form_element " + className
            : "MR_input_form_element"
        }
      />
      {imageLink && showImage ? (
        <div className="image">
          <img src={imageLink} className="fileUploadedImage" alt="" />
          <div
            className="close_btn"
            onClick={() => {
              setImageLink(false);
              fileRef.current.value = '';
            }}
            style={{ cursor: "pointer" }}
          >
            <img
              src="https://res.cloudinary.com/duovxefh6/image/upload/v1693603266/close_bphmao.png"
              alt=""
              width={"24px"}
            />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Input;
