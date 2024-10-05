import React, { useRef, useState, useEffect } from "react";
import "./style/Main.module.scss";
import MarkdownEditor from "./components/MarkdownEditor";
import Header from "./components/Header";
import IntroSection from "./components/IntroSection";
import ButtonSection from "./components/ButtonSection";
import Footer from "./components/Footer";
import headerStyles from "./style/Header.module.scss";
import introStyles from "./style/IntroSection.module.scss";

function App() {
  const buttonSectionRef = useRef(null);
  const [markdownContent, setMarkdownContent] = useState("");
  const [isScrolled, setIsScrolled] = useState(false); // 스크롤 여부 상태

  const handleConvertClick = () => {
    if (buttonSectionRef.current) {
      const headerHeight = document.querySelector(
        `.${headerStyles.header}`
      ).offsetHeight;
      const targetPosition =
        buttonSectionRef.current.getBoundingClientRect().top +
        window.scrollY -
        headerHeight;
      window.scrollTo({ top: targetPosition, behavior: "smooth" });
    }
  };

  const handleMarkdownChange = (markdown) => {
    setMarkdownContent(markdown);
  };

  const handleScroll = () => {
    const introSection = document.querySelector(`.${introStyles.introSection}`);
    if (introSection) {
      const introSectionBottom = introSection.getBoundingClientRect().bottom;
      const headerHeight = document.querySelector(
        `.${headerStyles.header}`
      ).offsetHeight;

      // 헤더가 introsection을 지나면
      setIsScrolled(introSectionBottom < headerHeight);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="App">
      <Header onConvertClick={handleConvertClick} isScrolled={isScrolled} />
      <IntroSection />
      <ButtonSection ref={buttonSectionRef} markdownContent={markdownContent} />
      <MarkdownEditor onMarkdownChange={handleMarkdownChange} />
      <Footer />
    </div>
  );
}

export default App;
