import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import styles from "../style/MarkdownEditor.module.scss";
import ConvertSection from "../components/ConvertSection";
import { stateToHTML } from "draft-js-export-html";
import { convert } from "html-to-markdown";

const MarkdownEditor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const handleEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const contentState = editorState.getCurrentContent();
  const html = stateToHTML(contentState);
  const markdown = convert(html);

  const handleConvertToMarkdown = () => {
    console.log(markdown);
  };

  return (
    <div>
      <Editor
        editorState={editorState}
        wrapperClassName={styles.wrapper}
        editorClassName={styles.editor}
        onEditorStateChange={handleEditorStateChange}
      />
      <ConvertSection onConvertToMarkdown={handleConvertToMarkdown} />
    </div>
  );
};

export default MarkdownEditor;
