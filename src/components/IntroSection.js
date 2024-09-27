import React from "react";
import styles from "../style/IntroSection.module.scss";

const IntroSection = () => {
  return (
    <section className={styles.introSection}>
      <p className={styles.mainTitle}>MarkItUp</p>
      <p className={styles.subTitle}>convert to Markdown</p>
    </section>
  );
};

export default IntroSection;
