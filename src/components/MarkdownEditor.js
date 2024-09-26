import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const MarkdownEditor = () => {
  const [editorHtml, setEditorHtml] = useState("");

  const handleEditorChange = (html) => {
    setEditorHtml(html);
  };

  return (
    <div className="editor-container">
      <div className="quill-editor">
        <ReactQuill value={editorHtml} onChange={handleEditorChange} />
      </div>
    </div>
  );
};

export default MarkdownEditor;
