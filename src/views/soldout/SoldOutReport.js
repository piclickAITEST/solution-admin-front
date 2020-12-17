import { useState, useEffect } from "react";
import axios from "axios";
import { CCard, CCardBody, CCardHeader, CSpinner } from "@coreui/react";
import { Redirect } from "react-router-dom";
import unknown from "core-js/stable";

const SoldOutReport = () => {
  const token = sessionStorage.getItem("userToken");
  const [loading, setLoadig] = useState(true);
  const [redirect, setRedirect] = useState(false);
  const [reports, setReports] = useState([]);

  /* 필터 제작 전 임시 일일 값 */

  const clear = () => {
    setLoadig(true);
    setRedirect(false);
  };

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
        if (res.data === undefined || res.data === null) {
          setReports([]);
          return;
        } else {
          setReports(res.data);
          // console.log(res.data[0]);
        }
      })
      .catch((error) => {
        if (error.response === undefined) {
          console.log("error: 500");
          return;
        } else {
          if (error.response.status) {
            sessionStorage.removeItem("userToken");
            sessionStorage.removeItem("userName");
            setRedirect(true);
          }
        }
      });
  };

  useEffect(() => {
    if (token === null || token === undefined) {
      setRedirect(true);
    }
    getReport(token);

    return () => clear();
  }, [token]);

  if (redirect === true) {
    sessionStorage.removeItem("userToken");
    sessionStorage.removeItem("userName");
    return <Redirect from="*" to="/login" />;
  }

  return loading ? (
    <div className="d-flex justify-content-center align-items-center">
      <CSpinner color="primary" style={{ width: "4rem", height: "4rem" }} />
    </div>
  ) : (
    <CCard>
      <CCardHeader>통계(월간)</CCardHeader>
      <CCardBody>
        <table className="table table-outline mb-0 d-none d-sm-table">
          <thead className="thead-light">
            <tr>
              {/*           
                date,
                exchange_conv_count,
                exchange_conv_rate,
                exchange_conv_sum,
                message_sent_count,
                order_count,
                reco_view_count,
                refund_count,
                refund_rate,
                refund_sum,
                save_conv_count,
                save_conv_rate,
                save_conv_sum,
                soldout_conv_count,
                soldout_conv_rate,
                unknown_user_count,
                user_count, */}
              <th className="text-center">날짜</th>
              <th className="text-center">교환 전환수</th>
              <th className="text-center">교환 전환율</th>
              <th className="text-center">교환 전환합계</th>
              <th className="text-center">메시지 발송 수</th>
              <th className="text-center">주문 수</th>
              <th className="text-center">추천 조회수</th>
              <th className="text-center">환불 횟수</th>
              <th className="text-center">환불 환불율</th>
              <th className="text-center">환불 합계</th>
              <th className="text-center">적립 전환수</th>
              <th className="text-center">적립 전환율</th>
              <th className="text-center">적립 전환합계</th>
              <th className="text-center">품절 수</th>
              <th className="text-center">품절율</th>
              <th className="text-center">비회원 수</th>
              <th className="text-center">회원 수</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => {
              const {
                date,
                exchange_conv_count,
                exchange_conv_rate,
                exchange_conv_sum,
                message_sent_count,
                order_count,
                reco_view_count,
                refund_count,
                refund_rate,
                refund_sum,
                save_conv_count,
                save_conv_rate,
                save_conv_sum,
                soldout_conv_count,
                soldout_conv_rate,
                unknown_user_count,
                user_count,
              } = report;
              return (
                <tr key={date}>
                  <td className="text-center">{date}</td>
                  <td className="text-center">{exchange_conv_count}</td>
                  <td className="text-center">{exchange_conv_rate}</td>
                  <td className="text-center">{exchange_conv_sum}</td>
                  <td className="text-center">{message_sent_count}</td>
                  <td className="text-center">{order_count}</td>
                  <td className="text-center">{reco_view_count}</td>
                  <td className="text-center">{refund_count}</td>
                  <td className="text-center">{refund_rate}</td>
                  <td className="text-center">{refund_sum}</td>
                  <td className="text-center">{save_conv_count}</td>
                  <td className="text-center">{save_conv_rate}</td>
                  <td className="text-center">{save_conv_sum}</td>
                  <td className="text-center">{soldout_conv_count}</td>
                  <td className="text-center">{soldout_conv_rate}</td>
                  <td className="text-center">{unknown_user_count}</td>
                  <td className="text-center">{user_count}</td>
                </tr>
              );
            })}
            <tr></tr>
          </tbody>
        </table>
      </CCardBody>
    </CCard>
  );
};

export default SoldOutReport;
