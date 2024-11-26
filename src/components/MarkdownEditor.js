import React, { useState, useEffect, useMemo } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import styles from "../style/MarkdownEditor.module.scss";
import ConvertSection from "../components/ConvertSection";
import { stateToHTML } from "draft-js-export-html";
import TurndownService from "turndown";
import htmlToDraft from "html-to-draftjs";
import draftToHtml from "draftjs-to-html";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

const MarkdownEditor = ({ onMarkdownChange }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [markdown, setMarkdown] = useState("");
  const [activeTab, setActiveTab] = useState("editor");

  const turndownService = useMemo(() => {
    const service = new TurndownService();

    // 폰트 색상 및 크기 규칙 추가
    service.addRule("fontColorAndSize", {
      filter: (node) =>
        node.nodeName === "SPAN" && (node.style.color || node.style.fontSize),
      replacement: (content, node) => {
        const color = rgbToHex(node.style.color);
        const sizeMapping = {
          "16px": "\\normalsize",
          "20px": "\\large",
          "24px": "\\Large",
          "28px": "\\LARGE",
          "32px": "\\huge",
        };
        const size = sizeMapping[node.style.fontSize] || "\\normalsize";

        return `$${size}{\\rm{\\color{${color}}{${content}}}}$`;
      },
    });

    // 밑줄 처리
    service.addRule("underline", {
      filter: "ins",
      replacement: (content) => `<ins>${content}</ins>`, // github 기준, 원래는 __밑줄__, 또는 <u></u>
    });

    // 취소선 처리
    service.addRule("strikethrough", {
      filter: "del",
      replacement: (content) => `~~${content}~~`,
    });

    // 코드 블록 처리
    service.addRule("codeBlock", {
      filter: "pre",
      replacement: (content) => `\`\`\`\n${content}\n\`\`\``,
    });

    return service;
  }, []);

  // RGB를 HEX로 변환하는 함수
  const rgbToHex = (rgb) => {
    const result = rgb.match(/\d+/g);
    if (!result) return "000000";
    const hex = result.map((x) => {
      const hexValue = parseInt(x).toString(16);
      return hexValue.length === 1 ? "0" + hexValue : hexValue;
    });
    return `#${hex.join("")}`;
  };

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
    setActiveTab(tab);
    if (tab === "markdown") {
      const contentState = editorState.getCurrentContent();
      const html = draftToHtml(convertToRaw(contentState));
      const markdown = turndownService.turndown(html);
      setMarkdown(markdown);

      console.log("html >>", html);
      console.log("markdown >> ", markdown);
      setEditorState(
        EditorState.createWithContent(ContentState.createFromText(markdown))
      );
    } else {
      const markdown = editorState.getCurrentContent().getPlainText();
      const html = markdownToHtml(markdown);
      // Markdown에서 HTML로 변환할 때 LaTeX 스타일 제거
      const cleanHtml = convertLatexToHtml(html);

      console.log("markdown >> ", markdown);
      console.log("html >>", html);
      console.log("cleanHtml >>", cleanHtml);

      const newContentState = htmlToDraftWithStyles(cleanHtml);
      if (newContentState) {
        setEditorState(EditorState.createWithContent(newContentState));
      }
    }
  };

  // Markdown을 HTML로 변환하는 함수
  const markdownToHtml = (markdown) => {
    const processed = remark()
      .use(remarkGfm)
      .use(remarkHtml, {
        sanitize: false, // HTML 태그를 허용
      })
      .processSync(markdown)
      .toString();

    return processed;
  };

  // HTML에서 ContentState로 변환할 때 규칙 추가
  const htmlToDraftWithStyles = (html) => {
    const contentBlock = htmlToDraft(html);
    if (!contentBlock) return null;

    const { contentBlocks, entityMap } = contentBlock;
    const newContentState = ContentState.createFromBlockArray(
      contentBlocks,
      entityMap
    );

    // 이미지 엔티티를 처리하는 로직 추가
    const blocks = newContentState.getBlocksAsArray();
    blocks.forEach((block) => {
      const entityKey = block.getEntity();
      if (entityKey) {
        const entity = newContentState.getEntity(entityKey);
        if (entity.getType() === "IMAGE") {
          const { src } = entity.getData();
          block.setData({ src });
        }
      }
    });

    return newContentState;
  };

  // LaTeX 스타일을 HTML의 span으로 변환하는 함수
  const convertLatexToHtml = (html) => {
    return html.replace(
      /\$\\(\w+)\{(?:\\rm\{)?\\color\{(.*?)\}\{(.*?)\}\}\}\$/g,
      (match, size, color, content) => {
        const rgbColor = hexToRgb(color);
        return `<span style="color: rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b});">${content}</span>`;
      }
    );
  };

  // HEX 색상을 RGB로 변환하는 함수
  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.replace("#", ""), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return { r, g, b };
  };

  const handleImageUpload = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({ data: { link: reader.result } });
      };
      reader.onerror = () => {
        reject(new Error("Image upload failed"));
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div>
      <Editor
        editorState={editorState}
        wrapperClassName={styles.wrapper}
        editorClassName={styles.editor}
        onEditorStateChange={handleEditorStateChange}
        // localization={{
        //   locale: "ko",
        // }}
        toolbar={{
          options: [
            "inline",
            "blockType",
            "fontSize",
            "fontFamily",
            "list",
            "textAlign",
            "colorPicker",
            "link",
            "emoji",
            "image",
            "history",
          ],
          image: {
            uploadEnabled: true,
            uploadCallback: handleImageUpload, // 이미지 업로드 핸들러 연결
            previewImage: true,
            inputAccept: "image/gif,image/jpeg,image/jpg,image/png,image/svg",
          },
          inline: {
            inDropdown: false,
            className: undefined,
            component: undefined,
            dropdownClassName: undefined,
            options: ["bold", "italic", "underline", "strikethrough"],
          },
          blockType: {
            inDropdown: true,
            options: [
              "Normal",
              "H1",
              "H2",
              "H3",
              "H4",
              "H5",
              "H6",
              "Blockquote",
              "Code",
              "HorizontalRule",
            ],
          },
          fontSize: {
            options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
          },
          fontFamily: {
            options: [
              "Arial",
              "Georgia",
              "Impact",
              "Tahoma",
              "Times New Roman",
              "Verdana",
            ],
          },
          list: {
            inDropdown: false,
            options: ["unordered", "ordered", "indent", "outdent"],
          },
          textAlign: {
            inDropdown: false,
            options: ["left", "center", "right", "justify"],
          },
          link: {
            inDropdown: false,
            showOpenOptionOnHover: true,
            defaultTargetOption: "_self",
            options: ["link", "unlink"],
          },
          // image: {
          //   urlEnabled: true,
          //   uploadEnabled: true,
          //   alignmentEnabled: true,
          //   previewImage: false,
          //   inputAccept: "image/gif,image/jpeg,image/jpg,image/png,image/svg",
          //   alt: { present: false, mandatory: false },
          //   defaultSize: {
          //     height: "auto",
          //     width: "auto",
          //   },
          // },
          history: {
            inDropdown: false,
            options: ["undo", "redo"],
          },
        }}
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
