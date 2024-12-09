import React from "react";
import styles from "../style/Header.module.scss";
import MenuToggleButton from "./MenuToggleButton.js";
import { useNavigate } from "react-router-dom";

const logo = process.env.PUBLIC_URL + "/images/logo.png";

const Header = ({ onConvertClick, onToggleMenu, isScrolled }) => {
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleLoginClick = () => {
    // 로그인 페이지로 이동
    window.scrollTo(0, 0);
    navigate("/login");
  };

  return (
    <header
      className={`${styles.header} ${isScrolled ? styles.darkBackground : ""}`}
    >
      <MenuToggleButton onToggle={onToggleMenu} isScrolled={isScrolled} />
      <div
        className={styles.logo}
        onClick={() => {
          window.scrollTo(0, 0);
          navigate("/");
        }}
      >
        <img
          src={logo}
          alt="로고"
          className={`${isScrolled ? styles.whiteLogo : styles.blackLogo}`}
        />
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
          onClick={handleLoginClick}
        >
          로그인
        </button>
        {/* <button
          className={`${styles.headerButton} ${
            isScrolled ? styles.whiteButton : ""
          }`}
        >
          회원가입
        </button> */}
      </div>
    </header>
  );
};

export default Header;
