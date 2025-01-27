import React, { useState } from "react";
import styles from "../style/findPassword.module.scss";
import { Alert } from "@mui/material";

function FindPassword() {
  const [userId, setUserId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // 기본 폼 제출 방지
    handleFindPwd();
  };

  const handleFindPwd = async () => {
    try {
      const response = await fetch("/sooz/findPwd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("비밀번호 찾기 실패 : ", response);
      }

      const data = await response.json();
      if (data.status === true) {
        console.log("비밀번호 찾기 성공:", data);
      } else {
        console.log("비밀번호 찾기 실패:", data);
      }
    } catch (error) {}
  };

  return (
    <div className={styles.FindPassword}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h1 style={{ textAlign: "center", color: "#3d72b4" }}>비밀번호 찾기</h1>
        <div className={styles.loginBox}></div>

        <button className={styles.findButton} type="submit">
          비밀번호 찾기
        </button>
      </form>
    </div>
  );
}

export default FindPassword;
