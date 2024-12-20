import React, { useState } from "react";
import styles from "../style/Login.module.scss";

function Login() {
  const [userId, setUserId] = useState("");
  const [userPwd, setUserPwd] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("/sooz/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, userPwd }),
      });

      if (!response.ok) {
        throw new Error("로그인 실패");
      }

      const data = await response.json();
      console.log("로그인 성공:", data);
      // 로그인 성공 후 처리
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // 기본 폼 제출 방지
    handleLogin();
  };

  return (
    <div className={styles.login}>
      <h1 style={{ textAlign: "center" }}>로그인</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <div>
            <label htmlFor="userId">아이디</label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="userPwd">비밀번호</label>
            <input
              type="password"
              id="userPwd"
              value={userPwd}
              onChange={(e) => setUserPwd(e.target.value)}
              required
            />
          </div>
          <button type="submit">로그인</button>
        </div>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Login;
