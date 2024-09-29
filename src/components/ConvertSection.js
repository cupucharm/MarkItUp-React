import React, { useState } from "react";
import styles from "../style/ConvertSection.module.scss";

const ConvertSection = ({ onConvertToMarkdown }) => {
  const [activeTab, setActiveTab] = useState("editor");

  return (
    <div className={styles.convertSection}>
      <div className={styles.tabContainer}>
        <button
          className={`${styles.tab} ${
            activeTab === "editor" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("editor")}
        >
          Editor
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "markdown" ? styles.active : ""
          }`}
          onClick={() => {
            setActiveTab("markdown");
            onConvertToMarkdown(); // Markdown 변환 함수 호출
          }}
        >
          Markdown
        </button>
      </div>
    </div>
  );
};

export default ConvertSection;
