import React, { useRef, useState, useEffect, useCallback } from "react";
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
import Register from "./components/Register";
import appStyles from "./style/App.module.scss";
import headerStyles from "./style/Header.module.scss";
import { useAuth } from "./hooks/useAuth";
import FindPassword from "./components/findPassword";

function App() {
  const buttonSectionRef = useRef(null);
  const introSectionRef = useRef(null);
  const [markdownContent, setMarkdownContent] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    isLoggedIn,
    userId,
    setIsLoggedIn,
    handleLoginSuccess,
    handleLogout,
  } = useAuth();

  const handleConvertClick = () => {
    if (
      window.location.pathname === "/login" ||
      window.location.pathname === "/register"
    ) {
      window.location.href = "/";
    } else {
      window.scrollTo({
        top:
          buttonSectionRef.current.getBoundingClientRect().top +
          window.scrollY -
          document.querySelector(`.${headerStyles.header}`).offsetHeight,
        behavior: "smooth",
      });
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

  const checkLoginStatus = useCallback(async () => {
    try {
      const response = await fetch("/sooz/checkLoginSessionYn");
      if (response.ok) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("로그인 상태 확인 중 오류 발생:", error);
      setIsLoggedIn(false);
    }
  }, [setIsLoggedIn]);

  useEffect(() => {
    checkLoginStatus();

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [checkLoginStatus]);

  const renderRoute = (isLoggedIn, Component, onLoginSuccess) => {
    return isLoggedIn ? (
      <Navigate to="/" />
    ) : (
      <Component onLoginSuccess={onLoginSuccess} />
    );
  };

  return (
    <Router>
      <div className="App">
        <Header
          onConvertClick={handleConvertClick}
          onToggleMenu={onToggleMenu}
          isScrolled={isScrolled}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
        />
        <div
          className={`${appStyles.content} ${
            isMenuOpen ? appStyles.shift : ""
          }`}
        >
          {isMenuOpen && (
            <RecentRecords isOpen={isMenuOpen} isLoggedIn={isLoggedIn} />
          )}
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
                </>
              }
            />

            <Route
              path="/login"
              element={renderRoute(isLoggedIn, Login, handleLoginSuccess)}
            />
            <Route
              path="/register"
              element={renderRoute(isLoggedIn, Register)}
            />
            <Route
              path="/findPassword"
              element={renderRoute(isLoggedIn, FindPassword)}
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
