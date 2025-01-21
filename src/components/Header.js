import React from "react";
import styles from "../style/Header.module.scss";
import MenuToggleButton from "./MenuToggleButton.js";
import { useNavigate } from "react-router-dom";

const logo = process.env.PUBLIC_URL + "/images/logo.png";
const logoW = process.env.PUBLIC_URL + "/images/logoW.png";

const Header = ({
  onConvertClick,
  onToggleMenu,
  isScrolled,
  isLoggedIn,
  onLogout,
}) => {
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleLoginClick = () => {
    // 로그인 페이지로 이동
    window.scrollTo(0, 0);
    navigate("/login");
  };

  const handleRegisterClick = () => {
    // 회원가입 페이지로 이동
    window.scrollTo(0, 0);
    navigate("/register");
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
        {isScrolled ? (
          <img src={logoW} alt="로고" />
        ) : (
          <img src={logo} alt="로고" />
        )}

        {/* markitup */}
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
        {isLoggedIn ? (
          <button
            className={`${styles.headerButton} ${
              isScrolled ? styles.whiteButton : ""
            }`}
            onClick={onLogout}
          >
            로그아웃
          </button>
        ) : (
          <>
            <button
              className={`${styles.headerButton} ${
                isScrolled ? styles.whiteButton : ""
              }`}
              onClick={handleLoginClick}
            >
              로그인
            </button>
            <button
              className={`${styles.headerButton} ${
                isScrolled ? styles.whiteButton : ""
              }`}
              onClick={handleRegisterClick}
            >
              회원가입
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
