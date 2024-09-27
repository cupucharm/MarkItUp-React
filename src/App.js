import React from "react";
import "./style/Main.module.scss";
import MarkdownEditor from "./components/MarkdownEditor";
import Header from "./components/Header";
import IntroSection from "./components/IntroSection";
import ButtonSection from "./components/ButtonSection";

function App() {
  return (
    <div className="App">
      <Header />
      <IntroSection />
      <ButtonSection />
      <MarkdownEditor />
    </div>
  );
}

export default App;
