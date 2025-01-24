import React, { useState } from "react";
import styles from "../style/Register.module.scss";
import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";

function Register() {
  const [userId, setUserId] = useState("");
  const [userPwd, setUserPwd] = useState("");
  const [userPwdRe, setUserPwdRe] = useState("");
  const [userName, setUserName] = useState("");
  const [userBirthY, setUserBirthY] = useState("");
  const [userBirthM, setUserBirthM] = useState("");
  const [userBirthD, setUserBirthD] = useState("");

  const [registerError, setRegisterError] = useState("");

  const [idChkMsg, setIdChkMsg] = useState("");
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [pwdChkMsg, setPwdChkMsg] = useState("");
  const [isPwdChecked, setIsPwdChecked] = useState(false);

  const navigate = useNavigate();

  const userIdRegEx = /^[A-Za-z0-9]{4,20}$/; // 아이디 정규식
  const passwordRegEx =
    /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+[\]{};':"\\|,.<>?]{8,20}$/; // 비밀번호 정규식

  const userIdCheck = (userId) => {
    if (userId.match(userIdRegEx) === null) {
      return false;
    } else {
      return true;
    }
  };

  // 비밀번호 형식 / 비밀번호 확인 일치 여부 확인
  const passwordCheck = (password) => {
    const pwdMessage = {
      format: "비밀번호 형식을 확인해주세요.",
      mismatch: "비밀번호가 일치하지 않습니다.",
      success: "비밀번호가 일치합니다.",
    };

    const validatePasswordFormat = () => {
      return !password.match(passwordRegEx) ? pwdMessage.format : false;
    };

    const validatePasswordMatch = () => {
      return userPwd !== userPwdRe ? pwdMessage.mismatch : false;
    };

    let error;
    if (userPwd && userPwdRe) {
      error = validatePasswordFormat() || validatePasswordMatch();
    } else {
      setPwdChkMsg("");
      setIsPwdChecked(false);
      return;
    }

    if (error) {
      setPwdChkMsg(error);
      setIsPwdChecked(false);
      return error;
    } else {
      setPwdChkMsg(pwdMessage.success);
      setIsPwdChecked(true);
      return pwdMessage.success;
    }
  };

  const handleRegister = async () => {
    // 비어있는 항목 확인
    if (!checkEmptyField()) return;

    // 아이디 형식 체크
    if (!userIdCheck(userId)) {
      setRegisterError("아이디 형식이 올바르지 않습니다.");
      return;
    }

    // 비밀번호 형식, 일치 여부 체크
    if (!passwordCheck(userPwd)) {
      setRegisterError("비밀번호 형식이 올바르지 않습니다.");
      return;
    }

    // id 중복확인 했는지 확인
    if (!isIdChecked) {
      setRegisterError("아이디 중복을 확인해 주세요.");
      return;
    }

    try {
      const response = await fetch("/sooz/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName,
          userId,
          userPwd,
          userBirthY,
          userBirthM,
          userBirthD,
        }),
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

  // 아이디 비어있는지 확인
  const isIdEmptyChk = () => {
    if (!userId) {
      setIdChkMsg("아이디를 입력해 주세요.");
      setIsIdChecked(false);
      return false;
    }
    return true;
  };

  const checkEmptyField = () => {
    // 비어있는 항목 확인
    if (!isIdEmptyChk()) {
      return;
    }

    if (!userPwd) {
      setRegisterError("비밀번호를 입력해 주세요.");
      return false;
    }

    if (!userPwdRe) {
      setRegisterError("비밀번호 확인을 입력해 주세요.");
      return false;
    }

    if (!userName) {
      setRegisterError("이름을 입력해 주세요.");
      return false;
    }

    if (!userBirthY || !userBirthM || !userBirthD) {
      setRegisterError("생년월일을 입력해 주세요.");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // 기본 폼 제출 방지
    handleRegister();
  };

  const isIdMsgClear = () => {
    setIdChkMsg("");
    setIsIdChecked(true);
  };

  const checkDuplicate = async () => {
    if (!isIdEmptyChk()) {
      return;
    } else {
      isIdMsgClear();
    }

    if (!userIdCheck(userId)) {
      setIdChkMsg("아이디 형식이 올바르지 않습니다.");
      setIsIdChecked(false);
      return;
    } else {
      isIdMsgClear();
    }

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
      setIdChkMsg(data.message);
      console.log("아이디 중복 확인 성공 성공:", data);

      if (!data.isIdUnique) {
        setIsIdChecked(false);
      } else {
        setIsIdChecked(true);
      }
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
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h1 style={{ textAlign: "center", color: "#3d72b4" }}>회 원 가 입</h1>
        <div className={styles.loginBox}>
          <div className={styles.idInputbox}>
            <input
              type="text"
              id="userId"
              placeholder="아이디"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              onBlur={(e) => userIdCheck(e.target.value)}
              required
              className={styles.idInputField}
            />
            <button
              type="button"
              onClick={checkDuplicate}
              className={styles.duplicateCheckButton}
            >
              중복확인
            </button>
          </div>
          <div className={styles.idInfo}>
            아이디는 영문 대소문자, 숫자 등을 사용하여 4~20자로 입력해주세요
          </div>
          {idChkMsg && (
            <p style={{ marginTop: "0px" }}>
              <Alert severity={isIdChecked ? "success" : "error"}>
                {idChkMsg}
              </Alert>
            </p>
          )}

          <div>
            <input
              type="password"
              id="userPwd"
              placeholder="비밀번호"
              value={userPwd}
              onChange={(e) => setUserPwd(e.target.value)}
              onBlur={(e) => passwordCheck(e.target.value)}
              required
              className={styles.inputField}
            />
          </div>

          <div className={styles.pwdInfo}>
            비밀번호는 영문 대소문자, 숫자를 혼합하여 8~20자로 입력해주세요
          </div>

          <div>
            <input
              type="password"
              id="userPwdRe"
              placeholder="비밀번호 확인"
              value={userPwdRe}
              onChange={(e) => setUserPwdRe(e.target.value)}
              onBlur={(e) => passwordCheck(e.target.value)}
              required
              className={styles.inputField}
            />
          </div>

          {pwdChkMsg && (
            <p style={{ marginTop: "0px" }}>
              <Alert severity={isPwdChecked ? "success" : "error"}>
                {pwdChkMsg}
              </Alert>
            </p>
          )}

          <div>
            <input
              type="text"
              id="userName"
              placeholder="이름"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              className={styles.inputField}
            />
          </div>

          <div className={styles.birthDateContainer}>
            <input
              type="text"
              id="userBirthY"
              placeholder="생년월일 (YYYY)"
              value={userBirthY}
              onChange={(e) => setUserBirthY(e.target.value)}
              required
              className={styles.birthInputField}
            />
            <input
              type="text"
              id="userBirthM"
              placeholder="MM"
              value={userBirthM}
              onChange={(e) => setUserBirthM(e.target.value)}
              required
              className={styles.birthInputField}
            />
            <input
              type="text"
              id="userBirthD"
              placeholder="DD"
              value={userBirthD}
              onChange={(e) => setUserBirthD(e.target.value)}
              required
              className={styles.birthInputField}
            />
          </div>

          <button className={styles.registerButton} type="submit">
            가입하기
          </button>
          {registerError && <p style={{ color: "red" }}>{registerError}</p>}
        </div>

        <div style={{ textAlign: "center", marginTop: "1em" }}>
          이미 계정이 있으신가요?{" "}
          <button onClick={handleLoginClick} className={styles.loginButton}>
            로그인
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
