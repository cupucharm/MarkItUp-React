import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styles from "../style/MarkdownEditor.module.scss";

const MarkdownEditor = () => {
  const [editorHtml, setEditorHtml] = useState("");

  const handleEditorChange = (html) => {
    setEditorHtml(html);
  };

  return (
    <div className={styles.editorContainer}>
      <div className={styles.quillEditor}>
        <ReactQuill
          style={{ height: "600px" }}
          value={editorHtml}
          onChange={handleEditorChange}
        />
      </div>
    </div>
  );
};

export default MarkdownEditor;
