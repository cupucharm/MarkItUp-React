import React from "react";
import styles from "../style/Footer.module.scss";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <hr className={styles.line} />
      <div className={styles.textContainer}>
        <p className={styles.designedBy}>Designed by sooz_ch</p>
        <p className={styles.handle}>@cupucharm</p>
      </div>
    </footer>
  );
};

export default Footer;
