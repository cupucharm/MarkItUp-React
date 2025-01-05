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
import Register from "./components/Register";
import appStyles from "./style/App.module.scss";
import headerStyles from "./style/Header.module.scss";
import ApiTest from "./ApiTest";

function App() {
  const buttonSectionRef = useRef(null);
  const introSectionRef = useRef(null);
  const [markdownContent, setMarkdownContent] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 추가

  const handleConvertClick = () => {
    if (
      window.location.pathname === "/login" ||
      window.location.pathname === "/register"
    ) {
      window.location.href = "/";
    } else {
      // / 페이지에서 클릭한 경우
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

  const handleLoginSuccess = () => {
    setIsLoggedIn(true); // 로그인 성공 시 상태 업데이트
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/sooz/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("로그아웃 실패");
      }

      const data = await response.json();
      if (data.status === true) {
        console.log("로그아웃 성공:", data);
        setIsLoggedIn(false);
      } else {
        console.log("로그아웃 실패:", data);
        alert(data.message);
      }
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
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
          isLoggedIn={isLoggedIn} // 로그인 상태 전달
          onLogout={handleLogout} // 로그아웃 핸들러 전달
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
                </>
              }
            />
            <Route
              path="/login"
              element={<Login onLoginSuccess={handleLoginSuccess} />}
            />
            <Route path="/register" element={<Register />} />
            <Route path="/sooz/apiTest" element={<ApiTest />}></Route>
            <Route path="*" element={<Navigate to="/" />} />{" "}
            {/* 잘못된 경로 처리 */}
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
