import React, { useState } from "react";
import styles from "../style/Login.module.scss";
import { useNavigate } from "react-router-dom";

function Login() {
  const [userId, setUserId] = useState("");
  const [userPwd, setUserPwd] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const loginSuccess = () => {
    window.scrollTo(0, 0);
    navigate("/");
  };

  const handleLogin = async () => {
    // 아이디와 비밀번호가 입력되었는지 확인
    if (!userId) {
      setError("아이디를 입력해 주세요.");
      return;
    }

    if (!userPwd) {
      setError("비밀번호를 입력해 주세요.");
      return;
    }

    try {
      const response = await fetch("/sooz/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, userPwd }),
      });

      if (!response.ok) {
        throw new Error("로그인 실패 : ", response);
      }

      const data = await response.json();
      if (data.status === true) {
        console.log("로그인 성공:", data);
        setError("");
        loginSuccess();
      } else {
        console.log("로그인 실패:", data);
        setError(data.message);
      }

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
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <div className={styles.loginBox}>
          <div>
            <input
              type="text"
              id="userId"
              placeholder="아이디"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              // required
              className={styles.inputField}
            />
          </div>

          <div>
            <input
              type="password"
              id="userPwd"
              placeholder="비밀번호"
              value={userPwd}
              onChange={(e) => setUserPwd(e.target.value)}
              // required
              className={styles.inputField}
            />
          </div>
        </div>
        {error && <p style={{ color: "red", fontSize: "0.8em" }}>{error}</p>}

        <button className={styles.loginButton} type="submit">
          로그인
        </button>
      </form>
    </div>
  );
}

export default Login;
