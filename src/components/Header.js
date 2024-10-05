import React from "react";
import styles from "../style/Header.module.scss";
import MenuToggleButton from "./MenuToggleButton.js";

const Header = ({ onConvertClick, onToggleMenu, isScrolled }) => {
  return (
    <header
      className={`${styles.header} ${isScrolled ? styles.darkBackground : ""}`}
    >
      <MenuToggleButton onToggle={onToggleMenu} isScrolled={isScrolled} />
      <div
        className={`${styles.logo} ${
          isScrolled ? styles.whiteLogo : styles.blackLogo
        }`}
      >
        MIU
      </div>
      <div className={styles.buttonContainer}>
        <button
          className={`${styles.convertButton} ${
            isScrolled ? styles.whiteButton : ""
          }`}
          onClick={onConvertClick}
        >
          Convert
        </button>
        <button
          className={`${styles.headerButton} ${
            isScrolled ? styles.whiteButton : ""
          }`}
        >
          로그인
        </button>
        <button
          className={`${styles.headerButton} ${
            isScrolled ? styles.whiteButton : ""
          }`}
        >
          회원가입
        </button>
      </div>
    </header>
  );
};

export default Header;
