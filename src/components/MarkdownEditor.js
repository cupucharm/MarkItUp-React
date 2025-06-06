import React, { useState, useEffect, useMemo } from "react";
import { Editor } from "react-draft-wysiwyg";
import {
  EditorState,
  ContentState,
  convertToRaw,
  Modifier,
  getDefaultKeyBinding,
} from "draft-js";
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

    // 리스트 항목 처리
    service.addRule("listItems", {
      filter: ["ul", "ol"],
      replacement: (content, node) => {
        const items = Array.from(node.childNodes)
          .map((li) => {
            const text = li.textContent.trim();
            return node.nodeName === "UL" ? `* ${text}` : `1. ${text}`;
          })
          .join("\n");
        return `${items}\n`;
      },
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
    const currentContent = newEditorState.getCurrentContent();
    const currentBlock = currentContent.getBlockForKey(
      newEditorState.getSelection().getAnchorKey()
    );

    // 현재 블록의 타입을 확인하여 리스트 관련 명령어가 실행되었는지 확인
    if (
      currentBlock.getType() === "unordered-list-item" ||
      currentBlock.getType() === "ordered-list-item"
    ) {
      console.log("리스트가 활성화되었습니다.");
      // 추가적인 처리 로직
    }

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

  const handleTabChange = async (tab) => {
    setActiveTab(tab);

    // 이력 저장 api 호출

    // const response = await fetch("/sooz/saveWritingHistory", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   // body: JSON.stringify({ userId, markdownContent, htmlContent }),
    // });

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

    // <p> 태그를 제거하고 리스트 항목을 처리
    const blocks = newContentState
      .getBlocksAsArray()
      .map((block) => {
        if (block.getType() === "unstyled" && block.getText().trim() === "") {
          return null; // 빈 블록 제거
        }
        return block;
      })
      .filter(Boolean);

    return ContentState.createFromBlockArray(blocks, entityMap);
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

  const [isComposing, setIsComposing] = useState(false);

  const keyBindingFn = (event) => {
    if (isComposing) {
      return "not-handled"; // 조합 중에는 기본 동작을 방지
    }
    if (event.key === "Tab") {
      event.preventDefault();
      return "tab"; // Tab 키에 대한 커스텀 바인딩 반환
    }
    return getDefaultKeyBinding(event);
  };

  const handleKeyCommand = (command) => {
    console.log("handleKeyCommand>> ", command);

    if (command === "tab") {
      console.log("tab>> ");
      if (!isComposing) {
        const currentContent = editorState.getCurrentContent();
        const selection = editorState.getSelection();
        const currentBlockKey = selection.getAnchorKey();
        const currentBlock = currentContent.getBlockForKey(currentBlockKey);

        // 현재 블록이 리스트 아이템인지 확인
        if (
          currentBlock.getType() === "unordered-list-item" ||
          currentBlock.getType() === "ordered-list-item"
        ) {
          // 현재 깊이를 가져옴
          const currentDepth = currentBlock.getData().get("depth", 0);
          console.log("currentDepth>> ", currentDepth);

          // 깊이를 1 증가시킴
          const newContentState = Modifier.setBlockData(
            currentContent,
            selection,
            { depth: currentDepth + 1 }
          );

          const newEditorState = EditorState.push(
            editorState,
            newContentState,
            "change-block-data"
          );
          setEditorState(newEditorState);
          return "handled";
        } else {
          // 일반 텍스트일 경우 공백 삽입
          const contentState = Modifier.insertText(
            currentContent,
            selection,
            "    " // 4칸의 공백을 삽입
          );
          const newEditorState = EditorState.push(
            editorState,
            contentState,
            "insert-characters"
          );
          setEditorState(newEditorState);
          return "handled";
        }
      }
      return "not-handled"; // 조합 중일 경우 처리하지 않음
    }

    return "not-handled";
  };

  const handleCompositionStart = () => {
    console.log("handleCompositionStart");
    setIsComposing(true);
  };

  const handleCompositionEnd = (event) => {
    console.log("handleCompositionEnd", event);
    setIsComposing(false);
    // 입력이 끝난 후 상태 업데이트
    const newEditorState = EditorState.forceSelection(
      editorState,
      editorState.getSelection()
    );
    setEditorState(newEditorState);
  };

  return (
    <div>
      <Editor
        editorState={editorState}
        wrapperClassName={styles.wrapper}
        editorClassName={styles.editor}
        onEditorStateChange={handleEditorStateChange}
        keyBindingFn={keyBindingFn} // Tab 키 바인딩 추가
        handleKeyCommand={handleKeyCommand} // 키 명령 처리 추가
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        toolbar={{
          options: [
            "inline",
            "blockType",
            "fontSize",
            "fontFamily",
            "list",
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
          link: {
            inDropdown: false,
            showOpenOptionOnHover: true,
            defaultTargetOption: "_self",
            options: ["link", "unlink"],
          },
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
