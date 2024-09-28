import React from "react";
import "./style/Main.module.scss";
import MarkdownEditor from "./components/MarkdownEditor";
import Header from "./components/Header";
import IntroSection from "./components/IntroSection";
import ButtonSection from "./components/ButtonSection";
import ConvertSection from "./components/ConvertSection";

function App() {
  return (
    <div className="App">
      <Header />
      <IntroSection />
      <ButtonSection />
      <MarkdownEditor />
      <ConvertSection />
    </div>
  );
}

export default App;
