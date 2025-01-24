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

  const [registerErrorMsg, setRegisterErrorMsg] = useState("");
  const [registerErrorChk, setRegisterChkError] = useState(false);

  const [idChkMsg, setIdChkMsg] = useState("");
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [pwdChkMsg, setPwdChkMsg] = useState("");
  const [isPwdChecked, setIsPwdChecked] = useState(false);
  const [birthChkMsg, setBirthChkMsg] = useState("");
  const [isBirthChecked, setIsBirthChecked] = useState(false);
  const [isNameChecked, setIsNameChecked] = useState(false);

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

  // 생년월일 확인
  const birthCheck = () => {
    const birthMessage = {
      format: "생년월일 형식을 확인해주세요.",
    };

    const validateBirthFormat = () => {
      const isYearValid = /^\d{4}$/.test(userBirthY);
      const isMonthValid = /^\d{2}$/.test(userBirthM);
      const isDayValid = /^\d{2}$/.test(userBirthD);

      if (!isYearValid || !isMonthValid || !isDayValid) {
        return birthMessage.format;
      }
    };

    let error;
    if (userBirthY && userBirthM && userBirthD) {
      error = validateBirthFormat();
    } else {
      setBirthChkMsg("");
      setIsBirthChecked(false);
      return;
    }

    if (error) {
      setBirthChkMsg(error);
      setIsBirthChecked(false);
      return error;
    } else {
      setBirthChkMsg("");
      setIsBirthChecked(true);
      return;
    }
  };

  const handleRegister = async () => {
    // 비어있는 항목 확인
    if (!checkEmptyField()) return;

    // 아이디 형식 체크
    if (!userIdCheck(userId)) {
      setRegisterErrorMsg("아이디 형식이 올바르지 않습니다.");
      setRegisterChkError(false);
      return;
    }

    // 비밀번호 형식, 일치 여부 체크
    if (!passwordCheck(userPwd)) {
      setRegisterErrorMsg("비밀번호 형식이 올바르지 않습니다.");
      setRegisterChkError(false);
      return;
    }

    // id 중복확인 했는지 확인
    if (!isIdChecked) {
      setRegisterErrorMsg("아이디 중복을 확인해 주세요.");
      setRegisterChkError(false);
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
      setRegisterErrorMsg(e.message);
      setRegisterChkError(false);
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
      setRegisterErrorMsg("비밀번호를 입력해 주세요.");
      setRegisterChkError(false);
      return;
    }

    if (!userPwdRe) {
      setRegisterErrorMsg("비밀번호 확인을 입력해 주세요.");
      setRegisterChkError(false);
      return;
    }

    if (!userName) {
      setRegisterErrorMsg("이름을 입력해 주세요.");
      setRegisterChkError(false);
      return;
    }

    if (!userBirthY || !userBirthM || !userBirthD) {
      setRegisterErrorMsg("생년월일을 입력해 주세요.");
      setRegisterChkError(false);
      return;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("아이디", isIdChecked);
    console.log("비밀번호", isPwdChecked);
    if (userName !== null) {
      setIsNameChecked(true);
    } else {
      setIsNameChecked(false);
    }
    console.log("이름", isNameChecked);
    console.log("생년월일", isBirthChecked);
    // handleRegister();
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

          <div>
            <div className={styles.birthDateContainer}>
              <input
                type="text"
                id="userBirthY"
                placeholder="생년월일 (YYYY)"
                value={userBirthY}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,4}$/.test(value)) {
                    setUserBirthY(value);
                  }
                }}
                onBlur={(e) => birthCheck()}
                required
                className={styles.birthInputField}
              />

              <input
                type="text"
                id="userBirthM"
                placeholder="MM"
                value={userBirthM}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,2}$/.test(value)) {
                    setUserBirthM(value);
                  }
                }}
                onBlur={(e) => birthCheck()}
                required
                className={styles.birthInputField}
              />
              <input
                type="text"
                id="userBirthD"
                placeholder="DD"
                value={userBirthD}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,2}$/.test(value)) {
                    setUserBirthD(value);
                  }
                }}
                onBlur={(e) => birthCheck()}
                required
                className={styles.birthInputField}
              />
            </div>
            {birthChkMsg && (
              <p style={{ marginTop: "0px" }}>
                <Alert severity={isBirthChecked ? "success" : "error"}>
                  {birthChkMsg}
                </Alert>
              </p>
            )}
          </div>

          <button className={styles.registerButton} type="submit">
            가입하기
          </button>
          {registerErrorMsg && (
            <p style={{ marginTop: "0px" }}>
              <Alert severity={registerErrorChk ? "success" : "error"}>
                {registerErrorMsg}
              </Alert>
            </p>
          )}
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
