import React, { useState } from "react";
import styles from "../style/Register.module.scss";
import { useNavigate } from "react-router-dom";

function Register() {
  const [userId, setUserId] = useState("");
  const [userPwd, setUserPwd] = useState("");
  const [userPwdRe, setUserPwdRe] = useState("");
  const [userName, setUserName] = useState("");
  const [userBirthY, setUserBirthY] = useState("");
  const [userBirthM, setUserBirthM] = useState("");
  const [userBirthD, setUserBirthD] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [dupIdChkError, setdDupIdChkError] = useState("");

  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleRegister = async () => {
    // 비어있는 항목 확인

    // 비밀번호 일치하는지 확인

    // id 중복확인 했는지 확인

    try {
      const response = await fetch("/sooz/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName, userId, userPwd, userPwdRe }),
      });

      if (!response.ok) {
        throw new Error("회원가입 실패");
      }

      const data = await response.json();
      console.log("회원가입 성공:", data);
      // 로그인 성공 후 처리
    } catch (e) {
      setRegisterError(e.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // 기본 폼 제출 방지
    handleRegister();
  };

  const checkDuplicate = async () => {
    console.log(`Checking for duplicate userId: ${userId}`);
    try {
      const response = await fetch("/sooz/dupIdChk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("아이디 중복 확인 실패");
      }

      const data = await response.json();
      console.log("아이디 중복 확인 성공 성공:", data);

      setdDupIdChkError(data.message);
      
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleLoginClick = () => {
    window.scrollTo(0, 0);
    navigate("/login");
  };

  return (
    <div className={styles.register}>
      <h1 style={{ textAlign: "center" }}>회원가입</h1>

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
            <button onClick={checkDuplicate}>중복확인</button>
            {dupIdChkError && <p style={{ color: "red" }}>{dupIdChkError}</p>}
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
          <div>
            <label htmlFor="userPwdRe">비밀번호 재확인</label>
            <input
              type="password"
              id="userPwdRe"
              value={userPwdRe}
              onChange={(e) => setUserPwdRe(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="userName">이름</label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="userBirthY">생년월일</label>
            <input
              type="text"
              id="userBirthY"
              value={userBirthY}
              placeholder="YYYY"
              onChange={(e) => setUserBirthY(e.target.value)}
              required
            />
            <input
              type="text"
              id="userBirthM"
              value={userBirthM}
              placeholder="MM"
              onChange={(e) => setUserBirthM(e.target.value)}
              required
            />
            <input
              type="text"
              id="userBirthD"
              value={userBirthD}
              placeholder="DD"
              onChange={(e) => setUserBirthD(e.target.value)}
              required
            />
          </div>
          <button type="submit">가입하기</button>
          {registerError && <p style={{ color: "red" }}>{registerError}</p>}
        </div>
      </form>
      <div>
        이미 계정이 있으신가요?{" "}
        <button onClick={handleLoginClick}>로그인</button>
      </div>
    </div>
  );
}

export default Register;
