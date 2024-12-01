import React, { useRef, useState, useEffect } from "react";
import "./style/Main.module.scss";
import MarkdownEditor from "./components/MarkdownEditor";
import Header from "./components/Header";
import IntroSection from "./components/IntroSection";
import ButtonSection from "./components/ButtonSection";
import Footer from "./components/Footer";
import RecentRecords from "./components/RecentRecords";
import appStyles from "./style/App.module.scss";
import headerStyles from "./style/Header.module.scss";
import introStyles from "./style/IntroSection.module.scss";

function App() {
  const buttonSectionRef = useRef(null);
  const [markdownContent, setMarkdownContent] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

      setIsScrolled(introSectionBottom < headerHeight);
    }
  };

  const onToggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="App">
      <Header
        onConvertClick={handleConvertClick}
        onToggleMenu={onToggleMenu}
        isScrolled={isScrolled}
      />
      <div
        className={`${appStyles.content} ${isMenuOpen ? appStyles.shift : ""}`}
      >
        {isMenuOpen && <RecentRecords isOpen={isMenuOpen} />}
        <IntroSection />
        <ButtonSection
          ref={buttonSectionRef}
          markdownContent={markdownContent}
        />
        <MarkdownEditor onMarkdownChange={handleMarkdownChange} />
        <Footer />
      </div>
    </div>
  );
}

export default App;
