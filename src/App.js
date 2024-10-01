import React, { useRef } from "react";
import "./style/Main.module.scss";
import MarkdownEditor from "./components/MarkdownEditor";
import Header from "./components/Header";
import IntroSection from "./components/IntroSection";
import ButtonSection from "./components/ButtonSection";
import Footer from "./components/Footer";

function App() {
  const buttonSectionRef = useRef(null);

  const handleConvertClick = () => {
    if (buttonSectionRef.current) {
      buttonSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="App">
      <Header onConvertClick={handleConvertClick} />
      <IntroSection />
      <ButtonSection ref={buttonSectionRef} />
      <MarkdownEditor />
      <Footer />
    </div>
  );
}

export default App;
