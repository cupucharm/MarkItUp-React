import React from "react";
import styles from "../style/Footer.module.scss";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <hr className={styles.line} />
      <div className={styles.textContainer}>
        <p className={styles.designedBy}>Designed by cupucharm</p>
        <p className={styles.handle}>@sooz_ch</p>
      </div>
    </footer>
  );
};

export default Footer;
