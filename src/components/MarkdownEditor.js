import React, { useState, useEffect, useMemo } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import styles from "../style/MarkdownEditor.module.scss";
import ConvertSection from "../components/ConvertSection";
import { stateToHTML } from "draft-js-export-html";
import TurndownService from "turndown";
import htmlToDraft from "html-to-draftjs";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

const MarkdownEditor = ({ onMarkdownChange }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [markdown, setMarkdown] = useState("");
  const [activeTab, setActiveTab] = useState("editor");

  const turndownService = useMemo(() => new TurndownService(), []);

  const handleEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  useEffect(() => {
    if (activeTab === "editor") {
      const contentState = editorState.getCurrentContent();
      const html = stateToHTML(contentState);
      const markdown = turndownService.turndown(html);
      setMarkdown(markdown);
      onMarkdownChange(markdown);
    } else if (activeTab === "markdown") {
      const markdown = editorState.getCurrentContent().getPlainText();
      setMarkdown(markdown);
    }
  }, [editorState, activeTab, onMarkdownChange, turndownService]);

  const handleTabChange = (tab) => {
    console.log("tab -> ", tab);
    setActiveTab(tab);
    if (tab === "markdown") {
      const contentState = editorState.getCurrentContent();
      const html = stateToHTML(contentState);
      const markdown = turndownService.turndown(html);
      setMarkdown(markdown);

      setEditorState(
        EditorState.createWithContent(ContentState.createFromText(markdown))
      );
    } else {
      remark()
        .use(remarkGfm)
        .use(remarkHtml)
        .process(markdown)
        .then((file) => {
          const html = String(file);
          const contentBlock = htmlToDraft(html);
          if (contentBlock) {
            const { contentBlocks, entityMap } = contentBlock;
            const newContentState = ContentState.createFromBlockArray(
              contentBlocks,
              entityMap
            );
            setEditorState(EditorState.createWithContent(newContentState));
          }
        });
    }
  };

  return (
    <div>
      <Editor
        editorState={editorState}
        wrapperClassName={styles.wrapper}
        editorClassName={styles.editor}
        onEditorStateChange={handleEditorStateChange}
      />
      <ConvertSection
        markdown={markdown}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    </div>
  );
};

export default MarkdownEditor;
