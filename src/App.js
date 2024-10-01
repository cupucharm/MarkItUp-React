import React from "react";
import "./style/Main.module.scss";
import MarkdownEditor from "./components/MarkdownEditor";
import Header from "./components/Header";
import IntroSection from "./components/IntroSection";
import ButtonSection from "./components/ButtonSection";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <Header />
      <IntroSection />
      <ButtonSection />
      <MarkdownEditor />
      <Footer />
    </div>
  );
}

export default App;
