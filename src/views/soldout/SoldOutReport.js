import { useState, useEffect } from "react";
import axios from "axios";
import { CSpinner } from "@coreui/react";
import { Redirect } from "react-router-dom";

const SoldOutReport = () => {
  const [loading, setLoadig] = useState(true);
  const [redirect, setRedirect] = useState(false);

  const getReport = (token) => {
    axios({
      method: "get",
      url: "https://sadmin.piclick.kr/report/soldout",
      headers: {
        Authorization: `JWT ${token}`,
      },
    })
      .then((res) => {
        setLoadig(false);
        console.log(res);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          sessionStorage.removeItem("userToken");
          sessionStorage.removeItem("userName");
          setRedirect(true);
        }
      });
  };

  useEffect(() => {
    const token = sessionStorage.getItem("userToken");
    if (token === null || token === undefined) {
      setRedirect(true);
    }
    getReport(token);
  }, []);

  if (redirect) {
    return <Redirect from="*" to="/login" />;
  }

  return loading ? (
    <div className="d-flex justify-content-center align-items-center">
      <CSpinner color="primary" style={{ width: "4rem", height: "4rem" }} />
    </div>
  ) : (
    <div>hello world from Chart</div>
  );
};

export default SoldOutReport;
