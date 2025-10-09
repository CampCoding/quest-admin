import React from "react";
import { UserIcon } from "../../assets/svgIcons";
import "./style.css";
import { userData } from "../../data/fake_login_data";
const ProfileMenu = () => {
  return (
    <div className="profile_menu">
      <div className="userLogo">{UserIcon}</div>
      <div className="userData">
        <span className="name">{userData?.name}</span>
        <span className="email">{userData?.email}</span>
      </div>
    </div>
  );
};

export default ProfileMenu;
