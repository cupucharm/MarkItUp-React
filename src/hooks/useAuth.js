import { useState } from "react";

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/sooz/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("로그아웃 실패");
      }

      const data = await response.json();
      if (data.status === true) {
        sessionStorage.clear();
        console.log("로그아웃 성공:", data);
        setIsLoggedIn(false);
      } else {
        console.log("로그아웃 실패:", data);
        alert(data.message);
      }
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  return { isLoggedIn, setIsLoggedIn, handleLoginSuccess, handleLogout };
};
