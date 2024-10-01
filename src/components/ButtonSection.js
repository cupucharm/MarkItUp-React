import React from "react";
import styles from "../style/ButtonSection.module.scss";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import ContentPasteOutlinedIcon from "@mui/icons-material/ContentPasteOutlined";

const ButtonSection = React.forwardRef((props, ref) => {
  return (
    <div ref={ref} className={styles.buttonContainer}>
      <button className={styles.button}>
        <div className={styles.iconTextContainer}>
          <FileDownloadOutlinedIcon style={{ marginRight: "5px" }} />
          Save as Markdown
        </div>
      </button>
      <button className={styles.button}>
        <div className={styles.iconTextContainer}>
          <ContentPasteOutlinedIcon style={{ marginRight: "5px" }} />
          Copy Markdown
        </div>
      </button>
    </div>
  );
});

export default ButtonSection;
