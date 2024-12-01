import React, { useEffect, useState } from "react";
import styles from "../style/RecentRecords.module.scss";
import headerStyles from "../style/Header.module.scss";

const RecentRecords = ({ isOpen }) => {
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const header = document.querySelector(`.${headerStyles.header}`);
    if (header) {
      setHeaderHeight(header.offsetHeight);
    }
  }, []);

  return (
    <div
      className={`${styles.slideMenu} ${isOpen ? styles.open : ""}`}
      style={{ top: headerHeight }}
    >
      <h2>최근 기록</h2>
      <ul>
        <li>기록 1</li>
        <li>기록 2</li>
        <li>기록 3</li>
      </ul>
    </div>
  );
};

export default RecentRecords;
