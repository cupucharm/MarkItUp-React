import React, { useEffect, useState } from "react";
import styles from "../style/RecentRecords.module.scss";
import headerStyles from "../style/Header.module.scss";

const RecentRecords = ({ isOpen, isLoggedIn }) => {
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
      <button
      // onClick={() => handleTabChange("editor")}
      >
        레퍼런스
      </button>
      <h2 style={{ paddingLeft: "3vh" }}>최근 기록</h2>
      {isLoggedIn ? (
        <p>로그인 성공 !</p>
      ) : (
        <p style={{ textAlign: "center" }}>로그인이 필요합니다.</p>
      )}
    </div>
  );
};

export default RecentRecords;
