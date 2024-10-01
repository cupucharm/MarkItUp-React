import React, { useState, useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import styles from "../style/MarkdownEditor.module.scss";
import ConvertSection from "../components/ConvertSection";
import { stateToHTML } from "draft-js-export-html";
import { convert } from "html-to-markdown";

const MarkdownEditor = ({ onMarkdownChange }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [markdown, setMarkdown] = useState("");

  const handleEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  useEffect(() => {
    const contentState = editorState.getCurrentContent();
    const html = stateToHTML(contentState);
    const markdown = convert(html);
    setMarkdown(markdown);
    onMarkdownChange(markdown); // 마크다운 내용을 부모 컴포넌트에 전달
  }, [editorState, onMarkdownChange]);

  return (
    <div>
      <Editor
        editorState={editorState}
        wrapperClassName={styles.wrapper}
        editorClassName={styles.editor}
        onEditorStateChange={handleEditorStateChange}
      />
      <ConvertSection markdown={markdown} />
    </div>
  );
};

export default MarkdownEditor;
