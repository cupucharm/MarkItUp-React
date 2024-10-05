import React from "react";
import styles from "../style/MenuToggleButton.module.scss";
import MenuIcon from "@mui/icons-material/Menu";

const MenuToggleButton = ({ onToggle, isScrolled }) => {
  return (
    <button
      className={`${styles.toggleButton} ${
        isScrolled ? styles.whiteButton : ""
      }`}
      onClick={onToggle}
    >
      <MenuIcon />
    </button>
  );
};

export default MenuToggleButton;
