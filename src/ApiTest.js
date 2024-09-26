import React, { useEffect, useState } from "react";
import axios from "axios";

const ApiTest = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/sooz/apiTest");
        setData(response.data);
      } catch (err) {
        console.log("error가 발생했습니다.");
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>API 테스트</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default ApiTest;
