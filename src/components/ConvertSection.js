import React from "react";
import styles from "../style/ConvertSection.module.scss";

const ConvertSection = ({ markdown, activeTab, onTabChange }) => {

  const handleTabChange = (tab) => {
    if (activeTab !== tab) {
      onTabChange(tab);
    }
  };

  return (
    <div className={styles.convertSection}>
      <div className={styles.tabContainer}>
        <button
          className={`${styles.tab} ${
            activeTab === "editor" ? styles.active : ""
          }`}
          onClick={() => handleTabChange("editor")}
        >
          Editor
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "markdown" ? styles.active : ""
          }`}
          onClick={() => handleTabChange("markdown")}
        >
          Markdown
        </button>
      </div>
    </div>
  );
};

export default ConvertSection;
