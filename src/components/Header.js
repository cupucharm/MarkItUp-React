import React from "react";
import styles from "../style/Header.module.scss";

const Header = () => {
  return (
    <header className={styles.header}>
      <div>LOGO</div>
      <div className={styles.buttonContainer}>
        <button className={styles.headerButton}>로그인</button>
        <button className={styles.headerButton}>회원가입</button>
      </div>
    </header>
  );
};

export default Header;
