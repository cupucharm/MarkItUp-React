import React, { useRef, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./style/Main.module.scss";
import MarkdownEditor from "./components/MarkdownEditor";
import Header from "./components/Header";
import IntroSection from "./components/IntroSection";
import ButtonSection from "./components/ButtonSection";
import Footer from "./components/Footer";
import RecentRecords from "./components/RecentRecords";
import Login from "./components/Login";
import appStyles from "./style/App.module.scss";
import headerStyles from "./style/Header.module.scss";

function App() {
  const buttonSectionRef = useRef(null);
  const introSectionRef = useRef(null);
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
    const introSection = introSectionRef.current;
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
    <Router>
      <div className="App">
        <Header
          onConvertClick={handleConvertClick}
          onToggleMenu={onToggleMenu}
          isScrolled={isScrolled}
        />
        <div
          className={`${appStyles.content} ${
            isMenuOpen ? appStyles.shift : ""
          }`}
        >
          {isMenuOpen && <RecentRecords isOpen={isMenuOpen} />}
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <div ref={introSectionRef}>
                    <IntroSection />
                  </div>
                  <ButtonSection
                    ref={buttonSectionRef}
                    markdownContent={markdownContent}
                  />
                  <MarkdownEditor onMarkdownChange={handleMarkdownChange} />
                  <Footer />
                </>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/" />} />{" "}
            {/* 잘못된 경로 처리 */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
